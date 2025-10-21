"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function WeightForm() {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function addEntry(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseFloat(weight);
    if (!kg || kg <= 0) return toast.error("أدخل وزنًا صحيحًا.");

    setLoading(true);
    const supabase = createSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("الرجاء تسجيل الدخول.");

    const { error } = await supabase.from("weight_entries").insert({
      user_id: user.id,
      weight_kg: kg,
      note: note || null,
    });

    if (error) toast.error(error.message);
    else {
      toast.success("تمت إضافة القياس ✨");
      setWeight("");
      setNote("");
      // force refresh dashboard data
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={addEntry} className="flex flex-col sm:flex-row gap-2">
      <Input
        placeholder="الوزن بالكيلو"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        inputMode="decimal"
        className="sm:w-40"
        required
      />
      <Input
        placeholder="ملاحظة (اختياري)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit" variant="gradient" disabled={loading}>
        {loading ? "جارٍ الحفظ..." : "حفظ"}
      </Button>
    </form>
  );
}
