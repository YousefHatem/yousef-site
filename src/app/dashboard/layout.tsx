import { createSupabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) redirect("/login");

  // fetch profile to check PT subscription
  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.pt_active) {
    // show CTA if not subscribed
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
