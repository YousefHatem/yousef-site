// src/app/dashboard/admin/assign/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

/** For <select> options */
interface PlanSelect {
  id: string;
  title: string;
  section: string;
}
interface ProfileSelect {
  id: string;
  full_name: string | null;
  role: string | null;
}

/** Simple assignment row (no embedded relations) */
interface Assignment {
  id: string;
  user_id: string;
  plan_id: string;
  starts_at: string | null;
  ends_at: string | null;
  note: string | null;
  created_at: string;
}

/* ---------------------- auth / admin guard -------------------------- */

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

/* ------------------------- page component --------------------------- */

export default async function AssignPlanPage() {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  // Users and active plans for the <select> inputs
  const [{ data: usersRaw }, { data: plansRaw }] = await Promise.all([
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

  type RawUser = { id: string; full_name: string | null; role: string | null };
  type RawPlan = { id: string; title: string | null; section: string | null };

  const users: ProfileSelect[] = (usersRaw ?? []).map((u: RawUser) => ({
    id: String(u.id),
    full_name: u.full_name ?? null,
    role: u.role ?? null,
  }));

  const plans: PlanSelect[] = (plansRaw ?? []).map((p: RawPlan) => ({
    id: String(p.id),
    title: p.title ?? "",
    section: p.section ?? "",
  }));

  // Lookup maps
  const userById = new Map(users.map((u) => [u.id, u]));
  const planById = new Map(plans.map((p) => [p.id, p]));

  // Server Action: Assign
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

    revalidatePath("/dashboard/admin/plans/assign");
  }

  // Load assignments safely
  const { data: assignmentsData } = await supabase
    .from("plan_assignments")
    .select("id, user_id, plan_id, starts_at, ends_at, note, created_at")
    .order("created_at", { ascending: false });

  const assignments: Assignment[] = assignmentsData ?? [];

  // Server Action: Revoke
  async function revoke(formData: FormData) {
    "use server";
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Not allowed");

    const id = String(formData.get("id") || "");
    if (!id) throw new Error("Missing assignment id");

    const { error } = await supabase
      .from("plan_assignments")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/admin/plans/assign");
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">إسناد خطة لمستخدم</h1>
        <p className="text-muted-foreground">
          اختر مستخدمًا وخطة، ويمكنك تحديد مدة زمنية اختيارية.
        </p>
      </header>

      {/* Assign form */}
      <form action={assign} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <div className="text-sm font-medium">المستخدم</div>
            <select
              name="user_id"
              className="border rounded p-2 w-full text-black bg-white dark:text-white dark:bg-gray-800"
              required
            >
              <option value="">اختر مستخدم</option>
              {users.map((u) => (
                <option
                  key={u.id}
                  value={u.id}
                  className="text-black dark:text-white"
                >
                  {(u.full_name || u.id) + (u.role ? ` (${u.role})` : "")}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <div className="text-sm font-medium">الخطة</div>
            <select
              name="plan_id"
              className="border rounded p-2 w-full text-black bg-white dark:text-white dark:bg-gray-800"
              required
            >
              <option value="">اختر خطة</option>
              {plans.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  className="text-black dark:text-white"
                >
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

      {/* Assignments list */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">التعيينات الحالية</h2>

        {assignments.length > 0 ? (
          <ul className="space-y-2">
            {assignments.map((a) => {
              const u = userById.get(a.user_id);
              const p = planById.get(a.plan_id);
              return (
                <li
                  key={a.id}
                  className="border rounded p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">
                      {u?.full_name || a.user_id} ← {p?.title || a.plan_id}{" "}
                      {p?.section ? `(${p.section})` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {a.starts_at || "—"} إلى {a.ends_at || "—"}{" "}
                      {a.note ? ` • ${a.note}` : ""}
                    </div>
                  </div>
                  <form action={revoke}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="text-red-600 underline" type="submit">
                      إلغاء
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground">لا توجد تعيينات حالياً.</p>
        )}
      </section>
    </section>
  );
}
