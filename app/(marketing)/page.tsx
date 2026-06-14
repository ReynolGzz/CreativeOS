import Hero from "@/components/landing/Hero";
import DemoFlow from "@/components/landing/DemoFlow";
import Benefits from "@/components/landing/Benefits";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="pt-16">
      <Hero />
      <DemoFlow />
      <Benefits />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
