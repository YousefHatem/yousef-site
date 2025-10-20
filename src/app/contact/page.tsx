// 🚫 do NOT add "use client" here
import ContactForm from "./ContactForm";

export const metadata = {
  title: "تواصل | Yousef Coaching",
  description: "أرسل رسالة وسيتم الرد بأسرع وقت.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">تواصل</h1>
      <ContactForm />
    </section>
  );
}
