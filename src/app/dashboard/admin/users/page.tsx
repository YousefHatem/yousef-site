import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/** DB row shapes we use */
type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  pt_active: boolean | null;
  sub_type: string | null;
  sub_start: string | null; // date
  sub_end: string | null; // date
  height_cm: number | null;
  weight_kg: number | null;
};

type Plan = {
  id: string;
  title: string | null;
  section: string | null;
  is_active: boolean | null;
};

type Assignment = {
  id: string;
  user_id: string;
  plan_id: string;
  starts_at: string | null;
  ends_at: string | null;
  note: string | null;
  created_at: string;
};

type PTSess = {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  has_session: boolean;
  time: string | null; // HH:MM
};

async function requireAdmin() {
  const cookieStore = cookies(); // ✅ no await
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (n: string) => (await cookieStore).get(n)?.value,
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

function getWeekDates(start?: string): string[] {
  const base = start ? new Date(start) : new Date();
  base.setHours(0, 0, 0, 0);
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export const metadata = { title: "إدارة المستخدمين" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; uid?: string; week?: string };
}) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  const q = (searchParams.q || "").trim();
  const selectedUserId = (searchParams.uid || "").trim();

  // 1) search users
  const usersQuery = supabase
    .from("profiles")
    .select(
      "id, full_name, role, pt_active, sub_type, sub_start, sub_end, height_cm, weight_kg"
    )
    .order("full_name", { ascending: true });

  const { data: usersAll } = q
    ? await usersQuery.ilike("full_name", `%${q}%`)
    : await usersQuery;

  const users = (usersAll ?? []) as Profile[];

  // 2) selected user details
  let profile: Profile | null = null;
  let assignments: Assignment[] = [];
  let activePlans: Plan[] = [];
  let weekDates: string[] = [];
  let weekSessions: Record<string, PTSess> = {};

  if (selectedUserId) {
    // profile
    const { data: p } = await supabase
      .from("profiles")
      .select(
        "id, full_name, role, pt_active, sub_type, sub_start, sub_end, height_cm, weight_kg"
      )
      .eq("id", selectedUserId)
      .maybeSingle();
    profile = (p as Profile) || null;

    // assignments
    const { data: asg } = await supabase
      .from("plan_assignments")
      .select("id, user_id, plan_id, starts_at, ends_at, note, created_at")
      .eq("user_id", selectedUserId)
      .order("created_at", { ascending: false });
    assignments = (asg ?? []) as Assignment[];

    // plans
    const { data: plans } = await supabase
      .from("plans")
      .select("id, title, section, is_active")
      .eq("is_active", true)
      .order("title");
    activePlans = (plans ?? []) as Plan[];

    // PT sessions (7 days)
    weekDates = getWeekDates(searchParams.week);
    const { data: sess } = await supabase
      .from("pt_sessions")
      .select("id, user_id, date, has_session, time")
      .eq("user_id", selectedUserId)
      .in("date", weekDates);
    const map: Record<string, PTSess> = {};
    (sess ?? []).forEach((s) => (map[s.date] = s as PTSess));
    weekSessions = map;
  }

  // —— Server Actions ——
  async function updateProfile(formData: FormData) {
    "use server";
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Not allowed");

    const id = String(formData.get("id") || "");
    if (!id) throw new Error("Missing user id");

    const payload = {
      full_name: (formData.get("full_name") as string) || null,
      height_cm: formData.get("height_cm")
        ? Number(formData.get("height_cm"))
        : null,
      weight_kg: formData.get("weight_kg")
        ? Number(formData.get("weight_kg"))
        : null,
      sub_type: (formData.get("sub_type") as string) || null,
      pt_active: (formData.get("pt_active") as string) === "on",
      sub_start: (formData.get("sub_start") as string) || null,
      sub_end: (formData.get("sub_end") as string) || null,
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/admin/users");
  }

  async function assignPlan(formData: FormData) {
    "use server";
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Not allowed");

    const user_id = String(formData.get("user_id") || "");
    const plan_id = String(formData.get("plan_id") || "");
    const starts_at = String(formData.get("starts_at") || "");
    const ends_at = String(formData.get("ends_at") || "");
    if (!user_id || !plan_id) throw new Error("اختر المستخدم والخطة");

    const { error } = await supabase.from("plan_assignments").insert({
      user_id,
      plan_id,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/admin/users");
  }

  async function revokeAssignment(formData: FormData) {
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
    revalidatePath("/dashboard/admin/users");
  }

  async function upsertSession(formData: FormData) {
    "use server";
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Not allowed");

    const user_id = String(formData.get("user_id") || "");
    const date = String(formData.get("date") || "");
    const has_session = (formData.get("has_session") as string) === "on";
    const time = (formData.get("time") as string) || null;

    if (!user_id || !date) throw new Error("Missing user/date");

    const { error } = await supabase.from("pt_sessions").upsert(
      {
        user_id,
        date,
        has_session,
        time: has_session ? time : null,
      },
      { onConflict: "user_id,date" }
    );
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/admin/users");
  }

  // —— UI ——
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <p className="text-muted-foreground">
          ابحث عن المستخدم بالاسم، ثم عدّل بياناته واشتراك PT والتعيينات، وجدول
          الجلسات الأسبوعي.
        </p>
      </header>

      {/* Search */}
      <form className="flex gap-2" action="/dashboard/admin/users">
        <input
          name="q"
          defaultValue={q}
          placeholder="ابحث بالاسم…"
          className="border rounded p-2 w-full"
        />
        <button className="btn-gradient px-4 rounded">بحث</button>
      </form>

      {/* Results list */}
      <div className="border rounded p-3">
        <h2 className="font-semibold mb-2">المستخدمون</h2>
        <ul className="space-y-1 max-h-60 overflow-auto">
          {users.map((u) => {
            const href = {
              pathname: "/dashboard/admin/users",
              query: { q, uid: u.id },
            } as const;
            return (
              <li key={u.id}>
                <Link
                  className={`block rounded px-2 py-1 hover:bg-accent ${
                    selectedUserId === u.id ? "bg-muted" : ""
                  }`}
                  href={href}
                >
                  {(u.full_name || u.id) +
                    (u.role ? ` (${u.role})` : "") +
                    (u.pt_active ? " • PT" : "")}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User detail */}
      {profile && (
        <div className="space-y-10">
          {/* Profile form */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">بيانات المستخدم</h3>
            <form action={updateProfile} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" defaultValue={profile.id} />
              <label className="space-y-1">
                <div className="text-sm">الاسم</div>
                <input
                  name="full_name"
                  defaultValue={profile.full_name ?? ""}
                  className="border rounded p-2 w-full"
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm">نوع الاشتراك</div>
                <input
                  name="sub_type"
                  defaultValue={profile.sub_type ?? ""}
                  className="border rounded p-2 w-full"
                  placeholder="مثال: شهر / VIP"
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm">الطول (سم)</div>
                <input
                  type="number"
                  step="1"
                  name="height_cm"
                  defaultValue={profile.height_cm ?? ""}
                  className="border rounded p-2 w-full"
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm">الوزن (كغ)</div>
                <input
                  type="number"
                  step="0.1"
                  name="weight_kg"
                  defaultValue={profile.weight_kg ?? ""}
                  className="border rounded p-2 w-full"
                />
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="pt_active"
                  defaultChecked={!!profile.pt_active}
                />
                <span>PT مفعل</span>
              </label>

              <label className="space-y-1">
                <div className="text-sm">تاريخ البداية</div>
                <input
                  type="date"
                  name="sub_start"
                  defaultValue={profile.sub_start ?? ""}
                  className="border rounded p-2 w-full"
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm">تاريخ النهاية</div>
                <input
                  type="date"
                  name="sub_end"
                  defaultValue={profile.sub_end ?? ""}
                  className="border rounded p-2 w-full"
                />
              </label>

              <div className="md:col-span-2">
                <button className="btn-gradient px-5 py-2 rounded">
                  حفظ البيانات
                </button>
              </div>
            </form>
          </section>

          {/* Assignments */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">الخطط المسندة</h3>

            {/* Add assignment */}
            <form action={assignPlan} className="grid gap-2 md:grid-cols-4">
              <input type="hidden" name="user_id" value={profile.id} />
              <select name="plan_id" className="border rounded p-2" required>
                <option value="">اختر خطة</option>
                {activePlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.section ? `(${p.section})` : ""}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="starts_at"
                className="border rounded p-2"
                placeholder="بدء"
              />
              <input
                type="date"
                name="ends_at"
                className="border rounded p-2"
                placeholder="نهاية"
              />

              <button className="rounded border px-3">إسناد</button>
            </form>

            {/* List + revoke */}
            {assignments.length > 0 ? (
              <ul className="space-y-2">
                {assignments.map((a) => (
                  <li
                    key={a.id}
                    className="border rounded p-3 flex items-center justify-between"
                  >
                    <div className="text-sm">
                      <div className="font-medium">
                        خطة #{a.plan_id} — {a.starts_at || "—"} إلى{" "}
                        {a.ends_at || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.note || ""}
                      </div>
                    </div>
                    <form action={revokeAssignment}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="text-red-600 underline" type="submit">
                        إلغاء
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">لا توجد تعيينات حالياً.</p>
            )}
          </section>

          {/* PT weekly sessions — only if PT active */}
          {profile.pt_active && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">جلسات PT (7 أيام)</h3>

              <div className="grid gap-3 md:grid-cols-7">
                {weekDates.map((d) => {
                  const s = weekSessions[d];
                  const checked = s ? s.has_session : false;
                  const time = s ? s.time : "";

                  return (
                    <form
                      key={d}
                      action={upsertSession}
                      className="border rounded p-3 space-y-2"
                    >
                      <input type="hidden" name="user_id" value={profile!.id} />
                      <input type="hidden" name="date" value={d} />
                      <div className="text-sm font-medium">{d}</div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="has_session"
                          defaultChecked={checked}
                        />
                        <span>جلسة؟</span>
                      </label>
                      <input
                        type="time"
                        name="time"
                        defaultValue={time ?? ""}
                        className="border rounded p-1 w-full"
                      />
                      <button className="rounded border px-2 text-sm w-full">
                        حفظ
                      </button>
                    </form>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
}
