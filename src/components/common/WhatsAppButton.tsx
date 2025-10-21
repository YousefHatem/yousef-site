"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLinks } from "@/lib/whatsapp";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

type Props = {
  message: string;
  label?: string;
  size?: "default" | "sm" | "lg" | "xl";
  variant?: React.ComponentProps<typeof Button>["variant"];
};

export default function WhatsAppButton({
  message,
  label = "واتساب",
  size = "lg",
  variant = "whatsapp",
}: Props) {
  const [busy, setBusy] = useState(false);
  const cooldown = useRef<number | null>(null);

  function openOnce(url: string) {
    // Avoid multiple opens
    if (busy) return;
    setBusy(true);
    window.open(url, "_blank", "noopener,noreferrer");
    // Cooldown (prevents double clicks → 429)
    cooldown.current = window.setTimeout(() => setBusy(false), 2500);
  }

  function handleClick() {
    const { primary, fallback } = buildWhatsAppLinks(message);

    try {
      openOnce(primary);
      // If primary fails due to network / rate limit, try fallback after a short delay
      window.setTimeout(() => {
        if (!busy) return; // already cleared by user interaction
        openOnce(fallback);
      }, 1200);
    } catch {
      toast.error("تعذر فتح واتساب الآن. جرّب مرة أخرى بعد قليل.");
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={busy}
      className="min-w-40"
    >
      <MessageCircle className="ml-2" />
      {busy ? "جارٍ الفتح..." : label}
    </Button>
  );
}
