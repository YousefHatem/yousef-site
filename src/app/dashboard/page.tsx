import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightPanel from "./weight-panel";
import MealPanel from "./meal-panel";
import PlanPanel from "./plan-panel";
import SessionsPanel from "./sessions-panel";
export const metadata = { title: "لوحة التحكم | Yousef Coaching" };

export default function DashboardHome() {
  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold mb-6">لوحة المشترك</h1>

      <Tabs defaultValue="plan" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="plan">الخطة</TabsTrigger>
          <TabsTrigger value="sessions">المواعيد</TabsTrigger>
          <TabsTrigger value="meals">الوجبات</TabsTrigger>
          <TabsTrigger value="weight">الوزن</TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <PlanPanel />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsPanel />
        </TabsContent>
        <TabsContent value="meals">
          <MealPanel />
        </TabsContent>
        <TabsContent value="weight">
          <WeightPanel />
        </TabsContent>
      </Tabs>
    </section>
  );
}
