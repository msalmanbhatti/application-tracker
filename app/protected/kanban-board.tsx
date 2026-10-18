"use client";

import { useEffect, useId, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import { GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";import { updateStatus } from "./actions";
import { DeleteButton, StatusSelect } from "./application-controls";
import { Input } from "@/components/ui/input";

export type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  applied_on: string | null;
  job_url: string | null;
};

const COLUMNS = [
  { id: "wishlist", title: "Wishlist" },
  { id: "applied", title: "Applied" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
];

export function KanbanBoard({ applications }: { applications: Application[] }) {
  const dndId = useId();
  const [items, setItems] = useState(applications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  // When the server sends fresh data (e.g. after adding an application),
  // update the board with it
  useEffect(() => {
    setItems(applications);
  }, [applications]);

  // Sensors decide HOW a drag can start: with a mouse/finger or the keyboard
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const activeApp = items.find((app) => app.id === activeId) ?? null;

    // Only show cards whose company or role contains the search text
  const search = query.trim().toLowerCase();
  const visibleItems = search
    ? items.filter(
        (app) =>
          app.company.toLowerCase().includes(search) ||
          app.role.toLowerCase().includes(search),
      )
    : items;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return; // dropped outside any column

    const id = String(active.id);
    const newStatus = String(over.id);
    const app = items.find((a) => a.id === id);
    if (!app || app.status === newStatus) return; // dropped in the same column

    // 1. Update the screen immediately (optimistic update)
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );

    // 2. Save the change in the database in the background
    startTransition(() => updateStatus(id, newStatus));
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
           <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          type="search"
          placeholder="Search by company or role"
          aria-label="Search applications"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        {search && (
          <p className="text-sm text-muted-foreground">
            {visibleItems.length} of {items.length} applications
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            applications={visibleItems.filter((a) => a.status === column.id)}
          />
        ))}
      </div>

      {/* The floating copy of the card that follows your mouse while dragging */}
      <DragOverlay>
        {activeApp ? (
          <CardContent
            app={activeApp}
            isOverlay
            handle={<GripVertical size={16} className="mt-0.5 text-muted-foreground" />}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  id,
  title,
  applications,
}: {
  id: string;
  title: string;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      aria-label={title}
      className={`rounded-lg border p-3 flex flex-col gap-3 min-h-40 transition-colors ${
        isOver ? "bg-muted border-foreground/40" : "bg-muted/40"
      }`}
    >
      <h2 className="text-sm font-semibold flex items-center justify-between">
        {title}
        <span className="text-xs text-muted-foreground">{applications.length}</span>
      </h2>

      {applications.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-md">
          Drop here
        </p>
      ) : (
        applications.map((app) => <DraggableCard key={app.id} app={app} />)
      )}
    </section>
  );
}

function DraggableCard({ app }: { app: Application }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } =
    useDraggable({ id: app.id });

  return (
    <div ref={setNodeRef} className={isDragging ? "opacity-40" : undefined}>
      <CardContent
        app={app}
        handle={
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            aria-label={`Move ${app.company} to another column`}
            className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
        }
      />
    </div>
  );
}

function CardContent({
  app,
  handle,
  isOverlay = false,
}: {
  app: Application;
  handle: React.ReactNode;
  isOverlay?: boolean;
}) {
  return (
    <div
      className={`rounded-md border bg-background p-3 flex flex-col gap-3 ${
        isOverlay ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        {handle}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{app.company}</p>
          <p className="text-xs text-muted-foreground truncate">{app.role}</p>
        </div>
      </div>
            <div className="flex items-center justify-between gap-2">
        <StatusSelect id={app.id} status={app.status} />
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon">
            <Link
              href={`/protected/applications/${app.id}`}
              aria-label={`Edit application at ${app.company}`}
            >
              <Pencil size={16} />
            </Link>
          </Button>
          <DeleteButton id={app.id} company={app.company} />
        </div>
      </div>
    </div>
  );
}