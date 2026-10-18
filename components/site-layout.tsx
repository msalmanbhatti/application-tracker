import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export function SiteHeader() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <Link href="/" className="font-bold text-base">
          Applyd
        </Link>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-10">
      <p>
        Built by{" "}
        <a
          href="https://github.com/msalmanbhatti"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline"
        >
          Salman Bhatti
        </a>{" "}
        with Next.js and Supabase
      </p>
      <ThemeSwitcher />
    </footer>
  );
}