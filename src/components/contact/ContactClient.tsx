"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Instagram, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

const MIN_MSG = 10;

function buildWhatsAppUrl(message: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const phone = raw.startsWith("+") ? raw.slice(1) : raw;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function ContactClient() {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const whatsappUrl = buildWhatsAppUrl("مرحباً يوسف! 👋 أريد التواصل معك.");
  const instagramUrl = "https://www.instagram.com/yourusername"; // ← ضع حسابك

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (msg.trim().length < MIN_MSG) {
      toast.error(`الرسالة قصيرة جدًا. اكتب على الأقل ${MIN_MSG} أحرف.`);
      return;
    }

    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        // Try to show API’s exact validation message
        let serverMsg = "حدث خطأ أثناء الإرسال.";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") serverMsg = data.error;
          // If your API returns a JSON array of issues, show the first one:
          const issues = JSON.parse(data?.error || "[]");
          if (Array.isArray(issues) && issues[0]?.message)
            serverMsg = issues[0].message;
        } catch {
          const text = await res.text().catch(() => "");
          if (text) serverMsg = text;
        }
        toast.error(serverMsg);
        return;
      }

      toast.success("✅ تم إرسال رسالتك بنجاح!");
      form.reset();
      setMsg("");
    } catch (err) {
      toast.error("❌ تعذّر الإرسال. حاول مجددًا.");
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* روابط التواصل السريعة */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          <MessageCircle size={20} />
          واتساب
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          <Instagram size={20} />
          إنستغرام
        </a>
      </div>

      {/* نموذج البريد */}
      <form onSubmit={handleSubmit} className="space-y-4 text-right mt-8">
        <Input name="name" placeholder="الاسم الكامل" required />
        <Input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          required
        />
        <div className="space-y-1">
          <Textarea
            name="message"
            placeholder="اكتب رسالتك هنا..."
            rows={5}
            required
            minLength={MIN_MSG} // HTML validation
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <div className="text-xs text-muted-foreground text-left">
            {msg.trim().length < MIN_MSG
              ? `الحد الأدنى ${MIN_MSG} أحرف (${MIN_MSG - msg.trim().length} متبقية)`
              : "جاهز للإرسال ✅"}
          </div>
        </div>
        <Button
          type="submit"
          className="btn-gradient px-6 py-4 text-base w-full sm:w-auto"
          disabled={sending}
        >
          <Send size={18} className="ml-2" />
          {sending ? "جارٍ الإرسال..." : "إرسال"}
        </Button>
      </form>
    </>
  );
}

