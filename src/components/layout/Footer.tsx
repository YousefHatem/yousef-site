// src/components/layout/Footer.tsx
"use client";

import { Instagram, MessageCircle } from "lucide-react";

function buildWhatsAppUrl(message: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const phone = raw.startsWith("+") ? raw.slice(1) : raw;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function Footer() {
  const whatsappUrl = buildWhatsAppUrl(
    "مرحباً يوسف! 👋 أريد التواصل معك بخصوص التدريب."
  );
  const instagramUrl = "https://www.instagram.com/yousef_hatem___"; // 🔹 change to your real IG

  return (
    <footer className="border-t mt-10 py-8 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Social buttons */}
        <div className="flex gap-4 mb-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <MessageCircle size={18} />
            واتساب
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <Instagram size={18} />
            إنستغرام
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Yousef Coaching — جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
