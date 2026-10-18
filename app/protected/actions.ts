"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addApplication(formData: FormData) {
  // 1. Read the values the user typed into the form
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const jobUrl = String(formData.get("job_url") ?? "").trim();
  const status = String(formData.get("status") ?? "wishlist");

  // 2. Stop if required fields are empty
  if (!company || !role) return;

  // 3. Save a new row in the applications table
  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert({
    company,
    role,
    job_url: jobUrl || null,
    status,
  });

  if (error) throw new Error(error.message);

  // 4. Tell Next.js to reload the dashboard so the new card appears
  revalidatePath("/protected");
}