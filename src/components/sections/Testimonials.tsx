import { Card, CardContent } from "@/components/ui/card";

const data = [
  {
    name: "محمد",
    text: "نزلت 8 كجم خلال 10 أسابيع بدون حرمان. المتابعة فرقت!",
  },
  { name: "سارة", text: "أول مرة أفهم التغذية ببساطة. التمرين ممتع ومفهوم." },
  { name: "ياسر", text: "قوة وثقة أعلى.. البرنامج كان مناسب لجدولي المزدحم." },
];

export default function Testimonials() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-extrabold text-center">آراء المشتركين</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {data.map((t) => (
          <Card key={t.name}>
            <CardContent className="p-6 space-y-2">
              <p>“{t.text}”</p>
              <p className="text-sm text-muted-foreground">— {t.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
