// src/app/dashboard/admin/page.tsx
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

export default async function AdminHome() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
      <ul className="list-disc pr-5">
        <li>
          <a className="underline" href="/dashboard/admin/plans">
            إدارة الخطط
          </a>
        </li>
        <li>
          <a className="underline" href="/dashboard/admin/assign">
            إسناد الخطط للمستخدمين
          </a>
        </li>
      </ul>
    </section>
  );
}
