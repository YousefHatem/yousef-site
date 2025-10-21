/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value;
        },
        // no-ops to satisfy @supabase/ssr + eslint
        set(..._args: [string, string, Record<string, unknown>?]): void {},
        remove(..._args: [string, Record<string, unknown>?]): void {},
      },
    }
  );

  // 1) session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2) fetch profile by ID (correct column)
  let { data: profile } = await supabase
    .from("profiles")
    .select("id, role, pt_active, full_name")
    .eq("id", user.id)
    .maybeSingle();

  // 3) if missing, create one for the user (RLS insert policy required)
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.email ?? "User",
      role: "admin", // you can set 'admin' for your admin account
      pt_active: true, // and grant PT access
    });
    const { data: again } = await supabase
      .from("profiles")
      .select("id, role, pt_active, full_name")
      .eq("id", user.id)
      .maybeSingle();
    profile = again ?? null;
  }

  const isAdmin = ["admin", "coach"].includes(profile?.role ?? "");
  const hasAccess = isAdmin || !!profile?.pt_active;

  if (!hasAccess) {
    return (
      <section className="mx-auto max-w-2xl text-center space-y-4">
        <h1 className="text-2xl font-bold">لوحة التحكم متاحة لمشتركي PT</h1>
        <p className="text-muted-foreground">قم بالاشتراك للتفعيل.</p>
        <a
          className="btn-gradient inline-block px-6 py-3 rounded-lg"
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace("+", "")}?text=${encodeURIComponent("أرغب بتفعيل اشتراك PT")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          تواصل للتفعيل
        </a>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">{children}</div>
  );
}
