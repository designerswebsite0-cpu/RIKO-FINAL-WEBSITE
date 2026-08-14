"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SiteShell } from "@/components/layout/SiteShell";
import { Instagram, Play, MapPin, Phone, Clock, Mail, X } from "lucide-react";
import { ApiClient } from "@/lib/api-client";
import redVaultLounge from "@/assets/red-vault-lounge.jpg";
import foyerEntrance from "@/assets/foyer-entrance.jpg";
import greenLounge from "@/assets/green-lounge.jpg";

interface ReelItem {
  id?: string;
  title: string;
  tag: string;
  videoUrl?: string;
  imageUrl: string | any;
  videoPublicId?: string;
  imagePublicId?: string;
}

const STATIC_REELS = [
  { imageUrl: redVaultLounge,   title: "Red Leaf Vault Lounge",       tag: "#RikoMaroon",    videoUrl: "/riko-logo-animation.mp4" },
  { imageUrl: foyerEntrance,    title: "Entrance Foyer & Relief Doors", tag: "#FoyerDesign",   videoUrl: "/riko-logo-animation.mp4" },
  { imageUrl: greenLounge,      title: "Highland Canopy Dining",       tag: "#RikoSpace",    videoUrl: "/riko-logo-animation.mp4" },
  { imageUrl: redVaultLounge,   title: "Inside the Ember Grills",      tag: "#LatinSteaks",   videoUrl: "/riko-logo-animation.mp4" },
  { imageUrl: foyerEntrance,    title: "The Ceviche Experience",       tag: "#CevicheEmber",  videoUrl: "/riko-logo-animation.mp4" },
  { imageUrl: greenLounge,      title: "Smoked Pisco Chemistry",       tag: "#RikoBar",      videoUrl: "/riko-logo-animation.mp4" },
];

const CONTACT = [
  {
    icon: MapPin,
    label: "Location",
    lines: [
      { text: "UB City, Vittal Mallya Road", href: "https://maps.google.com/?q=UB+City+Bengaluru" },
      { text: "Bengaluru, Karnataka 560001", href: "https://maps.google.com/?q=UB+City+Bengaluru" },
    ],
  },
  {
    icon: Phone,
    label: "Reservations",
    lines: [{ text: "+91 99725 40238", href: "tel:+919972540238" }],
  },
  {
    icon: Mail,
    label: "Email",
    lines: [{ text: "reservations@theriko.com", href: "mailto:reservations@theriko.com" }],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: [
      { text: "Tue – Sun · 6:30 PM – Late", href: null },
      { text: "Closed Mondays", href: null },
    ],
  },
  {
    icon: Instagram,
    label: "Instagram",
    lines: [{ text: "@riko.experience", href: "https://www.instagram.com/riko.experience" }],
  },
];

export function SocialClient() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    async function loadReels() {
      try {
        const res = await ApiClient.getReels();
        if (res.success && Array.isArray(res.items) && res.items.length > 0) {
          setReels(res.items);
        } else {
          setReels(STATIC_REELS);
        }
      } catch {
        setReels(STATIC_REELS);
      }
    }
    loadReels();
  }, []);

  return (
    <SiteShell>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative pt-36 lg:pt-48 pb-16 bg-transparent">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-12 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#DF9F7E] mb-6 font-medium">
            <Instagram size={12} />
            @riko.experience
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-[0.08em] uppercase">
            Lived &amp;{" "}
            <span className="font-calligraphy text-5xl sm:text-7xl lg:text-8xl text-[#DF9F7E] font-normal lowercase px-2 align-middle">
              shared
            </span>
          </h1>

          <p className="mt-5 text-sm text-white/60 max-w-md mx-auto font-light leading-relaxed">
            Behind the flame, the ritual, and the table — a window into the world of RIKO.
          </p>
        </div>
      </section>

      {/* ── Reels Grid ────────────────────────────────────────────── */}
      <section className="pb-20 bg-transparent">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {reels.map((r, i) => (
              <div
                key={r.title + i}
                onClick={() => r.videoUrl && setSelectedVideo(r.videoUrl)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
              >
                {/* Image */}
                {typeof r.imageUrl === "string" ? (
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={r.imageUrl}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 group-hover:bg-[#DF9F7E] group-hover:text-black group-hover:scale-110 transition-all duration-500">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                {/* Bottom label */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[#DF9F7E] font-medium block mb-1">
                    {r.tag}
                  </span>
                  <h3 className="font-serif text-base text-white leading-tight">{r.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Follow CTA */}
          <div className="mt-10 text-center">
            <a
              href="https://www.instagram.com/riko.experience"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-[#DF9F7E]/50 text-[#DF9F7E] text-[11px] tracking-[0.3em] uppercase hover:bg-[#DF9F7E] hover:text-black transition-all duration-500 font-medium"
            >
              <Instagram size={14} />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-16 px-6">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#DF9F7E]/25" />
        <span className="text-[#DF9F7E]/40 text-xs">✦</span>
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#DF9F7E]/25" />
      </div>

      {/* ── Contact + Map ─────────────────────────────────────────── */}
      <section id="contact" className="pb-24 bg-transparent">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-[0.08em] uppercase">
              Come{" "}
              <span className="font-calligraphy text-4xl sm:text-6xl text-[#DF9F7E] font-normal lowercase px-2 align-middle">
                find us
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Contact cards */}
            <div className="lg:col-span-5 space-y-3">
              {CONTACT.map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#DF9F7E]/35 transition-colors duration-500 group"
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-full border border-[#DF9F7E]/30 flex items-center justify-center text-[#DF9F7E] group-hover:bg-[#DF9F7E] group-hover:text-black transition-all duration-500">
                    <c.icon size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.4em] uppercase text-[#DF9F7E]/70 mb-1 font-medium">
                      {c.label}
                    </div>
                    {c.lines.map((l) =>
                      l.href ? (
                        <a
                          key={l.text}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="block text-white/85 text-sm leading-relaxed hover:text-[#DF9F7E] transition-colors"
                        >
                          {l.text}
                        </a>
                      ) : (
                        <div key={l.text} className="text-white/85 text-sm leading-relaxed">
                          {l.text}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map iframe correctly formatted */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe
                  title="RIKO Location — UB City Bengaluru"
                  src="https://maps.google.com/maps?q=UB%20City%20Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 w-full h-full grayscale-[0.25] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video Overlay Modal ────────────────────────────────────── */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            aria-label="Close video"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-lg w-full max-h-[85vh] flex items-center justify-center">
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] rounded-2xl shadow-[0_0_50px_rgba(223,159,126,0.3)] border border-white/15"
            />
          </div>
        </div>
      )}
    </SiteShell>
  );
}
