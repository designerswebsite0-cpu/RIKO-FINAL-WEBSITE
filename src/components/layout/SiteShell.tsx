"use client";

import { useReveal } from "@/hooks/useReveal";
import { Footer } from "./Footer";
import { NavigationBar } from "./NavigationBar";
import { ScrollProgressBar } from "./ScrollProgressBar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  useReveal();

  return (
    <main className="bg-transparent text-foreground min-h-screen">
      <ScrollProgressBar />
      <NavigationBar />
      {children}
      <Footer />
    </main>
  );
}
