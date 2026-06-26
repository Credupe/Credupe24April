"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Sun/Moon theme toggle. UI-only switch — does not alter any surrounding
 * layout, spacing, or typography. Ships with the same control height as
 * the neighbouring navbar controls (36px) so the existing header grid is
 * preserved.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-testid="theme-toggle-button"
      className={
        "relative inline-flex items-center h-9 w-16 rounded-full border border-border " +
        "bg-muted hover:bg-accent transition-colors duration-200 shrink-0 " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        className
      }
    >
      {/* track icons */}
      <span className="absolute left-2 flex items-center justify-center text-foreground/60">
        <Sun className="w-3.5 h-3.5" />
      </span>
      <span className="absolute right-2 flex items-center justify-center text-foreground/60">
        <Moon className="w-3.5 h-3.5" />
      </span>
      {/* moving thumb */}
      <span
        className={
          "absolute top-1 h-7 w-7 rounded-full bg-primary text-primary-foreground " +
          "shadow-sm flex items-center justify-center transition-[left] duration-200 " +
          (isDark ? "left-8" : "left-1")
        }
      >
        {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
}
