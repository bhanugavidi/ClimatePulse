import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CrossBorder } from "@/components/home/CrossBorder";
import { AuthorityDashboardPreview } from "@/components/home/AuthorityDashboardPreview";
import { VisionCTA } from "@/components/home/VisionCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CrossBorder />
      <AuthorityDashboardPreview />
      <VisionCTA />
    </>
  );
}