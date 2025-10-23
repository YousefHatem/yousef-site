import Link from "next/link";

export const metadata = { title: "لوحة الإدارة" };

export default function AdminHome() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">لوحة الإدارة</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/admin/plans"
          className="block rounded-xl border p-6 hover:bg-accent"
        >
          <h2 className="font-semibold mb-1">الخطط</h2>
          <p className="text-sm text-muted-foreground">
            إضافة / تعديل / إسناد الخطط.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="block rounded-xl border p-6 hover:bg-accent"
        >
          <h2 className="font-semibold mb-1">المستخدمون</h2>
          <p className="text-sm text-muted-foreground">
            البحث والتعديل وتحديث اشتراكات PT والجلسات الأسبوعية.
          </p>
        </Link>
      </div>
    </section>
  );
}
