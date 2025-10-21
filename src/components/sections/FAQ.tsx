import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const qa = [
  {
    q: "هل أحتاج اشتراك جيم؟",
    a: "مش لازم. نقدر نجهز خطة منزلية حسب الأدوات المتوفرة عندك.",
  },
  { q: "كم مدة البرنامج؟", a: "الاشتراك شهري مع متابعة أسبوعية وتعديل مستمر." },
  { q: "هل الخطة بالعربي؟", a: "نعم، كل شيء بالعربي وبأسلوب بسيط." },
];

export default function FAQ() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-extrabold text-center">الأسئلة الشائعة</h2>
      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {qa.map((x, i) => (
          <AccordionItem key={i} value={`q${i}`}>
            <AccordionTrigger>{x.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {x.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
