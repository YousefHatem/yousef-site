// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const { name, email, message } = schema.parse(body);

    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM!, // e.g. "Yousef Coaching <onboarding@resend.dev>"
      to: process.env.CONTACT_TO!, // where you receive messages
      replyTo: email, // ✅ correct camelCase
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      // Resend returns a structured error
      return NextResponse.json(
        { ok: false, error: error.message ?? "Email send failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 400 }
    );
  }
}
