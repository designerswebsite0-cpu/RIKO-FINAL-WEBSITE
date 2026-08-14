import Image from "next/image";
import fireImg from "@/assets/fire.jpg";
import cocktailImg from "@/assets/cocktail.jpg";

const FIRE_SPECS = [
  {
    temp: "800°C",
    title: "Binchotan Open Flame",
    desc: "Searing wild seafood and Peruvian antichuchos with clean, smokeless charcoal intensity.",
  },
  {
    temp: "450°C",
    title: "Clay Oven Embers",
    desc: "Slow roasting native root vegetables, smoked chilis, and braised cuts over fruitwood.",
  },
  {
    temp: "Infused",
    title: "Tableside Smoke Rituals",
    desc: "Aromatic Copal and cedar wood smoke trapped under glass cloches for signature cocktails and ceviches.",
  },
];

export function FireRitualSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-[#0A0000] via-[#1E0408] to-[#0A0000]">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#DF9F7E] block mb-3 font-medium">
            Culinary Science
          </span>
          <h2 className="reveal font-serif text-3xl sm:text-5xl lg:text-6xl text-white leading-tight font-normal">
            Wood, ember &amp; <span className="font-calligraphy text-4xl sm:text-6xl text-[#DF9F7E] lowercase align-middle px-1">patience</span>.
          </h2>
          <p className="reveal mt-4 text-sm sm:text-base text-white/75 font-light leading-relaxed">
            At RIKO, fire is an ingredient and a sensory narrator woven into the atmosphere of our dining room.
          </p>
        </div>

        {/* 2-Column Split: Image & Spec List */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          <div className="lg:col-span-6 reveal">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
              <Image
                src={fireImg}
                alt="Open flame hearth at RIKO Bengaluru"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#DF9F7E] font-mono">The Hearth</span>
                <h4 className="font-serif text-xl sm:text-2xl text-white mt-1">Open Fire Theatre</h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 reveal">
            {FIRE_SPECS.map((spec) => (
              <div
                key={spec.title}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#DF9F7E]/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#9E2336]/20 text-[11px] font-mono text-[#DF9F7E] border border-[#9E2336]/40">
                    {spec.temp}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                    {spec.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Bottom Banner */}
        <div className="reveal p-8 sm:p-12 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#DF9F7E] font-mono block">
                Tableside Rituals
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#FAF4EA] font-normal">
                Cold Copal Smoke &amp; <span className="font-calligraphy text-3xl sm:text-5xl text-[#DF9F7E] align-middle px-1">Botanical Elixirs</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF4EA]/75 font-light leading-relaxed max-w-xl">
                Cocktails and grilled courses are served with cold copal misting and hand-thrown ceramics made from Peruvian highland clay.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-md max-w-xs">
                <Image
                  src={cocktailImg}
                  alt="Smoked Latin cocktail ritual at RIKO"
                  fill
                  sizes="(max-width: 1024px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
