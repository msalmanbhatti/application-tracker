import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-muted-foreground">Hey there!</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-5 text-sm">
      <Link href="/auth/login" className="font-medium hover:text-muted-foreground">
        Sign in
      </Link>
      <Button asChild className="h-10 px-4">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}