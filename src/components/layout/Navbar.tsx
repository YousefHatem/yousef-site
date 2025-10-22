"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import ModeToggle from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load session and role on mount and on auth changes
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;
      if (!mounted) return;

      setUser(u);
      if (u) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .maybeSingle();

        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    // initial load
    load();

    // listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/coaching", label: "البرامج" },
    { href: "/contact", label: "تواصل" },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
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

          {/* Auth-based nav */}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm ${
                  pathname.startsWith("/dashboard")
                    ? "bg-muted"
                    : "hover:bg-muted/60"
                }`}
              >
                لوحة التحكم
              </Link>

              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className={`px-3 py-2 rounded-md text-sm ${
                    pathname.startsWith("/dashboard/admin")
                      ? "bg-muted"
                      : "hover:bg-muted/60"
                  }`}
                >
                  لوحة الإدارة
                </Link>
              )}

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
