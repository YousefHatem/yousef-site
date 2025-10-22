// src/app/dashboard/admin/plans/assign/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n: string) => cookieStore.get(n)?.value,
        set() {},
        remove() {},
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, isAdmin: profile?.role === "admin" };
}

export default async function AssignPlanPage() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  // ⚠️ We list users from 'profiles' (make sure each user gets a profile row on first login)
  const [{ data: users }, { data: plans }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .order("full_name", { ascending: true }),
    supabase
      .from("plans")
      .select("id, title, section")
      .eq("is_active", true)
      .order("title"),
  ]);

  async function assign(formData: FormData) {
    "use server";
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Not allowed");

    const user_id = String(formData.get("user_id") || "");
    const plan_id = String(formData.get("plan_id") || "");
    const starts_at = String(formData.get("starts_at") || "");
    const ends_at = String(formData.get("ends_at") || "");
    const note = String(formData.get("note") || "");

    if (!user_id || !plan_id) throw new Error("الرجاء اختيار المستخدم والخطة");

    const { error } = await supabase.from("plan_assignments").insert({
      user_id,
      plan_id,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
      note: note || null,
    });
    if (error) throw new Error(error.message);
    // back to admin home (or you can redirect to /dashboard/admin/plans)
    redirect("/dashboard/admin");
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">إسناد خطة لمستخدم</h1>

      <form action={assign} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <div className="text-sm font-medium">المستخدم</div>
            <select
              name="user_id"
              className="border rounded p-2 w-full"
              required
            >
              <option value="">اختر مستخدم</option>
              {(users ?? []).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.id} {u.role ? `(${u.role})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <div className="text-sm font-medium">الخطة</div>
            <select
              name="plan_id"
              className="border rounded p-2 w-full"
              required
            >
              <option value="">اختر خطة</option>
              {(plans ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.section}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <div className="text-sm font-medium">تاريخ البدء (اختياري)</div>
            <input
              type="date"
              name="starts_at"
              className="border rounded p-2 w-full"
            />
          </label>

          <label className="space-y-2">
            <div className="text-sm font-medium">تاريخ الانتهاء (اختياري)</div>
            <input
              type="date"
              name="ends_at"
              className="border rounded p-2 w-full"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <div className="text-sm font-medium">ملاحظة (اختياري)</div>
          <textarea
            name="note"
            className="border rounded p-2 w-full"
            rows={3}
          />
        </label>

        <button className="btn-gradient px-5 py-2 rounded">إسناد</button>
      </form>

      <p className="text-sm text-muted-foreground">
        ملاحظة: تظهر للمستخدم الخطط المسندة له في <strong>/dashboard</strong>{" "}
        حسب القسم (التدريب / الوجبات / الجلسات).
      </p>
    </section>
  );
}
