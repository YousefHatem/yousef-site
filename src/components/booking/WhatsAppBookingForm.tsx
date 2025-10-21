"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function buildWhatsAppUrl(message: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const phone = raw.startsWith("+") ? raw.slice(1) : raw;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppBookingForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      goal: { value: string };
      time: { value: string };
    };

    const name = form.name.value.trim();
    const goal = form.goal.value.trim();
    const time = form.time.value.trim();

    const message =
      `مرحباً يوسف! 👋\n` +
      `أنا ${name}.\n` +
      `هدفي: ${goal || "—"}\n` +
      `الوقت المناسب للتواصل: ${time || "—"}`;

    const url = buildWhatsAppUrl(message);

    try {
      setLoading(true);
      window.open(url, "_blank");
    } finally {
      setLoading(false);
    }
  }

  const phoneMissing = !process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-right">
      <Input name="name" placeholder="اسمك" required />
      <Textarea
        name="goal"
        rows={4}
        placeholder="هدفك (خسارة وزن / زيادة عضل / لياقة)"
      />
      <Input name="time" placeholder="أفضل وقت للتواصل (مثال: مساءً بعد 6)" />

      <Button
        type="submit"
        className="btn-gradient px-6 py-5 text-base"
        disabled={loading || phoneMissing}
      >
        {phoneMissing
          ? "أضف رقم واتساب أولاً"
          : loading
            ? "جارٍ الفتح..."
            : "راسلني على واتساب"}
      </Button>

      {phoneMissing && (
        <p className="text-xs text-destructive">
          لم يتم ضبط رقم واتساب. أضف المتغير NEXT_PUBLIC_WHATSAPP_PHONE.
        </p>
      )}
    </form>
  );
}
