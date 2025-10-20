// src/components/system/ToasterClient.tsx
"use client";
import { Toaster } from "@/components/ui/sonner";

export default function ToasterClient() {
  // Must return an element only (no stray strings)
  return <Toaster richColors position="top-center" />;
}
