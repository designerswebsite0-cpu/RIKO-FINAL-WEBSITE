"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import hero from "@/assets/hero.jpg";

export function HeroSection() {
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden grain">
      <div className="absolute inset-0">
        <Image
          src={hero}
          alt="RIKO Red Vault Lounge & Dining Room"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover animate-slow-zoom brightness-105 contrast-105"
        />
        {/* Subtle vignette gradients so the image remains crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-black/80" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between py-6 px-6 lg:px-12 max-w-[1500px] mx-auto w-full">
        {/* Top Spacer for Nav */}
        <div className="pt-16" />

        {/* Centered Editorial Title (Pasta e Passione style) */}
        <div className="text-center max-w-5xl mx-auto my-auto py-2 flex flex-col justify-center items-center">
          <div className="reveal inline-flex items-center gap-3 px-5 py-1.5 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#DF9F7E] mb-6 font-medium">
            ★ Bengaluru — UB City
          </div>

          <h1 className="reveal font-serif text-4xl sm:text-6xl lg:text-8xl text-white tracking-[0.15em] uppercase leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
            SABOR <span className="font-calligraphy text-5xl sm:text-7xl lg:text-[7.5rem] text-[#DF9F7E] font-normal lowercase px-2 align-middle drop-shadow-md">de</span> RIKO
          </h1>

          <div className="reveal flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
            <Link
              href="/menu"
              className="px-6 py-3 bg-white text-[#3E0E16] text-[10px] uppercase tracking-[0.3em] hover:bg-[#DF9F7E] hover:text-white transition-all duration-500 font-semibold rounded-full shadow-2xl"
            >
              Explore Menu
            </Link>

            <Link
              href="/reservation"
              className="px-6 py-3 border border-white/60 bg-black/30 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-[#3E0E16] transition-all duration-500 font-medium rounded-full shadow-lg"
            >
              Reserve Table
            </Link>

            <button
              onClick={() => setShowOrderModal(true)}
              className="px-6 py-3 border border-[#DF9F7E]/60 bg-black/30 backdrop-blur-md text-[#DF9F7E] text-[10px] uppercase tracking-[0.3em] hover:bg-[#DF9F7E] hover:text-white transition-all duration-500 cursor-pointer rounded-full font-medium"
            >
              Order Online
            </button>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="text-center pb-2">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/50">
            Scroll to explore
          </span>
        </div>
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowOrderModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-[#1A0508] border border-[#DF9F7E]/30 text-white p-8 rounded-lg max-w-md w-full z-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 cursor-pointer transition-opacity hover:opacity-100 focus:outline-none text-white p-1"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl text-white tracking-wide">Order RIKO Online</h2>
              <p className="text-[#DF9F7E] text-[10px] tracking-wider uppercase mt-2 font-semibold">
                Select your preferred delivery platform
              </p>
            </div>

            <div className="grid gap-4 mt-2">
              <a
                href="https://swiggy.onelink.me/BVRZ?af_dp=swiggydiners%3A%2F%2Fdetails%2F1259452%3Fsource%3Dsharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 border border-white/10 hover:border-[#DF9F7E]/50 hover:bg-[#3E0E16]/30 transition-all duration-500 group rounded"
              >
                <div>
                  <div className="font-serif text-lg text-white group-hover:text-[#DF9F7E] transition-colors">
                    Swiggy
                  </div>
                  <div className="text-[10px] text-[#DF9F7E]/70 tracking-widest uppercase mt-1">
                    Delivery & Diners
                  </div>
                </div>
                <span className="text-[#DF9F7E] text-[10px] tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Order Now →
                </span>
              </a>

              <a
                href="https://zomato.onelink.me/xqzv/hp4macoq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 border border-white/10 hover:border-[#DF9F7E]/50 hover:bg-[#3E0E16]/30 transition-all duration-500 group rounded"
              >
                <div>
                  <div className="font-serif text-lg text-white group-hover:text-[#DF9F7E] transition-colors">
                    Zomato
                  </div>
                  <div className="text-[10px] text-[#DF9F7E]/70 tracking-widest uppercase mt-1">
                    Delivery & Dining
                  </div>
                </div>
                <span className="text-[#DF9F7E] text-[10px] tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Order Now →
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
