import WhatsAppBookingForm from "@/components/booking/WhatsAppBookingForm";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "الحجز | Yousef Coaching",
  description: "ارسل رسالة واتساب مع تفاصيلك للحجز.",
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          الحجز عبر واتساب
        </h1>
        <p className="text-muted-foreground">
          املأ التفاصيل وسيتم فتح واتساب برسالة جاهزة.
        </p>
      </header>

      <Card>
        <CardContent className="p-6">
          <WhatsAppBookingForm />
        </CardContent>
      </Card>
    </section>
  );
}
