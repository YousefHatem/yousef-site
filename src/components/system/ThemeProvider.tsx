// src/components/system/ThemeProvider.tsx
"use client";
import { ThemeProvider as NextThemes } from "next-themes";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system" // or "light"
      enableSystem
      enableColorScheme={false} // avoid style="color-scheme: …" mismatch
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
