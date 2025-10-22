// src/app/dashboard/layout.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ In your setup, cookies() is async → await it
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // These must be synchronous functions that RETURN a string | undefined.
        // We read from the already awaited cookieStore.
        get: (name: string) => cookieStore.get(name)?.value,
        set() {}, // no-ops in RSC
        remove() {},
      },
    }
  );
  
  // 1) Require login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }


  // 2) Fetch profile (PT / admin flag)
 const { data: profile, error } = await supabase
   .from("profiles")
   .select("role, pt_active")
   .eq("id", user.id)
   .maybeSingle();
 console.log("PROFILE ERR", error, "PROFILE DATA", profile);


  // 3) Allow PT subscriber or admin
  const isAdmin = profile?.role === "admin";
  const isPT = !!profile?.pt_active;

  if (!(isAdmin || isPT)) {
    return (
      <section className="mx-auto max-w-2xl text-center space-y-4">
        <h1 className="text-2xl font-bold">لوحة التحكم متاحة لمشتركي PT</h1>
        <p className="text-muted-foreground">قم بالاشتراك للتفعيل.</p>
        <a
          className="btn-gradient inline-block px-6 py-3 rounded-lg"
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(
            "+",
            ""
          )}?text=${encodeURIComponent("أرغب بتفعيل اشتراك PT")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          تواصل للتفعيل
        </a>
      </section>
    );
  }

  // 4) Authorized → show dashboard
  return <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>;
}
