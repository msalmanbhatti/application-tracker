"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const OPTIONS = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // The theme is only known in the browser, so wait until we're mounted
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-[40px] w-[72px]" aria-hidden />;
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex gap-0.5 rounded-full border bg-muted p-[3px]"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = resolvedTheme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}