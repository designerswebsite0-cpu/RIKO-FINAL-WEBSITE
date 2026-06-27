"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "@/types/domain";
import { menuSeedItems } from "@/data/menu-items";

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
        const res = await fetch("/api/v1/menu", { cache: "no-store" });
        const data = await res.json();
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
      className="relative overflow-hidden border-t border-accent/15 bg-[#0B0B0B] px-6 py-24 text-white md:px-12 lg:py-32"
    >
      <div className="absolute left-[-10%] top-[20%] h-[60%] w-1/2 rounded-full bg-[#350E10]/20 blur-3xl" />
      <div className="absolute bottom-[10%] right-[-10%] h-[60%] w-1/2 rounded-full bg-[#350E10]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1300px] text-center">
        <p className="reveal mb-6 text-[11px] uppercase tracking-[0.45em] text-accent">
          Interactive Menu
        </p>
        <h2 className="reveal font-display text-5xl font-light leading-tight text-white md:text-7xl">
          Bespoke
          <br />
          <span className="font-serif italic text-sand">Curations</span>
        </h2>
        <p className="reveal mx-auto mt-7 max-w-xl text-sm font-light leading-8 text-white/50">
          Browse our contemporary creations. Switch categories below and swipe to center
          the signature visual cards.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-2 border border-white/[0.03] bg-[#141414]/60 p-3 shadow-2xl backdrop-blur-xl">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-4 text-[11px] uppercase tracking-[0.28em] transition-all duration-500 ${
              activeCategory === category
                ? "border-b border-accent bg-accent/5 text-accent"
                : "text-white/45 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-[1300px]">
        {loading ? (
          <div className="py-24 text-center text-[11px] uppercase tracking-[0.45em] text-white/35">
            Loading the menu...
          </div>
        ) : (
          <>
            <div
              ref={carouselRef}
              onScroll={() => requestAnimationFrame(updateActiveCard)}
              className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth py-12 pb-10 active:cursor-grabbing"
            >
              <div className="shrink-0 basis-[calc(50vw-220px)]" />
              {activeItems.map((item, index) => (
                <article
                  key={item.id || item.slug || item.name}
                  data-menu-card
                  className={`relative flex max-w-[420px] shrink-0 basis-[82vw] snap-center items-center justify-center overflow-hidden rounded-xl border bg-[#0B0B0B] shadow-2xl transition-all duration-700 sm:basis-[420px] ${
                    activeCard === index
                      ? "-translate-y-4 scale-100 border-accent/45 opacity-100 blur-0 grayscale-0"
                      : "scale-[0.85] border-white/5 opacity-70 blur-[1px]"
                  }`}
                >
                  <img
                    src={item.imageUrl || "/menu-assets/bomba_de_choclo.png"}
                    alt={item.name}
                    className="block h-auto w-full object-contain [clip-path:inset(0_0_38%_0)]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 rounded-b-xl bg-gradient-to-t from-[#0B0B0B] from-50% via-[#0B0B0B]/80 to-transparent px-5 pb-5 pt-16 text-left">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="truncate font-serif text-2xl font-normal tracking-wide text-white">
                        {item.name}
                      </h3>
                      <span className="shrink-0 text-lg font-medium text-accent">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs font-light leading-5 text-white/45">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
              <div className="shrink-0 basis-[calc(50vw-220px)]" />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => moveCard(-1)}
                disabled={activeCard === 0}
                className="min-w-36 border border-accent/35 px-5 py-3 text-[10px] uppercase tracking-[0.35em] text-sand/70 transition-all hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-[10px] uppercase tracking-[0.35em] text-sand/35">
                Swipe on mobile · {activeCard + 1} / {activeItems.length}
              </span>
              <button
                type="button"
                onClick={() => moveCard(1)}
                disabled={activeCard >= activeItems.length - 1}
                className="min-w-36 border border-accent/35 px-5 py-3 text-[10px] uppercase tracking-[0.35em] text-sand/70 transition-all hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
