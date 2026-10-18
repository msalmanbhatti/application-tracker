"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"];

export async function addApplication(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const jobUrl = String(formData.get("job_url") ?? "").trim();
  const status = String(formData.get("status") ?? "wishlist");

  if (!company || !role) return;

  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert({
    company,
    role,
    job_url: jobUrl || null,
    status,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/protected");
}

export async function updateStatus(id: string, status: string) {
  // Never trust input blindly: only accept the 5 known statuses
  if (!STATUSES.includes(status)) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/protected");
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/protected");
}