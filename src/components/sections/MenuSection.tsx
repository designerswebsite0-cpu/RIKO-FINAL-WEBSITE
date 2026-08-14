"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "@/types/domain";
import { menuSeedItems } from "@/data/menu-items";
import { ApiClient } from "@/lib/api-client";

const categoryOrder: MenuItem["category"][] = [
  "For One",
  "Salads",
  "Cold Dishes",
  "Hot Dishes",
  "Mains",
  "Desserts",
  "Beverages",
];

function sortMenu(items: MenuItem[]) {
  return [...items].sort((a, b) => {
    const categoryDelta =
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (categoryDelta !== 0) return categoryDelta;
    return (a.sortOrder || Number(a.id) || 0) - (b.sortOrder || Number(b.id) || 0);
  });
}

export function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>(menuSeedItems);
  const [activeCategory, setActiveCategory] = useState<MenuItem["category"]>(categoryOrder[0]);
  const [activeCard, setActiveCard] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadMenu() {
      try {
        const data = await ApiClient.getMenu();
        if (alive && data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(sortMenu(data.items));
          setActiveCategory((data.items[0].category || categoryOrder[0]) as MenuItem["category"]);
        }
      } catch {
        setItems(menuSeedItems);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadMenu();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const present = new Set<MenuItem["category"]>(items.map((item) => item.category));
    return categoryOrder.filter((category) => present.has(category));
  }, [items]);

  const activeItems = useMemo(
    () => sortMenu(items.filter((item) => item.category === activeCategory)),
    [activeCategory, items],
  );

  useEffect(() => {
    setActiveCard(0);
    requestAnimationFrame(() => {
      if (carouselRef.current) carouselRef.current.scrollLeft = 0;
    });
  }, [activeCategory]);

  function updateActiveCard() {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-menu-card]"));
    const carouselRect = carousel.getBoundingClientRect();
    const center = carouselRect.left + carouselRect.width / 2;
    let closest = 0;
    let distance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const delta = Math.abs(center - cardCenter);
      if (delta < distance) {
        distance = delta;
        closest = index;
      }
    });

    setActiveCard(closest);
  }

  function scrollToCard(index: number) {
    const carousel = carouselRef.current;
    const card = carousel?.querySelectorAll<HTMLElement>("[data-menu-card]")[index];
    if (!carousel || !card) return;
    carousel.scrollTo({
      left: card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2,
      behavior: "smooth",
    });
  }

  function moveCard(direction: -1 | 1) {
    const nextIndex = Math.min(Math.max(activeCard + direction, 0), activeItems.length - 1);
    scrollToCard(nextIndex);
    setActiveCard(nextIndex);
  }

  return (
    <section
      id="menu"
      className="relative min-h-screen lg:h-screen lg:max-h-screen bg-gradient-to-b from-[#160205] via-[#2A060C] to-[#120204] overflow-y-auto lg:overflow-hidden flex flex-col justify-between pt-24 lg:pt-32 pb-4 lg:pb-6"
    >
      {/* RIKO Maroon ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7A1523]/35 via-[#230408]/60 to-[#0A0002] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex-1 flex flex-col justify-between my-auto">
        
        {/* Category Sections Bar — Horizontally scrollable on mobile */}
        <div className="no-scrollbar mx-auto flex w-full max-w-4xl overflow-x-auto flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 py-2 px-2 mt-4 lg:mt-6 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-medium cursor-pointer ${
                activeCategory === category
                  ? "bg-[#DF9F7E] text-[#220408] shadow-md font-bold scale-105"
                  : "bg-[#3E0E16]/60 text-white/80 hover:bg-[#6B0F1A]/60 hover:text-white border border-[#9E2336]/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Swipe / Scroll Hint Banner */}
        <div className="flex items-center justify-between px-3 py-2 max-w-5xl mx-auto w-full mb-4">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#DF9F7E]">
            <span className="animate-pulse font-bold">⟵</span>
            <span>Swipe to explore dishes</span>
            <span className="animate-pulse font-bold">⟶</span>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {activeItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveCard(idx);
                  scrollToCard(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeCard === idx
                    ? "w-4 bg-[#DF9F7E]"
                    : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Go to item ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto my-auto w-full max-w-[1380px]">

          {/* Desktop Floating Left Arrow */}
          <button
            type="button"
            onClick={() => moveCard(-1)}
            disabled={activeCard === 0}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#180306]/90 border border-[#DF9F7E]/50 text-[#DF9F7E] backdrop-blur-md items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#DF9F7E] hover:text-black disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous Dish"
          >
            ‹
          </button>

          {/* Desktop Floating Right Arrow */}
          <button
            type="button"
            onClick={() => moveCard(1)}
            disabled={activeCard >= activeItems.length - 1}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#180306]/90 border border-[#DF9F7E]/50 text-[#DF9F7E] backdrop-blur-md items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#DF9F7E] hover:text-black disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next Dish"
          >
            ›
          </button>

          {loading ? (
            <div className="py-16 text-center text-xs uppercase tracking-[0.4em] text-white/50">
              Loading RIKO Menu...
            </div>
          ) : (
            <div
              ref={carouselRef}
              onScroll={() => requestAnimationFrame(updateActiveCard)}
              className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 sm:gap-5 overflow-x-auto scroll-smooth py-1 px-4 sm:px-8 lg:px-12 active:cursor-grabbing"
            >
              {activeItems.map((item, index) => (
                <article
                  key={item.id || item.slug || item.name}
                  data-menu-card
                  onClick={() => {
                    setActiveCard(index);
                    scrollToCard(index);
                  }}
                  className={`relative flex shrink-0 snap-center flex-col overflow-hidden rounded-2xl border p-3 transition-all duration-300 cursor-pointer w-full lg:w-[calc((100%-2.5rem)/3)] ${
                    activeCard === index
                      ? "bg-gradient-to-b from-[#3E0E16]/95 via-[#25060B]/95 to-[#160205]/95 border-[#DF9F7E] shadow-[0_10px_30px_rgba(223,159,126,0.25)] scale-[1.01]"
                      : "bg-[#1E0408]/80 border-[#9E2336]/35 hover:border-[#DF9F7E]/50 hover:bg-[#2A060C]/90 opacity-90"
                  }`}
                >
                  {/* Dish Image Display Box — Explicit 4:5 Aspect Ratio, capped only on desktop */}
                  <div className="relative aspect-[4/5] lg:max-h-[45vh] w-full bg-black/60 overflow-hidden rounded-xl shadow-md border border-white/10 mx-auto">
                    <img
                      src={item.imageUrl || "/menu-assets/bomba_de_choclo.png"}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Price Pill */}
                    <span className="absolute top-2.5 right-2.5 bg-[#160205]/90 backdrop-blur-md text-[#DF9F7E] font-bold text-xs px-2.5 py-1 rounded-full border border-[#DF9F7E]/40 shadow-lg">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Clean Content Area below Image */}
                  <div className="flex flex-col justify-between pt-2.5 px-1 flex-1">
                    <div>
                      {/* Category Tag */}
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#DF9F7E] font-semibold block mb-0.5">
                        {item.category}
                      </span>
                      
                      {/* Title */}
                      <h3 className="font-serif text-base sm:text-lg text-white font-medium leading-snug mb-1 line-clamp-1">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="line-clamp-2 text-[11px] sm:text-xs text-white/75 font-light leading-relaxed mb-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Status Bar */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono">
                        Fire Kitchen
                      </span>
                      <span className={`text-[9px] uppercase tracking-widest font-semibold transition-colors ${
                        activeCard === index ? "text-[#DF9F7E]" : "text-white/40"
                      }`}>
                        {activeCard === index ? "★ Selected" : "Tap to select"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between gap-4 pt-2 max-w-5xl mx-auto w-full border-t border-white/10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">
            Dish <span className="text-[#DF9F7E] font-bold">{activeCard + 1}</span> of <span className="text-white font-bold">{activeItems.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveCard(-1)}
              disabled={activeCard === 0}
              className="px-3.5 py-1.5 border border-white/20 rounded-full text-[9px] uppercase tracking-[0.25em] text-white hover:border-[#DF9F7E] hover:text-[#DF9F7E] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => moveCard(1)}
              disabled={activeCard >= activeItems.length - 1}
              className="px-3.5 py-1.5 border border-white/20 rounded-full text-[9px] uppercase tracking-[0.25em] text-white hover:border-[#DF9F7E] hover:text-[#DF9F7E] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
