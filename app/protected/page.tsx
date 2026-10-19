import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { KanbanBoard, type Application } from "./kanban-board";

async function ApplicationsBoard() {
  const supabase = await createClient();

  // 1. Make sure someone is logged in
  const { data: claimsData, error: authError } = await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  // 2. Load this user's applications, newest first
  const { data, error } = await supabase
    .from("applications")
    .select("id, company, role, status, applied_on, job_url")
    .order("created_at", { ascending: false });

  // 3. Show an error if loading failed, otherwise the board
  if (error) {
    return (
      <div className="rounded-[14px] border border-status-rejected/30 bg-status-rejected-bg p-6 text-sm text-status-rejected">
        Could not load applications: {error.message}
      </div>
    );
  }

  return <KanbanBoard applications={(data ?? []) as Application[]} />;
}

export default function ProtectedPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[20px] border bg-card p-10 text-center text-sm text-muted-foreground">
          Loading applications…
        </div>
      }
    >
      <ApplicationsBoard />
    </Suspense>
  );
}