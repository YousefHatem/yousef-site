import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

export default async function EditPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  const { data: plan } = await supabase
    .from("plans")
    .select("id, title, section, description, sheet_url, pdf_path, is_active")
    .eq("id", params.id)
    .maybeSingle();

  if (!plan) return <p className="p-4">الخطة غير موجودة.</p>;

  async function save(formData: FormData) {
    "use server";
    const { supabase, isAdmin } = await requireAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const id = String(formData.get("id"));
    const title = String(formData.get("title") || "");
    const section = String(formData.get("section") || "training");
    const description = String(formData.get("description") || "");
    const sheet_url = String(formData.get("sheet_url") || "");
    const is_active = formData.get("is_active") === "on";

    const pdfFile = formData.get("pdf") as File | null;

    let pdf_path: string | null | undefined = undefined; // undefined = don't change, null = clear
    if (pdfFile && pdfFile.size > 0) {
      // optional: delete old file
      const { data: before } = await supabase
        .from("plans")
        .select("pdf_path")
        .eq("id", id)
        .maybeSingle();
      if (before?.pdf_path)
        await supabase.storage.from("plans").remove([before.pdf_path]);

      const ext = (pdfFile.name.split(".").pop() || "pdf").toLowerCase();
      const newPath = `pdfs/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("plans")
        .upload(newPath, pdfFile, {
          contentType: pdfFile.type || "application/pdf",
          upsert: false,
        });
      if (upErr) throw new Error(upErr.message);
      pdf_path = newPath;
    }

    const update: Record<string, unknown> = {
      title,
      section,
      description: description || null,
      sheet_url: sheet_url || null,
      is_active,
    };
    if (pdf_path !== undefined) update.pdf_path = pdf_path;

    const { error } = await supabase.from("plans").update(update).eq("id", id);
    if (error) throw new Error(error.message);

    redirect("/dashboard/admin/plans");
  }

  return (
    <section className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">تعديل الخطة</h1>
      <form action={save} className="space-y-3">
        <input type="hidden" name="id" defaultValue={plan.id} />
        <input
          className="border rounded p-2 w-full"
          name="title"
          defaultValue={plan.title}
          required
        />
        <select
          className="border rounded p-2 w-full"
          name="section"
          defaultValue={plan.section}
        >
          <option value="training">Training</option>
          <option value="meal">Meal</option>
          <option value="session">Session</option>
          <option value="other">Other</option>
        </select>
        <textarea
          className="border rounded p-2 w-full"
          name="description"
          defaultValue={plan.description ?? ""}
        />
        <input
          className="border rounded p-2 w-full"
          name="sheet_url"
          defaultValue={plan.sheet_url ?? ""}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            استبدال PDF (اختياري)
          </label>
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            className="border rounded p-2 w-full"
          />
          {plan.pdf_path && (
            <p className="text-xs text-muted-foreground">
              ملف موجود: {plan.pdf_path}
            </p>
          )}
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={plan.is_active}
          />
          <span>نشطة</span>
        </label>
        <button className="btn-gradient px-4 py-2 rounded">حفظ</button>
      </form>
    </section>
  );
}
