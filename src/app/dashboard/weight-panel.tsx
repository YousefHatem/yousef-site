import { createSupabaseServer } from "@/lib/supabase-server";
import WeightForm from "./weight-form";

export default async function WeightPanel() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const { data: entries } = await (await supabase)
    .from("weight_entries")
    .select("*")
    .eq("user_id", user!.id)
    .order("entry_date", { ascending: false });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">تتبع الوزن</h2>
      <WeightForm />
      <ul className="space-y-2">
        {(entries ?? []).map((e) => (
          <li key={e.id} className="rounded border p-3 flex justify-between">
            <span>{new Date(e.entry_date).toLocaleDateString("ar")}</span>
            <span className="font-semibold">
              {Number(e.weight_kg).toFixed(1)} كجم
            </span>
            {e.note && <span className="text-muted-foreground">{e.note}</span>}
          </li>
        ))}
        {(!entries || entries.length === 0) && (
          <p className="text-muted-foreground">أضف أول قياس لك اليوم.</p>
        )}
      </ul>
    </div>
  );
}
