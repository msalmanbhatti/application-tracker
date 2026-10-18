import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { addApplication } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  applied_on: string | null;
  job_url: string | null;
};

function AddApplicationForm() {
  return (
    <form
      action={addApplication}
      className="rounded-lg border p-4 grid gap-4 sm:grid-cols-2"
    >
      <div className="grid gap-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" placeholder="e.g. SAP" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" placeholder="e.g. Frontend Intern" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job_url">Job link (optional)</Label>
        <Input id="job_url" name="job_url" type="url" placeholder="https://..." />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue="wishlist"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Button type="submit" className="sm:col-span-2 sm:justify-self-start">
        Add application
      </Button>
    </form>
  );
}

async function ApplicationsList() {
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

  // 3. Handle the three possible situations: error, empty, or data
  if (error) {
    return (
      <p className="text-red-600">Could not load applications: {error.message}</p>
    );
  }

  const applications = (data ?? []) as Application[];

  if (applications.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No applications yet. Add your first one to get started.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {applications.map((app) => (
        <li
          key={app.id}
          className="rounded-lg border p-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold">{app.company}</p>
            <p className="text-sm text-muted-foreground">{app.role}</p>
          </div>
          <span className="text-xs rounded-full border px-3 py-1 capitalize">
            {app.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div>
        <h1 className="font-bold text-3xl">My applications</h1>
        <p className="text-muted-foreground">
          Track every internship application in one place.
        </p>
      </div>
      <AddApplicationForm />
      <Suspense
        fallback={<p className="text-muted-foreground">Loading applications…</p>}
      >
        <ApplicationsList />
      </Suspense>
    </div>
  );
}