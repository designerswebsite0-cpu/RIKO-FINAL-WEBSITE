import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { GallerySection } from "@/components/sections/GallerySection";

export const metadata: Metadata = {
  title: "Experience | RIKO Bengaluru",
  description:
    "Discover the multi-sensory and fire-led dining experience at RIKO in Bengaluru. Intimate spaces, ancient open-flame cooking, and architectural luxury.",
};

export default function ExperiencePage() {
  return (
    <SiteShell>
      <ExperienceSection />
      <GallerySection />
    </SiteShell>
  );
}
