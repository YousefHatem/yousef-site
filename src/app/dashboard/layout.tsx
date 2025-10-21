import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, pt_active")
    .eq("id", user.id)
    .maybeSingle();

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

  return <>{children}</>;
}
