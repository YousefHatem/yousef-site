import ContactClient from "@/components/contact/ContactClient";
import WhatsAppButton from "@/components/common/WhatsAppButton";

// ...
<WhatsAppButton
  message="مرحباً يوسف! 👋 أريد التواصل معك."
  label="تواصل عبر واتساب"
/>;

export const metadata = {
  title: "تواصل معنا | Yousef Coaching",
  description: "تواصل مع يوسف عبر النموذج أو مباشرة عبر واتساب وإنستغرام.",
};

export default function ContactPage() {
  return (
    <section
      className="relative flex items-center justify-center min-h-[90vh] py-16 px-6 
                 bg-linear-to-b from-gray-950 via-gray-900 to-black text-white"
    >
      {/* background blur light effect */}
      <div className="absolute inset-0 bg-[url('/bg-home.jpg')] bg-cover bg-center opacity-20 blur-sm" />

      {/* gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/90" />

      {/* content container */}
      <div
        className="relative z-10 w-full max-w-3xl text-center backdrop-blur-xl 
                   bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl
                   animate-fade-in"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          تواصل معنا
        </h1>

        <p className="text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">
          يمكنك التواصل مباشرة عبر واتساب أو إنستغرام، أو إرسال رسالة عبر البريد
          الإلكتروني.
        </p>

        {/* Contact Form + Socials */}
        <div className="mt-10">
          <ContactClient />
        </div>
      </div>
    </section>
  );
}
