"use client";

import { useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export interface VenueSpace {
  id: string;
  src: StaticImageData;
  title: string;
  zone: string;
  category: "lounge" | "hall" | "alcove" | "foyer" | "kitchen";
  desc: string;
  span?: string;
  details: {
    capacity: string;
    lighting: string;
    atmosphere: string;
    signatureFeature: string;
  };
}

interface VenueLightboxModalProps {
  spaces: VenueSpace[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function VenueLightboxModal({
  spaces,
  currentIndex,
  onClose,
  onSelectIndex,
}: VenueLightboxModalProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < spaces.length;
  const currentSpace = isOpen ? spaces[currentIndex] : null;

  // Handle keyboard navigation (ESC to close, Left/Right arrows to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onSelectIndex((currentIndex - 1 + spaces.length) % spaces.length);
      } else if (e.key === "ArrowRight") {
        onSelectIndex((currentIndex + 1) % spaces.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, spaces.length, onClose, onSelectIndex]);

  if (!isOpen || !currentSpace) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + spaces.length) % spaces.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % spaces.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/92 backdrop-blur-lg animate-fade-in transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={currentSpace.title}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#120205] border border-white/15 rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden text-[#FAF4EA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#9E2336] transition-colors focus:outline-none"
          aria-label="Close photo view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: High-Res Image */}
        <div className="relative lg:w-3/5 aspect-[4/3] lg:aspect-auto min-h-[280px] lg:min-h-[480px] bg-black">
          <Image
            src={currentSpace.src}
            alt={currentSpace.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Navigation Arrows */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/20 text-white hover:bg-[#9E2336] transition-colors shadow-lg"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/50 border border-white/20 text-white hover:bg-[#9E2336] transition-colors shadow-lg"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Counter Tag */}
          <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono tracking-widest text-[#DF9F7E]">
            {currentIndex + 1} / {spaces.length}
          </div>
        </div>

        {/* Right Column: Specifications */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#1C0307] to-[#0D0103]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#DF9F7E] font-mono block mb-2">
              {currentSpace.zone}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF4EA] mb-2 font-normal leading-tight">
              {currentSpace.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF4EA]/75 font-light leading-relaxed mb-5">
              {currentSpace.desc}
            </p>

            <div className="w-full h-px bg-white/10 my-4" />

            {/* Details Grid */}
            <div className="space-y-3 text-xs font-light">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="uppercase tracking-wider text-white/50 font-mono text-[10px]">Layout</span>
                <span className="text-white">{currentSpace.details.capacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="uppercase tracking-wider text-white/50 font-mono text-[10px]">Lighting</span>
                <span className="text-white">{currentSpace.details.lighting}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="uppercase tracking-wider text-white/50 font-mono text-[10px]">Atmosphere</span>
                <span className="text-white">{currentSpace.details.atmosphere}</span>
              </div>
              <div className="pt-1">
                <span className="block uppercase tracking-wider text-white/50 font-mono text-[10px] mb-1">Highlight</span>
                <span className="text-[#DF9F7E] font-light">{currentSpace.details.signatureFeature}</span>
              </div>
            </div>
          </div>

          {/* Reserve CTA inside Modal */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-light">RIKO Bengaluru</span>
            <Link
              href="/#reservations"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9E2336] text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-[#DF9F7E] hover:text-[#3E0E16] transition-colors"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
