import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
    </div>
  );
}
