import BookingEmbed from "@/components/booking/BookingEmbed";

export const metadata = {
  title: "الحجز | Yousef Coaching",
  description: "احجز استشارة تدريب أو تغذية بكل سهولة.",
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">الحجز</h1>
        <p className="text-muted-foreground">
          اختر الوقت المناسب وسألتقي بك عبر مكالمة سريعة للتعرف على أهدافك.
        </p>
      </header>

      {/* Embed */}
      <BookingEmbed />

      <p className="text-center text-sm text-muted-foreground">
        في حال واجهت مشكلة في التحميل،{" "}
        <a
          className="underline"
          href={process.env.NEXT_PUBLIC_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          افتح رابط الحجز مباشرة
        </a>
        .
      </p>
    </section>
  );
}
