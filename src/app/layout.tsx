import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: {
    default: "RIKO — Peruvian-Latin Cuisine — Bengaluru",
    template: "%s — RIKO",
  },
  description:
    "Bengaluru's first immersive Peruvian-Latin dining experience at UB City. Fire-led cuisine, sculptural interiors, heritage plating.",
  authors: [{ name: "RIKO" }],
  openGraph: {
    type: "website",
    title: "RIKO — Peruvian-Latin Cuisine — Bengaluru",
    description:
      "An ultra-premium cinematic hospitality website for RIKO, a luxury Peruvian-Latin dining experience.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=DM+Serif+Display:ital@0;1&display=swap"
        />
      </head>
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
