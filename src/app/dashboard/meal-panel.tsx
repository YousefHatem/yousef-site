import { createSupabaseServer } from "@/lib/supabase-server";
export default async function MealPanel() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const { data: meals } = await (await supabase)
    .from("meal_plan_items")
    .select("*")
    .eq("user_id", user!.id);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">خطة الوجبات</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {(meals ?? []).map((m) => (
          <div key={m.id} className="rounded border p-3">
            <div className="font-semibold">{m.meal_name}</div>
            <div>{m.items}</div>
            <div className="text-xs text-muted-foreground">
              {m.kcal ? `${m.kcal} kcal` : ""}{" "}
              {m.protein_g ? ` • ${m.protein_g}g بروتين` : ""}
            </div>
          </div>
        ))}
        {(!meals || meals.length === 0) && (
          <p className="text-muted-foreground">لم يتم إعداد خطة وجبات بعد.</p>
        )}
      </div>
    </div>
  );
}
