"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "./ModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  // ✅ Define the nav links
const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/coaching", label: "البرامج" }, // ← this one
  { href: "/booking", label: "الحجز" },
  { href: "/contact", label: "تواصل" },
];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl">
          Yousef Coaching
        </Link>

        <div className="flex gap-2">
          {/* ✅ Map through the links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm ${
                pathname === link.href ? "bg-muted" : "hover:bg-muted/60"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* ✅ Theme toggle button */}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
