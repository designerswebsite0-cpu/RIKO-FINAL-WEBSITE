import Image from "next/image";
import greenLounge from "@/assets/green-lounge.jpg";
import redVaultLounge from "@/assets/red-vault-lounge.jpg";
import diningArch from "@/assets/dining-arch.jpg";
import tableAlcove from "@/assets/table-alcove.jpg";

const PILLARS = [
  {
    num: "01",
    title: "Fire-Led Cuisine",
    desc: "Open flame, binchotan embers, and patient smoke — raw native ingredients transformed with quiet restraint.",
    image: redVaultLounge,
  },
  {
    num: "02",
    title: "Architectural Intimacy",
    desc: "Sculptural clay, hand-carved Peruvian door reliefs, and wood arches forming an Andean sanctuary.",
    image: greenLounge,
  },
  {
    num: "03",
    title: "Sensory Hospitality",
    desc: "Low ambient light, flickering candle flames, and unhurried service for a tranquil evening.",
    image: tableAlcove,
  },
  {
    num: "04",
    title: "Cultural Story",
    desc: "Indigenous, Spanish, African, and Asian culinary traditions plated into one continuous narrative.",
    image: diningArch,
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="relative overflow-hidden bg-transparent">
      {/* Full-Screen Hero — Editorial Split Layout */}
      <div className="relative h-screen min-h-[600px] w-full flex items-center">
        <Image
          src={greenLounge}
          alt="Highland Canopy Lounge at RIKO Bengaluru"
          priority
          fill
          className="absolute inset-0 w-full h-full object-cover brightness-[0.28]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0000]" />

        {/* Two-Column Editorial Grid */}
        <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Headline */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.45em] text-[#DF9F7E] font-mono block">
              The Experience
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1]">
              Crafted through{" "}
              <span className="font-calligraphy text-5xl sm:text-6xl lg:text-7xl text-[#DF9F7E] font-normal align-middle">
                fire
              </span>{" "}
              &amp; story.
            </h1>
            <div className="w-10 h-px bg-[#DF9F7E]/50 mt-2" />
          </div>

          {/* Right — Body Text */}
          <div className="space-y-5 text-[#FAF4EA]/85 font-light leading-[1.75] text-sm sm:text-[15px]">
            <p>
              Dining at RIKO is designed to be immersive, relaxed, and memorable.
            </p>
            <p>
              From the warmth of our hospitality to the theatre of our open fire kitchen, every element has been thoughtfully curated to create an experience that feels both refined and welcoming. Whether joining us for a leisurely lunch, an evening celebration, or an exploration of new flavours, guests can expect thoughtfully crafted food, attentive service, and an atmosphere that reflects the vibrant spirit of South America.
            </p>
            <p className="text-[#DF9F7E]/90 font-serif italic text-sm leading-[1.75]">
              RIKO continues to evolve with every season, introducing new regional inspirations, chef-led experiences, and menus that celebrate the depth and diversity of South American cuisine. While our journey began in Peru, our story today is one of exploration.
            </p>
          </div>
        </div>
      </div>

      {/* Four Pillars Grid */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="text-center max-w-md mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#DF9F7E] font-mono block mb-2">
            Pillars
          </span>
          <h2 className="reveal font-serif text-3xl sm:text-4xl text-white font-normal">
            Four Elements of RIKO
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar) => (
            <div key={pillar.num} className="space-y-4 group">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-mono text-[#DF9F7E] tracking-widest block">
                {pillar.num}
              </span>
              <h3 className="font-serif text-xl text-white font-normal">
                {pillar.title}
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
