// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="text-center space-y-5">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          ابنِ جسمك بثقة
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          تدريب شخصي، خطط وجبات، ومتابعة أسبوعية باللغة العربية.
        </p>
        <div className="flex items-center justify-center gap-3">
<Button className="btn-gradient px-6 py-5 text-base">ابدأ الآن</Button>

          <Button
            variant="outline"
            className="px-6 py-5 text-base border-primary/30 hover:bg-primary/5"
          >
            البرامج
          </Button>
        </div>
      </div>

      <Card className="mx-auto max-w-3xl">
        <CardContent className="p-6 text-center">
          جاهز تبدأ؟ اكتب لي هدفك الحالي وسنضع خطة مناسبة لمستواك.
        </CardContent>
      </Card>
    </section>
  );
}
