// src/app/dashboard/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

type Row = {
  plan_id: string;
  starts_at: string | null;
  ends_at: string | null;
  plans: {
    id: string;
    title: string;
    section: "training" | "meal" | "session" | "other";
    description: string | null;
    sheet_url: string | null;
    pdf_path: string | null;
  } | null;
};

export default async function DashboardPage() {
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
  if (!user) {
    // layout should redirect already, but just in case:
    return <p>يرجى تسجيل الدخول…</p>;
  }

  // 1) Load assigned plans (all sections)
  const { data: assigned } = (await supabase
    .from("plan_assignments")
    .select(
      "plan_id, starts_at, ends_at, plans (id, title, section, description, sheet_url, pdf_path)"
    )
    .eq("user_id", user.id)
    .order("starts_at", { ascending: false })) as { data: Row[] | null };

  // 2) Build signed URLs for PDFs (if any)
  const withSigned = await Promise.all(
    (assigned ?? []).map(async (row) => {
      let pdfUrl: string | null = null;
      if (row.plans?.pdf_path) {
        const { data: signed } = await supabase.storage
          .from("plans")
          .createSignedUrl(row.plans.pdf_path, 60 * 60); // 1 hour
        pdfUrl = signed?.signedUrl ?? null;
      }
      return { ...row, pdfUrl };
    })
  );

  // Group by section (simple)
  const groups: Record<string, typeof withSigned> = {
    training: [],
    meal: [],
    session: [],
    other: [],
  };
  for (const r of withSigned) {
    const sec = r.plans?.section ?? "other";
    groups[sec].push(r);
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">الخطط المسندة إليك.</p>
      </header>

      {(["training", "meal", "session", "other"] as const).map((sec) => (
        <div key={sec} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {sec === "training"
                ? "التدريب"
                : sec === "meal"
                  ? "الوجبات"
                  : sec === "session"
                    ? "الجلسات"
                    : "أخرى"}
            </h2>
            {/* Optional: deep link to section pages */}
            <Link className="underline text-sm" href={`/dashboard/${sec}`}>
              عرض المزيد
            </Link>
          </div>

          {groups[sec].length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد خطط بعد.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groups[sec].map((row) => (
                <li key={row.plan_id} className="border rounded p-3 space-y-2">
                  <div className="font-semibold">{row.plans?.title}</div>
                  {!!row.plans?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {row.plans.description}
                    </p>
                  )}
                  <div className="flex gap-2 pt-1">
                    {!!row.plans?.sheet_url && (
                      <a
                        className="underline text-sm"
                        href={row.plans.sheet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        فتح Google Sheet
                      </a>
                    )}
                    {!!row.pdfUrl && (
                      <a
                        className="underline text-sm"
                        href={row.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        تنزيل PDF
                      </a>
                    )}
                  </div>
                  {(row.starts_at || row.ends_at) && (
                    <p className="text-xs text-muted-foreground">
                      {row.starts_at ? `من ${row.starts_at}` : ""}{" "}
                      {row.ends_at ? `إلى ${row.ends_at}` : ""}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
