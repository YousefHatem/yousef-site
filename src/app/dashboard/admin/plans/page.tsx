// src/app/dashboard/admin/plans/page.tsx
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PlansListPage() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  const { data: plans } = await supabase
    .from("plans")
    .select("id, title, section, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الخطط</h1>
        <Button asChild>
          <Link href="/dashboard/admin/plans/new">خطة جديدة</Link>
        </Button>
      </div>
      <ul className="space-y-2">
        {(plans ?? []).map((p) => (
          <li key={p.id} className="border rounded p-3 flex justify-between">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-muted-foreground">
                {p.section} • {p.is_active ? "نشط" : "متوقف"}
              </div>
            </div>
            <Link className="underline" href={`/dashboard/admin/plans/${p.id}`}>
              تعديل
            </Link>
          </li>
        ))}
        {(!plans || plans.length === 0) && (
          <p className="text-muted-foreground">لا توجد خطط بعد.</p>
        )}
      </ul>
    </section>
  );
}
