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
import { GripVertical, Pencil, Search, Trash2 } from "lucide-react";
import { StatusPill, STATUSES } from "@/components/status-pill";
import { updateStatus } from "./actions";
import { DeleteButton, StatusSelect } from "./application-controls";
import { AddApplicationDialog } from "./add-application-dialog";

export type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  applied_on: string | null;
  job_url: string | null;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-10-18" → "Oct 18". Done by hand so server and browser always agree.
function formatDate(date: string | null) {
  if (!date) return null;
  const [, month, day] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${day}`;
}

export function KanbanBoard({ applications }: { applications: Application[] }) {
  const dndId = useId();
  const [items, setItems] = useState(applications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  // When the server sends fresh data (e.g. after adding), update the board
  useEffect(() => {
    setItems(applications);
  }, [applications]);

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
    if (!over) return;

    const id = String(active.id);
    const newStatus = String(over.id);
    const app = items.find((a) => a.id === id);
    if (!app || app.status === newStatus) return;

    // 1. Update the screen immediately (optimistic update)
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    // 2. Save in the background
    startTransition(() => updateStatus(id, newStatus));
  }

  return (
    <div className="overflow-hidden rounded-[20px] border bg-card shadow-[0_24px_48px_-24px_rgba(17,17,16,0.18)]">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-lg font-semibold tracking-[-0.01em]">
            My applications
          </h1>
          <p className="text-xs text-muted-foreground">
            {items.length === 0
              ? "No applications yet. Add your first one."
              : `${items.length} application${items.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search company or role"
              aria-label="Search applications"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-[10px] border bg-muted pl-9 pr-3 text-[13px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <span className="font-mono text-[11px] uppercase text-muted-foreground" aria-live="polite">
            {visibleItems.length} of {items.length}
          </span>
          <AddApplicationDialog />
        </div>
      </div>

      {/* Columns: scroll sideways on small screens */}
      <DndContext
        id={dndId}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="overflow-x-auto bg-muted/60 p-6">
          <div className="grid min-w-[1000px] grid-cols-5 gap-4">
            {STATUSES.map((column) => (
              <Column
                key={column.value}
                id={column.value}
                title={column.label}
                emptyLabel={search ? "No matches" : "Drop here"}
                applications={visibleItems.filter((a) => a.status === column.value)}
              />
            ))}
          </div>
        </div>

        {/* The floating copy that follows the mouse while dragging */}
        <DragOverlay>{activeApp ? <CardContent app={activeApp} isOverlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

function Column({
  id,
  title,
  emptyLabel,
  applications,
}: {
  id: string;
  title: string;
  emptyLabel: string;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      aria-label={title}
      className={`-m-1.5 flex min-h-48 flex-col gap-2.5 rounded-[14px] p-1.5 transition-colors ${
        isOver ? "bg-lime-soft/60 ring-1 ring-lime" : ""
      }`}
    >
      <h2 className="flex items-center justify-between px-0.5 text-[13px] font-medium">
        {title}
        <span className="rounded-full bg-secondary px-1.5 font-mono text-[11px] text-muted-foreground">
          {applications.length}
        </span>
      </h2>

      {applications.length === 0 ? (
        <p className="rounded-[10px] border border-dashed py-6 text-center text-xs text-muted-foreground">
          {emptyLabel}
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
            className="cursor-grab touch-none text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical size={14} />
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
  handle?: React.ReactNode;
  isOverlay?: boolean;
}) {
  const date = formatDate(app.applied_on);

  return (
    <div
      className={`rounded-[10px] border bg-card p-3 ${
        isOverlay ? "rotate-1 shadow-lg" : "shadow-[0_1px_2px_rgba(17,17,16,0.04)]"
      }`}
    >
      <div className="flex items-center gap-2">
        {handle ?? <GripVertical size={14} className="text-muted-foreground/60" />}
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-muted text-[11px] font-semibold uppercase"
          aria-hidden
        >
          {app.company.charAt(0)}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{app.company}</span>

        {isOverlay ? (
          // The floating copy is just a picture, so plain icons instead of buttons
          <span className="flex gap-2 text-muted-foreground" aria-hidden>
            <Pencil size={14} />
            <Trash2 size={14} />
          </span>
        ) : (
          <span className="flex">
            <Link
              href={`/protected/applications/${app.id}`}
              aria-label={`Edit application at ${app.company}`}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Pencil size={14} />
            </Link>
            <DeleteButton id={app.id} company={app.company} />
          </span>
        )}
      </div>

      <p className="mt-1.5 truncate text-xs text-muted-foreground">{app.role}</p>

      <div className="mt-3 flex items-center justify-between">
        {isOverlay ? (
          <StatusPill status={app.status} withChevron />
        ) : (
          <StatusSelect id={app.id} status={app.status} />
        )}
        {date && (
          <span className="font-mono text-[11px] uppercase text-muted-foreground">{date}</span>
        )}
      </div>
    </div>
  );
}