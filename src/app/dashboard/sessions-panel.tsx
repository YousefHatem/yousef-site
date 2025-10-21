import { createSupabaseServer } from "@/lib/supabase-server";

export default async function SessionsPanel() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const { data: sessions } = await (await supabase)
    .from("sessions")
    .select("*")
    .eq("user_id", user!.id)
    .order("starts_at");
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">المواعيد القادمة</h2>
      <ul className="space-y-2">
        {(sessions ?? []).map((s) => (
          <li key={s.id} className="rounded border p-3">
            <div>⏰ {new Date(s.starts_at).toLocaleString("ar")}</div>
            {s.location && <div>📍 {s.location}</div>}
            {s.note && (
              <div className="text-muted-foreground">ملاحظة: {s.note}</div>
            )}
          </li>
        ))}
        {(!sessions || sessions.length === 0) && (
          <p className="text-muted-foreground">لا توجد مواعيد بعد.</p>
        )}
      </ul>
    </div>
  );
}
