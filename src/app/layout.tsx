import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ToasterClient from "@/components/system/ToasterClient";
import ThemeProvider from "@/components/system/ThemeProvider";
import Footer from "@/components/layout/Footer";
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={`${cairo.className} min-h-dvh antialiased`}
      >
        <ThemeProvider>
          <Navbar />
          {/* ✅ Only one <main> tag */}
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
          <ToasterClient />
        </ThemeProvider>
      </body>
    </html>
  );
}
