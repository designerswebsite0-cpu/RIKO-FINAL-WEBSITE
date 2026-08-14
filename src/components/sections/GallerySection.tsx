"use client";

import { useState } from "react";
import Image from "next/image";
import redVaultLounge from "@/assets/red-vault-lounge.jpg";
import foyerEntrance from "@/assets/foyer-entrance.jpg";
import diningArch from "@/assets/dining-arch.jpg";
import greenLounge from "@/assets/green-lounge.jpg";
import tableAlcove from "@/assets/table-alcove.jpg";
import interiorWide from "@/assets/interior-wide.jpg";
import tableImg from "@/assets/table.jpg";
import { VenueLightboxModal, VenueSpace } from "@/components/experience/VenueLightboxModal";

const VENUE_SPACES: VenueSpace[] = [
  {
    id: "red-leaf-vault",
    src: redVaultLounge,
    title: "Red Leaf Vault Lounge",
    zone: "Vault Lounge",
    category: "lounge",
    desc: "Sculptural hand-painted leaf canopy with crimson velvet lounge seating.",
    span: "md:col-span-2 md:row-span-2",
    details: {
      capacity: "24 Guests",
      lighting: "Deep Ember Glow",
      atmosphere: "Tactile velvet & warm brass",
      signatureFeature: "Hand-painted leaf ceiling canopy",
    },
  },
  {
    id: "foyer-entrance",
    src: foyerEntrance,
    title: "Entrance Foyer",
    zone: "Arrival",
    category: "foyer",
    desc: "Fringed luminaire installation and hand-carved Peruvian door reliefs.",
    span: "md:col-span-1 md:row-span-1",
    details: {
      capacity: "Host Greeting",
      lighting: "Spotlight",
      atmosphere: "Ceremonial arrival",
      signatureFeature: "Solid wood Peruvian door reliefs",
    },
  },
  {
    id: "arched-dining-hall",
    src: diningArch,
    title: "Arched Dining Hall",
    zone: "Dining Hall",
    category: "hall",
    desc: "Custom wood-strip archways framing crimson and emerald velvet dining tables.",
    span: "md:col-span-1 md:row-span-1",
    details: {
      capacity: "60 Guests",
      lighting: "Low Downlights",
      atmosphere: "Acoustic wood arches",
      signatureFeature: "Acoustic wood-ribbed vaulting",
    },
  },
  {
    id: "highland-canopy",
    src: greenLounge,
    title: "Highland Canopy Lounge",
    zone: "Canopy",
    category: "lounge",
    desc: "Botanical ceiling fan sculptures with brass sconces and forest greenery.",
    span: "md:col-span-1 md:row-span-1",
    details: {
      capacity: "18 Guests",
      lighting: "Botanical Shadowlight",
      atmosphere: "Lush & serene",
      signatureFeature: "Artisanal leaf-blade ceiling fans",
    },
  },
  {
    id: "intimate-alcove",
    src: tableAlcove,
    title: "Intimate Dining Alcove",
    zone: "Alcove",
    category: "alcove",
    desc: "Low-lit tables framed by backlit textile screens and ceramic displays.",
    span: "md:col-span-1 md:row-span-1",
    details: {
      capacity: "2-6 Guests",
      lighting: "Candlelit",
      atmosphere: "Private & romantic",
      signatureFeature: "Backlit woven textiles",
    },
  },
  {
    id: "panoramic-interior",
    src: interiorWide,
    title: "Grand Dining Panorama",
    zone: "Panorama",
    category: "hall",
    desc: "A sweeping view of RIKO's banquettes, wood archways, and warm lighting.",
    span: "md:col-span-2 md:row-span-1",
    details: {
      capacity: "120 Guests",
      lighting: "Layered Atmosphere",
      atmosphere: "Grand & architectural",
      signatureFeature: "Open hearth kitchen view",
    },
  },
  {
    id: "chef-table",
    src: tableImg,
    title: "Fire Hearth Table",
    zone: "Hearth",
    category: "alcove",
    desc: "Front-row seating near the open hearth grill.",
    span: "md:col-span-1 md:row-span-1",
    details: {
      capacity: "8 Guests",
      lighting: "Hearth Firelight",
      atmosphere: "Theatric & aromatic",
      signatureFeature: "Direct view of binchotan fire masters",
    },
  },
];

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpenSpace = (space: VenueSpace) => {
    const idx = VENUE_SPACES.findIndex((s) => s.id === space.id);
    setLightboxIndex(idx !== -1 ? idx : 0);
  };

  return (
    <section id="gallery" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-md mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#DF9F7E] font-mono block mb-2">
            Gallery
          </span>
          <h2 className="reveal font-serif text-3xl sm:text-4xl text-white font-normal">
            The Spaces
          </h2>
        </div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 reveal">
          {VENUE_SPACES.map((photo, i) => (
            <div
              key={photo.id}
              onClick={() => handleOpenSpace(photo)}
              className="relative overflow-hidden rounded-lg border border-white/10 bg-black/40 group cursor-pointer aspect-[4/3] shadow-lg"
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#DF9F7E] block">
                  0{i + 1} — {photo.zone}
                </span>
                <h3 className="font-serif text-lg text-white font-normal mt-0.5">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <VenueLightboxModal
        spaces={VENUE_SPACES}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}
