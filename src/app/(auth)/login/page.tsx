"use client";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) return toast.error("بيانات غير صحيحة");
    toast.success("تم تسجيل الدخول");
    router.push("/dashboard");
  }

  async function onSignup() {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) return toast.error(error.message);
    toast.success("تم إنشاء الحساب! يمكنك تسجيل الدخول الآن.");
  }

  return (
    <section className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>
      <form onSubmit={onLogin} className="space-y-3">
        <Input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="كلمة المرور"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <Button className="w-full" type="submit" variant="gradient">
          دخول
        </Button>
      </form>
      <Button className="w-full" variant="outline" onClick={onSignup}>
        إنشاء حساب جديد
      </Button>
    </section>
  );
}
