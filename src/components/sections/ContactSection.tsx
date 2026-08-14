import { MapPin, Phone, Clock, Instagram, Star, Mail } from "lucide-react";

export function ContactSection() {
  const cards = [
    {
      icon: MapPin,
      label: "Find Us",
      lines: [
        { text: "UB City, Vittal Mallya Road", href: "https://maps.google.com/?q=UB+City+Bengaluru" },
        { text: "Bengaluru, Karnataka 560001", href: "https://maps.google.com/?q=UB+City+Bengaluru" },
      ],
    },
    {
      icon: Phone,
      label: "Reservations",
      lines: [
        { text: "+91 99725 40238", href: "tel:+919972540238" },
      ],
    },
    {
      icon: Mail,
      label: "Email",
      lines: [
        { text: "reservations@theriko.com", href: "mailto:reservations@theriko.com" },
      ],
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
      label: "Follow Us",
      lines: [
        { text: "@riko.experience", href: "https://www.instagram.com/riko.experience" },
      ],
    },
  ];

  return (
    <section id="contact" className="relative py-16 lg:py-20 bg-transparent">
      {/* Seamless flow divider */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#DF9F7E]/30" />
        <span className="text-[#DF9F7E]/60 text-xs">✦</span>
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#DF9F7E]/30" />
      </div>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <span className="pill-badge border border-white/30 bg-black/40 backdrop-blur-md text-[#DF9F7E] mb-4 inline-block">
            ★ Contact
          </span>
          <h2 className="reveal font-serif text-4xl md:text-6xl text-white leading-[1.02]">
            Come <span className="font-calligraphy text-5xl md:text-7xl text-[#DF9F7E] font-normal align-middle px-2">find us</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="reveal flex gap-5 p-5 border border-white/15 bg-white/5 backdrop-blur-sm rounded-xl hover:border-[#DF9F7E]/50 transition-colors duration-500 group"
                >
                  <div className="w-11 h-11 flex-shrink-0 rounded-full border border-[#DF9F7E]/40 flex items-center justify-center text-[#DF9F7E] group-hover:bg-[#DF9F7E] group-hover:text-black transition-all duration-500">
                    <c.icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.4em] uppercase text-[#DF9F7E] mb-1 font-semibold">
                      {c.label}
                    </div>
                    {c.lines.map((l) =>
                      l.href ? (
                        <a
                          key={l.text}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="block text-white font-normal text-sm leading-relaxed hover:text-[#DF9F7E] transition-colors duration-300"
                        >
                          {l.text}
                        </a>
                      ) : (
                        <div key={l.text} className="text-white font-normal text-sm leading-relaxed">
                          {l.text}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal flex items-center gap-4 p-5 border border-white/15 bg-white/5 rounded-xl backdrop-blur-sm mt-3">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl text-[#DF9F7E] font-bold">4.2</span>
                <Star size={16} strokeWidth={1.5} className="text-[#DF9F7E] fill-[#DF9F7E]" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">Peruvian Fine Dining</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mt-0.5">
                  UB City · Bengaluru
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 reveal flex">
            <div className="relative w-full min-h-[380px] rounded-xl overflow-hidden border border-white/15 shadow-2xl">
              <iframe
                title="RIKO Location"
                src="https://www.google.com/maps?q=UB+City+Bengaluru&output=embed"
                className="absolute inset-0 w-full h-full grayscale-[0.3] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
