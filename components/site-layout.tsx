import Link from "next/link";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export function Logo({ size = "lg" }: { size?: "lg" | "sm" }) {
  const isLarge = size === "lg";
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-display font-semibold tracking-[-0.01em]"
    >
      <span
        className={`flex items-center justify-center rounded-md bg-foreground ${
          isLarge ? "h-7 w-7" : "h-6 w-6"
        }`}
      >
        <Check size={isLarge ? 16 : 14} strokeWidth={3} className="text-lime" />
      </span>
      <span className={isLarge ? "text-[22px]" : "text-[17px]"}>Applyd</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            <Link href="/#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-foreground">
              How it works
            </Link>
          </nav>
        </div>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <Logo size="sm" />
          <p className="text-[13px] text-muted-foreground">
            Built by{" "}
            <span className="font-medium text-foreground">Salman Bhatti</span>{" "}
            with Next.js and Supabase
          </p>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/msalmanbhatti/application-tracker"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}