import { GripVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { StatusPill, STATUSES } from "@/components/status-pill";

type PreviewApp = {
  company: string;
  role: string;
  status: string;
  date?: string;
};

const EXAMPLE_APPS: PreviewApp[] = [
  { company: "Figma", role: "UX Design Intern", status: "wishlist" },
  { company: "Notion", role: "Design Engineering Intern", status: "wishlist" },
  { company: "Stripe", role: "Product Design Intern", status: "applied", date: "Oct 12" },
  { company: "Linear", role: "Frontend Intern", status: "applied", date: "Oct 09" },
  { company: "Airbnb", role: "Product Intern", status: "applied", date: "Oct 08" },
  { company: "Google", role: "UX Design Intern", status: "interview", date: "Oct 04" },
  { company: "Canva", role: "Brand Design Intern", status: "interview", date: "Oct 02" },
  { company: "SAP", role: "Product Design Intern", status: "offer", date: "Sep 28" },
  { company: "Zalando", role: "UX Research Intern", status: "rejected", date: "Sep 20" },
  { company: "Revolut", role: "Product Design Intern", status: "rejected", date: "Sep 15" },
];

function PreviewCard({ app }: { app: PreviewApp }) {
  return (
    <div className="rounded-[10px] border bg-card p-3 shadow-[0_1px_2px_rgba(17,17,16,0.04)]">
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-muted-foreground/60" />
        <span className="flex h-6 w-6 items-center justify-center rounded-md border bg-muted text-[11px] font-semibold">
          {app.company.charAt(0)}
        </span>
        <span className="flex-1 truncate text-[13px] font-medium">{app.company}</span>
        <Pencil size={13} className="text-muted-foreground" />
        <Trash2 size={13} className="text-muted-foreground" />
      </div>
      <p className="mt-2 truncate text-xs text-muted-foreground">{app.role}</p>
      <div className="mt-3 flex items-center justify-between">
        <StatusPill status={app.status} withChevron />
        {app.date && (
          <span className="font-mono text-[11px] uppercase text-muted-foreground">
            {app.date}
          </span>
        )}
      </div>
    </div>
  );
}

export function BoardPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of the Applyd board with ten example applications in five columns"
      className="overflow-hidden rounded-[20px] border bg-card shadow-[0_24px_48px_-24px_rgba(17,17,16,0.18)]"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="hidden gap-1.5 sm:flex" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div>
            <p className="text-[15px] font-medium">My applications</p>
            <p className="text-xs text-muted-foreground">10 applications</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-60 items-center gap-2 rounded-[10px] border bg-muted px-3 text-[13px] text-muted-foreground md:flex">
            <Search size={15} />
            Search company or role
          </div>
          <span className="hidden font-mono text-[11px] uppercase text-muted-foreground md:inline">
            10 of 10
          </span>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-primary px-4 text-[13px] font-medium text-primary-foreground">
            <Plus size={15} />
            Add application
          </span>
        </div>
      </div>

      {/* Columns: scroll sideways on small screens */}
      <div className="overflow-x-auto bg-muted/60 p-6">
        <div className="grid min-w-[1000px] grid-cols-5 gap-4">
          {STATUSES.map((column) => {
            const apps = EXAMPLE_APPS.filter((a) => a.status === column.value);
            return (
              <div key={column.value} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[13px] font-medium">{column.label}</span>
                  <span className="rounded-full bg-secondary px-1.5 font-mono text-[11px] text-muted-foreground">
                    {apps.length}
                  </span>
                </div>
                {apps.map((app) => (
                  <PreviewCard key={app.company} app={app} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}