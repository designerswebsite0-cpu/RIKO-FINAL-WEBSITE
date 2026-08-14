"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SiteShell } from "@/components/layout/SiteShell";
import { ExternalLink } from "lucide-react";

import greenLounge from "@/assets/green-lounge.jpg";
import redVaultLounge from "@/assets/red-vault-lounge.jpg";
import diningArch from "@/assets/dining-arch.jpg";
import tableAlcove from "@/assets/table-alcove.jpg";

const pressFeatures = [
  {
    publication: "Indulge Express",
    tier: "Critic's Review",
    headline: "Bengaluru's new viral Peruvian restaurant lives up to its hype!",
    quote:
      "Riko feels like a culinary secret waiting to be uncovered. Step past its discreet entrance and the restaurant reveals itself in dramatic fashion — a space that expands far beyond expectation.",
    author: "Romal Laisram",
    date: "August 2025",
    url: "https://www.indulgexpress.com/food/food-bengaluru/2025/Aug/22/bengalurus-new-viral-peruvian-restaurant-lives-up-to-its-hype",
    bg: redVaultLounge,
  },
  {
    publication: "Elle Gourmet",
    tier: "Exclusive Feature",
    headline: "Meet Riko, The New Peruvian-Latin Restaurant To Head To In Bengaluru",
    quote:
      "Introducing a cuisine with several distinct global influences is no mean task. Riko takes on the challenge and excels with confidence and grace.",
    author: "Ruth Dsouza Prabhu",
    date: "July 2025",
    url: "https://ellegourmet.in/food/meet-riko-the-new-peruvian-latin-restaurant-to-head-to-in-bengaluru-9464581",
    bg: greenLounge,
  },
  {
    publication: "The Hindu",
    tier: "Dining Review",
    headline: "How Riko is bringing authentic Peruvian-Latin dishes to Bengaluru",
    quote:
      "Riko cooks with ingredients from Peru such as choclo corn and ají amarillo chillies — an education in Peruvian staples, a clever primer for what follows.",
    author: "Anagha Maareesha",
    date: "July 2025",
    url: "https://www.thehindu.com/food/dining/this-new-restaurant-is-bringing-authentic-peruvian-latin-dishes-to-bengaluru/article69868792.ece",
    bg: diningArch,
  },
  {
    publication: "ET Hospitality World",
    tier: "Industry Feature",
    headline: "Riko: A Unique Peruvian-Latin Dining Experience Opens in Bengaluru",
    quote:
      "Discover Riko, the new Peruvian-Latin restaurant in Bengaluru, offering authentic dishes inspired by Peru's diverse heritage with carefully curated menus and vibrant flavours.",
    author: "Online Bureau",
    date: "July 2025",
    url: "https://hospitality.economictimes.indiatimes.com/news/restaurants/riko-a-unique-peruvian-latin-dining-experience-opens-in-bengaluru/122564708",
    bg: tableAlcove,
  },
  {
    publication: "Hospitality News",
    tier: "Industry Report",
    headline: "RIKO Brings Peruvian-Latin Culinary Fire to Bengaluru",
    quote:
      "Bengaluru's UB City welcomes RIKO, the city's first Peruvian-Latin restaurant. RIKO brings bold ceviches, soulful open-fire grills, and native ingredients together.",
    author: "Editorial Team",
    date: "July 2025",
    url: "https://hospitalitynews.in/news/riko-brings-peruvian-latin-culinary-fire-to-bengaluru",
    bg: redVaultLounge,
  },
  {
    publication: "Restaurant India",
    tier: "New Opening",
    headline: "'RIKO' — A Newest Peruvian-Latin Restaurant Opens in Bengaluru",
    quote:
      "An explosive new opening built on open flame, native ingredients, and a menu that cuts through the noise. Fire, soul, and South America in one room.",
    author: "Editorial Team",
    date: "July 2025",
    url: "https://www.restaurantindia.in/news/riko-a-newest-peruvian-latin-restaurant-opens-in-bengaluru.n13286",
    bg: greenLounge,
  },
];

