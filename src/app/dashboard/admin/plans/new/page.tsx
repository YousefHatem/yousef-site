// src/app/dashboard/admin/plans/new/page.tsx
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

export default async function NewPlanPage() {
  // Initial guard for the page render
  const { isAdmin, user } = await requireAdmin();
  if (!isAdmin || !user) redirect("/dashboard");

  // Server Action (runs separately on POST)
  async function createPlan(formData: FormData) {
    "use server";

    // ✅ Revalidate admin & user inside the action
    const { supabase, isAdmin, user } = await requireAdmin();
    if (!isAdmin || !user) throw new Error("Unauthorized");

    const title = String(formData.get("title") ?? "");
    const section = String(formData.get("section") ?? "training");
    const description = String(formData.get("description") ?? "");
    const sheet_url = String(formData.get("sheet_url") ?? "");
    const pdfFile = formData.get("pdf") as File | null;

    if (!title.trim()) throw new Error("العنوان مطلوب");

    // Optional PDF upload (direct to Supabase Storage)
    let pdf_path: string | null = null;
    if (pdfFile && pdfFile.size > 0) {
      const ext = (pdfFile.name.split(".").pop() || "pdf").toLowerCase();
      pdf_path = `pdfs/${crypto.randomUUID()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("plans")
        .upload(pdf_path, pdfFile, {
          contentType: pdfFile.type || "application/pdf",
          upsert: false,
        });

      if (uploadErr) throw new Error(`فشل رفع الملف: ${uploadErr.message}`);
    }

    const { error } = await supabase.from("plans").insert({
      title,
      section, // 'training' | 'meal' | 'session' | 'other'
      description: description || null,
      sheet_url: sheet_url || null,
      pdf_path, // e.g. 'pdfs/uuid.pdf' in the private 'plans' bucket
      created_by: user.id,
    });

    if (error) throw new Error(error.message);

    redirect("/dashboard/admin/plans");
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">خطة جديدة</h1>

      <form
        action={createPlan}
        className="space-y-3"
        encType="multipart/form-data"
      >
        <input
          className="border rounded p-2 w-full"
          name="title"
          placeholder="العنوان"
          required
        />

        <select
          className="border rounded p-2 w-full"
          name="section"
          defaultValue="training"
        >
          <option value="training">Training</option>
          <option value="meal">Meal</option>
          <option value="session">Session</option>
          <option value="other">Other</option>
        </select>

        <textarea
          className="border rounded p-2 w-full"
          name="description"
          placeholder="الوصف (اختياري)"
        />

        <input
          className="border rounded p-2 w-full"
          name="sheet_url"
          placeholder="رابط Google Sheets (اختياري)"
          type="url"
        />

        <input
          className="border rounded p-2 w-full"
          type="file"
          name="pdf"
          accept="application/pdf"
        />

        <button className="btn-gradient px-4 py-2 rounded">حفظ</button>
      </form>
    </section>
  );
}
