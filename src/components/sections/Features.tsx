import { Card, CardContent } from "@/components/ui/card";

const items = [
  { title: "برنامج مخصص", text: "خطة تدريب تناسب مستواك وأدواتك." },
  { title: "تغذية مرنة", text: "سعرات وبروتين بطريقة بسيطة قابلة للاستمرار." },
  { title: "متابعة أسبوعية", text: "تعديل الخطة حسب تقدمك وظروفك." },
];

export default function Features() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((it) => (
        <Card key={it.title}>
          <CardContent className="p-6 space-y-2">
            <h3 className="font-bold">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.text}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
