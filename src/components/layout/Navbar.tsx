"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModeToggle from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [user, setUser] = useState<unknown>(null);

  // ✅ Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // ✅ Listen to sign-in/sign-out changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/coaching", label: "البرامج" },
    { href: "/contact", label: "تواصل" },
  ];

  // ✅ Sign out logic
  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl">
          Yousef Coaching
        </Link>

        <div className="flex items-center gap-2">
          {/* Static site links */}
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

          {/* Auth-based buttons */}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm ${
                  pathname === "/dashboard" ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                لوحة التحكم
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                خروج
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className={`px-3 py-2 rounded-md text-sm ${
                pathname === "/login" ? "bg-muted" : "hover:bg-muted/60"
              }`}
            >
              تسجيل الدخول
            </Link>
          )}

          {/* Theme toggle */}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
