// src/components/layout/ModeToggle.tsx
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // show a neutral button until mounted to avoid SSR/CSR mismatch
  const current = (resolvedTheme ?? theme) as "light" | "dark" | undefined;
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      onClick={() => mounted && setTheme(next || "light")}
      className="px-3 py-2 text-sm rounded-md border hover:bg-muted"
      aria-label="Toggle theme"
    >
      {mounted ? (current === "dark" ? "☀️" : "🌙") : "🌓"}
    </button>
  );
}
