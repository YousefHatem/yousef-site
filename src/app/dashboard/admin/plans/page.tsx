import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function PlansAdminPage() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return null;

  const { data: plans } = await supabase
    .from("plans")
    .select("id, title, section, is_active, created_at")
    .order("created_at", { ascending: false });

  async function deletePlan(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Not allowed");

    // (Optional) remove storage file if you want: fetch plan.pdf_path, then delete
    const { data: plan } = await supabase
      .from("plans")
      .select("pdf_path")
      .eq("id", id)
      .maybeSingle();

    if (plan?.pdf_path) {
      await supabase.storage.from("plans").remove([plan.pdf_path]);
    }
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  return (
    <section className="mx-auto max-w-6xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الخطط</h1>
        <Link
          href="/dashboard/admin/plans/new"
          className="btn-gradient px-4 py-2 rounded"
        >
          خطة جديدة
        </Link>
      </header>

      <ul className="space-y-2">
        {(plans ?? []).map((p) => (
          <li
            key={p.id}
            className="border rounded p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-muted-foreground">
                {p.section} • {p.is_active ? "نشطة" : "متوقفة"} •{" "}
                {new Date(p.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                className="underline"
                href={`/dashboard/admin/plans/${p.id}`}
              >
                تعديل
              </Link>
              <form action={deletePlan}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-red-600 underline" type="submit">
                  حذف
                </button>
              </form>
            </div>
          </li>
        ))}
        {(!plans || plans.length === 0) && (
          <p className="text-muted-foreground">لا توجد خطط.</p>
        )}
      </ul>
    </section>
  );
}
