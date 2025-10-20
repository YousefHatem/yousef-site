"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
    };

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Unknown error");
      toast.success("تم إرسال الرسالة ✅");
      form.reset();
    } catch (err) {
      toast.error((err as Error).message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="name" placeholder="الاسم" required />
      <Input
        type="email"
        name="email"
        placeholder="البريد الإلكتروني"
        required
      />
      <Textarea name="message" placeholder="اكتب رسالتك..." rows={6} required />
      <Button type="submit" disabled={loading}>
        {loading ? "جاري الإرسال..." : "إرسال"}
      </Button>
    </form>
  );
}
