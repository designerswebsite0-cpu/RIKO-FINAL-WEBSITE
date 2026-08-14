import Image from "next/image";
import foyerEntrance from "@/assets/foyer-entrance.jpg";
import diningArch from "@/assets/dining-arch.jpg";

export function StorySection() {
  return (
    <section id="story" className="relative py-32 lg:py-48 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        {/* Official Our Story Block in Editorial Card */}
        <div className="editorial-card p-8 sm:p-14 lg:p-20 mb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 reveal">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#3E0E16]/10 shadow-xl">
                <Image
                  src={foyerEntrance}
                  alt="RIKO entrance foyer with fringed lights and Peruvian relief doors"
                  loading="lazy"
                  width={1080}
                  height={1500}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            <div className="lg:col-span-7 lg:pl-4">
              <span className="pill-badge border border-[#3E0E16]/20 bg-[#3E0E16]/5 text-[#3E0E16] mb-6">
                ★ Our Story
              </span>
              <h2 className="reveal font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-[#3E0E16] mb-8 font-normal">
                An evolution of <span className="font-calligraphy text-5xl sm:text-7xl lg:text-8xl text-[#9E2336] font-normal px-2 align-middle">flavour</span> &amp; fire.
              </h2>

              <div className="space-y-5 text-base sm:text-lg text-[#24060B] leading-relaxed max-w-2xl font-normal reveal">
                <p>
                  RIKO began with a vision to introduce the vibrant flavours of Peru to India. Inspired by one of the world&apos;s most celebrated culinary traditions, the restaurant opened its doors with a menu rooted in authentic Peruvian recipes, exceptional ingredients, and fire-driven cooking.
                </p>
                <p className="text-[#9E2336] font-serif italic font-semibold text-xl sm:text-2xl pt-1">
                  As the brand evolved, so did its culinary philosophy.
                </p>
                <p>
                  Today, RIKO celebrates the wider landscape of South American cuisine while drawing inspiration from the diverse regions and culinary traditions that define Latin America. This natural evolution has allowed the menu to grow beyond its origins, offering guests a richer and more immersive journey through one of the world&apos;s most exciting food cultures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pasta e Passione Inspired Editorial Center Banner */}
        <div className="reveal my-24 rounded-3xl bg-[#3E0E16] text-[#FAF4EA] p-10 sm:p-16 lg:p-20 shadow-2xl border border-white/10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-5 py-2 rounded-full border border-[#DF9F7E]/40 bg-[#DF9F7E]/10 text-[11px] uppercase tracking-[0.35em] text-[#DF9F7E] font-semibold mb-6">
              Latin American Cuisine
            </span>
            <h3 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#FAF4EA] uppercase tracking-wide leading-tight font-normal">
              Discover the Taste of <span className="font-calligraphy text-5xl sm:text-7xl lg:text-8xl text-[#DF9F7E] lowercase font-normal px-2 align-middle">latin america</span>
              <br />
              in the Heart of UB City
            </h3>
            <p className="mt-8 text-base sm:text-lg text-[#FAF4EA] leading-relaxed font-normal">
              Rather than representing a single cuisine, RIKO brings together regional influences that celebrate the diversity of Latin America&apos;s culinary heritage, while maintaining a contemporary approach to presentation and dining.
            </p>
            <div className="mt-10 hairline bg-gradient-to-r from-transparent via-[#DF9F7E]/40 to-transparent" />
            <p className="mt-8 font-serif italic text-2xl sm:text-3xl text-[#DF9F7E]">
              The Philosophy of RIKO — <span className="font-calligraphy text-4xl sm:text-5xl text-[#FAF4EA] font-normal not-italic px-2">Fire &amp; Passion</span>
            </p>
          </div>
        </div>

        {/* Official Our Cuisine Block in Editorial Card */}
        <div className="editorial-card p-8 sm:p-14 lg:p-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <span className="pill-badge border border-[#3E0E16]/20 bg-[#3E0E16]/5 text-[#3E0E16] mb-6 font-semibold">
                ★ Our Cuisine
              </span>
              <h2 className="reveal font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-[#3E0E16] mb-8 font-normal">
                Crafted with <span className="font-calligraphy text-5xl sm:text-7xl lg:text-8xl text-[#9E2336] font-normal px-2 align-middle">respect</span> for tradition.
              </h2>
              <div className="space-y-5 text-base sm:text-lg text-[#24060B] leading-relaxed max-w-2xl font-normal reveal">
                <p>
                  At RIKO, every dish is created with respect for tradition and a commitment to craftsmanship.
                </p>
                <p>
                  Our menu showcases the bold flavours, fresh produce, vibrant herbs, native spices, and open-fire cooking that have become synonymous with South American cuisine. Alongside our signature ceviches and grilled specialities, guests can explore our Regional Taco Collection, discover seasonal creations inspired by Latin American regions, and experience our signature Unlimited Latin Steaks, an expression of generous hospitality and premium fire-cooked dining.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 reveal">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#3E0E16]/10 shadow-xl">
                <Image
                  src={diningArch}
                  alt="Arched wood ceiling dining room with red and green velvet chairs"
                  loading="lazy"
                  width={1600}
                  height={1100}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
