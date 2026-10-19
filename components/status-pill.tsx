import { ChevronDown } from "lucide-react";

export const STATUSES = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
] as const;

// Full class names written out, so Tailwind can find them in the code
const PILL_STYLES: Record<string, string> = {
  wishlist: "bg-status-wishlist-bg text-status-wishlist",
  applied: "bg-status-applied-bg text-status-applied",
  interview: "bg-status-interview-bg text-status-interview",
  offer: "bg-status-offer-bg text-status-offer",
  rejected: "bg-status-rejected-bg text-status-rejected",
};

export function statusLabel(status: string) {
  return STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function StatusPill({
  status,
  withChevron = false,
}: {
  status: string;
  withChevron?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        PILL_STYLES[status] ?? PILL_STYLES.wishlist
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {statusLabel(status)}
      {withChevron && <ChevronDown size={11} aria-hidden />}
    </span>
  );
}