// src\components\booking\page.tsx
export const metadata = {
  title: "الحجز | Yousef Coaching",
  description: "تواصل عبر واتساب لحجز موعد.",
};

function buildWhatsAppUrl(message: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const phone = raw.startsWith("+") ? raw.slice(1) : raw; // wa.me must not include '+'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function BookingPage() {
  const url = buildWhatsAppUrl("مرحباً يوسف! أريد حجز موعد للاشتراك 👋");

  return (
    <section className="mx-auto max-w-3xl space-y-6 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold">الحجز عبر واتساب</h1>
      <p className="text-muted-foreground">
        اضغط الزر وسيتم فتح محادثة واتساب برسالة جاهزة.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gradient inline-block px-6 py-4 rounded-xl text-base font-semibold"
      >
        افتح واتساب الآن
      </a>

      <p className="text-xs text-muted-foreground">
        تلميح: عدّل الرسالة كما تريد قبل الإرسال.
      </p>
    </section>
  );
}
