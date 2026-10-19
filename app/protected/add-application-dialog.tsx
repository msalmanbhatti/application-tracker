"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUSES } from "@/components/status-pill";
import { addApplication } from "./actions";

// A separate component, because useFormStatus only works *inside* a form
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-10 px-4">
      {pending ? "Adding…" : "Add application"}
    </Button>
  );
}

export function AddApplicationDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function close() {
    formRef.current?.reset();
    dialogRef.current?.close();
  }

  async function handleSubmit(formData: FormData) {
    await addApplication(formData); // save on the server
    close(); // then clear the form and close the dialog
  }

  return (
    <>
      <Button
        onClick={() => dialogRef.current?.showModal()}
        className="h-10 shrink-0 px-4"
      >
        <Plus size={15} />
        Add application
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="add-application-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[14px] border bg-card p-0 text-foreground shadow-xl backdrop:bg-black/40"
      >
        <form ref={formRef} action={handleSubmit} className="grid gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="add-application-title"
                className="font-display text-[22px] font-semibold tracking-[-0.01em]"
              >
                Add application
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You can add notes and dates later.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-company">Company</Label>
            <Input id="new-company" name="company" placeholder="e.g. SAP" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-role">Role</Label>
            <Input id="new-role" name="role" placeholder="e.g. Frontend Intern" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-job-url">Job link (optional)</Label>
            <Input id="new-job-url" name="job_url" type="url" placeholder="https://..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-status">Status</Label>
            <select
              id="new-status"
              name="status"
              defaultValue="wishlist"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {STATUSES.map((option) => (
                <option key={option.value} value={option.value} className="bg-card">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close} className="h-10 px-4">
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </dialog>
    </>
  );
}