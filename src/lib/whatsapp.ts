export function buildWhatsAppLinks(message: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const phone = raw.startsWith("+") ? raw.slice(1) : raw; // wa.me requires no '+'
  const encoded = encodeURIComponent(message);

  // Primary (simple, fast)
  const primary = `https://wa.me/${phone}?text=${encoded}`;

  // Fallback (older endpoint)
  const fallback = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;

  // Mobile deep-link (if needed)
  const deeplink = `whatsapp://send?phone=${phone}&text=${encoded}`;

  return { primary, fallback, deeplink };
}
