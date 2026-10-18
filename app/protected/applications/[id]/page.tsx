import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { updateApplication } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  // 1. Read the id from the URL, e.g. /protected/applications/abc-123
  const { id } = await params;

  const supabase = await createClient();

  // 2. Make sure someone is logged in
  const { data: claimsData, error: authError } = await supabase.auth.getClaims();
  if (authError || !claimsData?.claims) {
    redirect("/auth/login");
  }

  // 3. Load this one application (RLS makes sure it belongs to the user)
  const { data: app } = await supabase
    .from("applications")
    .select("id, company, role, status, job_url, applied_on, notes")
    .eq("id", id)
    .maybeSingle();

  // 4. Show a "not found" page if it doesn't exist or isn't theirs
  if (!app) notFound();

  return (
    <form
      action={updateApplication.bind(null, app.id)}
      className="rounded-lg border p-4 grid gap-4 sm:grid-cols-2"
    >
      <div className="grid gap-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" defaultValue={app.company} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" defaultValue={app.role} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="job_url">Job link</Label>
        <Input
          id="job_url"
          name="job_url"
          type="url"
          placeholder="https://..."
          defaultValue={app.job_url ?? ""}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={app.status}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="wishlist">Wishlist</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="applied_on">Applied on</Label>
        <Input
          id="applied_on"
          name="applied_on"
          type="date"
          defaultValue={app.applied_on ?? ""}
        />
      </div>

      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          placeholder="Contact person, interview dates, what to prepare..."
          defaultValue={app.notes ?? ""}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit">Save changes</Button>
        <Button asChild variant="outline">
          <Link href="/protected">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

export default function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <Link href="/protected" className="text-sm text-muted-foreground hover:underline">
          ← Back to board
        </Link>
        <h1 className="font-bold text-3xl mt-2">Edit application</h1>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}