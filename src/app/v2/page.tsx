import type { Metadata } from "next";
import HeroSection from "@/components/v2/HeroSection";
import MarqueeSection from "@/components/v2/MarqueeSection";
import AboutSection from "@/components/v2/AboutSection";
import ServicesSection from "@/components/v2/ServicesSection";
import ProjectsSection from "@/components/v2/ProjectsSection";

export const metadata: Metadata = {
  title: "VirtuEaze — 3D Digital Twin Studio",
  description:
    "A digital twin studio crafting striking and unforgettable projects.",
};

export default function V2Page() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </>
  );
}
