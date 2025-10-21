"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* background image */}
      <Image
        src="/bg-home.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* content */}
      <div className="relative z-10 space-y-6 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
          ابنِ جسمك بثقة
        </h1>
        <p className="text-gray-200 max-w-2xl mx-auto">
          تدريب شخصي، خطة تغذية، ومتابعة أسبوعية بسيطة بالعربي — بدون تعقيد.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button className="btn-gradient px-6 py-5 text-base" asChild>
            <a href="/booking">ابدأ الآن</a>
          </Button>
          <Button
            variant="outline"
            className="px-6 py-5 text-base border-white/40 text-white hover:bg-white/10"
            asChild
          >
            <a href="/coaching">البرامج</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
