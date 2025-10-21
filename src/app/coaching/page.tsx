import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export const metadata = {
  title: "البرامج | Yousef Coaching",
  description: "خطط تدريب وتغذية مخصصة مع متابعة أسبوعية.",
};

// Optional helper (only used if you keep any non-WhatsApp links)
function wa(message: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "972599484644"; // fallback
  const phone = raw.startsWith("+") ? raw.slice(1) : raw;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Keep it simple: store the WhatsApp message directly and use <WhatsAppButton />
type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  cta:
    | { label: string; message: string } // WhatsApp
    | { label: string; href: string }; // Regular link (rare)
};

const plans: Plan[] = [
  {
    name: "استشارة سريعة",
    price: "مجانية",
    period: "",
    cta: {
      label: "حجز استشارة",
      message: "مرحباً يوسف! أريد استشارة سريعة 15 دقيقة.",
    },
    features: [
      "مكالمة تعريفية 15 دقيقة",
      "تقييم هدفك الحالي",
      "تحديد الخطة الأنسب",
    ],
  },
  {
    name: "التدريب الشخصي (PT) واحد لواحد",
    price: "حسب الجلسة",
    period: "",
    cta: {
      label: "تواصل للتفاصيل",
      message: "مرحباً يوسف! أريد الاشتراك في التدريب الشخصي PT.",
    },
    features: [
      "جلسات مخصصة وجهًا لوجه",
      "تصحيح أداء التمارين على الفور",
      "برنامج تدريب + متابعة تغذية",
    ],
    highlighted: true,
  },
  {
    name: "تدريب أونلاين",
    price: "49$",
    period: "/ شهر",
    cta: {
      label: "ابدأ الآن",
      message: "مرحباً يوسف! أريد الاشتراك في التدريب الأونلاين.",
    },
    features: [
      "برنامج تدريب أسبوعي مخصص",
      "خطة تغذية بسيطة ومرنة",
      "متابعة أسبوعية ورسائل دعم",
    ],
  },
  {
    name: "VIP تحوّل كامل",
    price: "99$",
    period: "/ شهر",
    cta: {
      label: "تواصل واتساب",
      message: "مرحباً يوسف! أريد الاشتراك في باقة VIP.",
    },
    features: [
      "خطة تدريب + تغذية متقدمة",
      "مكالمتان شهريًا لتعديل الخطة",
      "متابعة يومية + مراجعة تقدم تفصيلية",
    ],
  },
];

export default function CoachingPage() {
  return (
    <section className="mx-auto max-w-6xl space-y-10">
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold">البرامج</h1>
        <p className="text-muted-foreground">
          اختر الخطة المناسبة، وكل شيء سيكون بالعربي وبشكل مبسّط.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={`h-full ${p.highlighted ? "ring-1 ring-primary/30" : ""}`}
          >
            <CardContent className="p-6 flex h-full flex-col gap-4 justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <div className="text-3xl font-extrabold">
                    {p.price}
                    <span className="text-base text-muted-foreground">
                      {p.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span>✅</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button pinned to bottom */}
              <div className="pt-2 mt-auto">
                {"message" in p.cta ? (
                  <WhatsAppButton
                    message={p.cta.message}
                    label={p.cta.label}
                    size="lg"
                    // variant="whatsapp" // if you added this variant
                  />
                ) : (
                  <Button
                    asChild
                    className="w-full"
                    variant={p.highlighted ? "gradient" : "default"}
                    size="lg"
                  >
                    <a
                      href={p.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.cta.label}
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        لست متأكدًا أي خطة تناسبك؟{" "}
        <a
          className="underline"
          href={wa("مرحباً يوسف! أحتاج مساعدة في اختيار الخطة المناسبة.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          تحدث معي على واتساب
        </a>
        .
      </p>
    </section>
  );
}
