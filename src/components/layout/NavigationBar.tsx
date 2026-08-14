"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/riko-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/experience", label: "Experience" },
  { to: "/featured", label: "Featured" },
  { to: "/social", label: "Social Media" },
];

export function NavigationBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-xl bg-background/90 border-b border-border/80 shadow-sm py-3"
          : "bg-gradient-to-b from-black/60 via-black/20 to-transparent py-6"
      }`}
    >
      <nav className="max-w-[1500px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src={logo}
            alt="RIKO South American Cuisine"
            width={56}
            height={56}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover ring-1 ring-accent/60 shadow-[0_0_20px_-4px_rgba(223,159,126,0.4)] transition-transform duration-700 group-hover:scale-105"
          />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-xl tracking-[0.3em] text-white">
              RIKO
            </span>
            <span className="text-[10px] tracking-[0.35em] mt-1 text-[#DF9F7E]">
              SOUTH AMERICAN CUISINE
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                href={l.to}
                className={`relative text-[12px] uppercase tracking-[0.25em] hover:text-accent transition-colors duration-500 font-medium ${
                  isActive(l.to)
                    ? "text-accent font-semibold"
                    : scrolled
                      ? "text-foreground/80"
                      : "text-white/90"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Reserve CTA */}
        <Link
          href="/reservation"
          className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] bg-[#DF9F7E] text-[#3E0E16] hover:bg-[#3E0E16] hover:text-[#FAF4EA] transition-all duration-500 rounded-full font-semibold shadow-md"
        >
          Reserve a Table
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-foreground" : "bg-white"} ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-foreground" : "bg-white"} ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-foreground" : "bg-white"} ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-in-out bg-background/98 backdrop-blur-xl ${
          open ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <ul className="px-8 py-8 space-y-5">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                onClick={() => setOpen(false)}
                href={l.to}
                className={`block text-lg font-display tracking-wide hover:text-accent transition-colors ${
                  isActive(l.to) ? "text-accent" : "text-sand"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/reservation"
              onClick={() => setOpen(false)}
              className="inline-block mt-4 px-8 py-3 text-xs uppercase tracking-[0.3em] bg-[#DF9F7E] text-[#3E0E16] rounded-full font-semibold"
            >
              Reserve a Table
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