const INTERVAL_MS = 15000;

export default function FeaturedClient() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent((idx + pressFeatures.length) % pressFeatures.length);
      setVisible(true);
    }, 300);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo(current + 1);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  const item = pressFeatures[current];

  return (
    <SiteShell>
      {/* Absolute Full Screen Height Screen - strictly 100vh, locked height */}
      <section className="relative h-screen w-screen max-w-full overflow-hidden bg-black text-white flex flex-col justify-between pt-20 pb-6 px-6 sm:px-12 lg:px-16">
        {/* Dynamic Background Image per slide */}
        {pressFeatures.map((feat, i) => (
          <div
            key={feat.publication}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={feat.bg}
              alt={feat.publication}
              fill
              priority={i === 0}
              className="object-cover brightness-[0.25]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
          </div>
        ))}

        {/* Header / Nav Strip inside Viewport */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DF9F7E] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#DF9F7E] font-mono">
              In The Press
            </span>
          </div>

          {/* Publication tab list */}
          <div className="hidden sm:flex items-center gap-4">
            {pressFeatures.map((p, i) => (
              <button
                key={p.publication}
                onClick={() => goTo(i)}
                className="text-[9px] font-mono uppercase tracking-wider transition-all duration-300 relative py-1"
                style={{
                  color: i === current ? "#DF9F7E" : "rgba(255,255,255,0.35)",
                }}
              >
                {p.publication}
                {i === current && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#DF9F7E]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center Main Quote Area */}
        <div className="relative z-10 w-full max-w-4xl mx-auto my-auto py-4">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
            className="border-4 border-double border-[#DF9F7E]/40 p-6 sm:p-8 bg-[#180306]/90 backdrop-blur-md rounded-lg shadow-2xl relative"
          >
            {/* Top Newspaper Banner */}
            <div className="text-center border-b border-t border-dashed border-[#DF9F7E]/30 py-1.5 mb-5">
              <p className="text-[9px] sm:text-[10px] tracking-[0.35em] font-mono text-white/40 uppercase">
                RIKO GAZETTE &bull; {item.date} &bull; UB CITY SPECIAL
              </p>
            </div>

            {/* Sub-header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF9F7E]">
                {item.tier}
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/40 font-mono">Vol. II No. VIII</span>
            </div>

            {/* Headline */}
            <h2 className="font-serif font-medium text-xl sm:text-2xl lg:text-3xl text-white leading-tight mb-4 tracking-tight border-b border-white/10 pb-3">
              {item.headline}
            </h2>

            {/* Columns Layout */}
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 items-start">
              {/* Quote text Column */}
              <div className="space-y-4">
                <p className="font-serif italic text-sm sm:text-base text-white/90 leading-relaxed text-justify first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-[#DF9F7E] first-letter:font-serif">
                  {item.quote}
                </p>
              </div>

              {/* Author Info / Link Column */}
              <div className="border-t md:border-t-0 md:border-l border-[#DF9F7E]/20 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between h-full space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#DF9F7E] block mb-1">
                    WRITTEN BY
                  </span>
                  <p className="text-xs sm:text-sm font-sans font-medium text-white/80">
                    {item.author}
                  </p>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white/40 block mt-0.5">
                    {item.publication} Correspondent
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-black bg-[#DF9F7E] px-4 py-2 rounded hover:bg-white hover:text-black transition-all duration-300 font-semibold font-mono"
                >
                  Read Article <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Timer Progress */}
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-2">
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
            <div
              key={`bar-${current}`}
              className="h-full bg-[#DF9F7E] rounded-full"
              style={{
                animation: `grow-bar ${INTERVAL_MS}ms linear forwards`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>
              0{current + 1} / 0{pressFeatures.length}
            </span>

            <div className="flex items-center gap-1.5">
              {pressFeatures.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === current ? "24px" : "6px",
                    background: i === current ? "#DF9F7E" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes grow-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </SiteShell>
  );
}
