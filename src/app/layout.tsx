// src/app/layout.tsx
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ToasterClient from "@/components/system/ToasterClient";
import ThemeProvider from "@/components/system/ThemeProvider";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "800"] });

export const metadata = {
  title: "Yousef Coaching",
  description: "Coaching website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 👇 allow class/style differences during hydration (theme)
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head />
      <body className={`${cairo.className} min-h-dvh antialiased`}>
        {/* Let the client decide the theme */}
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <ToasterClient />
        </ThemeProvider>
      </body>
    </html>
  );
}
