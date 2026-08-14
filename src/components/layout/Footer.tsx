import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/riko-logo.png";

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden bg-black/40 backdrop-blur-sm text-white border-t border-[#DF9F7E]/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DF9F7E]/40 to-transparent" />

      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src={logo}
                alt="RIKO"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full ring-1 ring-[#DF9F7E]/50 shadow-[0_0_20px_-4px_rgba(223,159,126,0.4)]"
              />
              <div>
                <div className="font-display text-2xl tracking-[0.3em] text-white">RIKO</div>
                <div className="text-[10px] tracking-[0.35em] text-[#DF9F7E]/90 mt-1">
                  SOUTH AMERICAN CUISINE
                </div>
              </div>
            </div>
            <p className="font-serif italic text-2xl lg:text-3xl text-white/90 leading-snug max-w-md">
              Fire, heritage and memory — a Peruvian-Latin voyage in the heart of Bengaluru.
            </p>
            <Link
              href="/reservation"
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-[#DF9F7E] text-[#3E1017] text-[11px] uppercase tracking-[0.35em] hover:bg-white transition-all duration-700 font-medium rounded-sm shadow-md"
            >
              Reserve a Table
            </Link>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[10px] tracking-[0.4em] uppercase text-[#DF9F7E] mb-5 font-semibold">Explore</div>
            <ul className="space-y-3 font-light">
              {[
                { label: "Home", to: "/" },
                { label: "Menu", to: "/menu" },
                { label: "Experience", to: "/experience" },
                { label: "Featured", to: "/featured" },
                { label: "Social Media", to: "/social" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.to} className="text-white/80 hover:text-[#DF9F7E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-[10px] tracking-[0.4em] uppercase text-[#DF9F7E] mb-5 font-semibold">Visit</div>
            <p className="text-white/80 font-light leading-relaxed">
              UB City, Vittal Mallya Road
              <br />
              Bengaluru, Karnataka 560001
              <br />
              <span className="text-[#DF9F7E] font-medium">
                <a href="tel:+919972540238" className="hover:underline">+91 99725 40238</a>
              </span>
              <span className="text-white/70 text-sm mt-1 block">
                <a href="mailto:reservations@theriko.com" className="hover:text-[#DF9F7E] transition-colors">reservations@theriko.com</a>
              </span>
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.instagram.com/riko.experience"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.35em] uppercase text-white/70 hover:text-[#DF9F7E] transition-colors border-b border-transparent hover:border-[#DF9F7E] pb-1"
              >
                @riko.experience
              </a>
            </div>
          </div>
        </div>

        <div className="hairline bg-[#DF9F7E]/20 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.3em] uppercase text-white/60">
          <span>&copy; {new Date().getFullYear()} RIKO • Crafted with fire</span>
          <span className="font-serif normal-case tracking-normal italic text-white/70">
            Bengaluru • UB City
          </span>
        </div>
      </div>
    </footer>
  );
}
