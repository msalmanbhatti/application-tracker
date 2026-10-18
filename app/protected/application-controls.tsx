"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteApplication, updateStatus } from "./actions";

const STATUS_OPTIONS = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export function StatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      key={status}
      aria-label="Change status"
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const newStatus = e.target.value;
        startTransition(() => updateStatus(id, newStatus));
      }}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function DeleteButton({ id, company }: { id: string; company: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Delete application at ${company}`}
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete your application at ${company}?`)) return;
        startTransition(() => deleteApplication(id));
      }}
    >
      <Trash2 size={16} />
    </Button>
  );
}