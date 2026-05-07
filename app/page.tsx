import Hero from "@/components/Hero";
import Bestsellers from "@/components/Bestsellers";
import TraditionSection from "@/components/TraditionSection";
import DarkSection from "@/components/DarkSection";
import FormationsPreview from "@/components/FormationsPreview";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Bestsellers />
      <TraditionSection />
      <DarkSection />
      <FormationsPreview />
      <Testimonials />
      <Newsletter />
    </>
  );
}
