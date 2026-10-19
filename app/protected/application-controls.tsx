"use client";

import { useTransition } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { PILL_STYLES, STATUSES } from "@/components/status-pill";
import { deleteApplication, updateStatus } from "./actions";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    // The wrapper carries the pill colours; the real <select> sits on top, transparent
    <div
      className={`relative inline-flex items-center rounded-full ${
        PILL_STYLES[status] ?? PILL_STYLES.wishlist
      } ${isPending ? "opacity-50" : ""}`}
    >
      <span
        className="pointer-events-none absolute left-2 h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden
      />
      <select
        key={status}
        aria-label="Change status"
        defaultValue={status}
        disabled={isPending}
        onChange={(e) => {
          const newStatus = e.target.value;
          startTransition(() => updateStatus(id, newStatus));
        }}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-0.5 pl-5 pr-6 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {STATUSES.map((option) => (
          <option key={option.value} value={option.value} className="bg-card text-foreground">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        className="pointer-events-none absolute right-2"
        aria-hidden
      />
    </div>
  );
}

export function DeleteButton({ id, company }: { id: string; company: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={`Delete application at ${company}`}
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete your application at ${company}?`)) return;
        startTransition(() => deleteApplication(id));
      }}
      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}