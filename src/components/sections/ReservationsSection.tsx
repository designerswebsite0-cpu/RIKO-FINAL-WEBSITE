"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import tableAlcove from "@/assets/table-alcove.jpg";
import { Phone, Calendar, Clock, Users, ChevronDown } from "lucide-react";
import { ApiClient } from "@/lib/api-client";

/* ─── Time slots ──────────────────────────────────────────── */
const TIME_SLOTS = [
  "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
  "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM",
];

const GUEST_OPTIONS = [
  "1 Guest", "2 Guests", "3 Guests", "4 Guests",
  "5 Guests", "6 Guests", "7 Guests", "8+ Guests",
];

/* ─── Elegant dark input with maroon focus border ─────────── */
const inputBase =
  "w-full bg-[#140306]/80 border border-[#9E2336]/30 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#DF9F7E] focus:bg-[#220509] transition-all duration-200 appearance-none shadow-inner";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  icon: Icon,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="relative">
      <label className="block text-[10px] tracking-[0.25em] uppercase text-[#DF9F7E] mb-1.5 font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DF9F7E]/50">
            <Icon size={14} strokeWidth={1.5} />
          </div>
        )}
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={`${inputBase} ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  icon: Icon,
}: {
  label: string;
  name: string;
  options: string[];
  icon?: React.ElementType;
}) {
  return (
    <div className="relative">
      <label className="block text-[10px] tracking-[0.25em] uppercase text-[#DF9F7E] mb-1.5 font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DF9F7E]/50">
            <Icon size={14} strokeWidth={1.5} />
          </div>
        )}
        <select
          name={name}
          className={`${inputBase} ${Icon ? "pl-10" : ""} cursor-pointer pr-9`}
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#1C0408] text-white">
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#DF9F7E]/50">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */
export function ReservationsSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const guestsStr = formData.get("guests") as string;
    const specialRequest = formData.get("specialRequest") as string;

    const guestsMatch = guestsStr.match(/\d+/);
    const guests = guestsMatch ? parseInt(guestsMatch[0], 10) : 2;

    try {
      const data = await ApiClient.createReservation({
        name,
        email,
        phone,
        date,
        time,
        guests,
        specialRequest,
      });

      if (!data.success) {
        setError(data.error || "Failed to submit. Please try again.");
      } else {
        setSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setSuccess(false), 10000);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reservations"
      className="relative min-h-screen lg:h-screen lg:max-h-screen bg-gradient-to-b from-[#160205] via-[#2A060C] to-[#120204] overflow-y-auto lg:overflow-hidden flex flex-col justify-center"
    >
      {/* Deep Maroon Radial Glow in Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7A1523]/35 via-[#230408]/70 to-[#0A0002] pointer-events-none" />

      {/* Background ambient image */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src={tableAlcove}
          alt="Intimate candlelit dining table at RIKO"
          fill
          priority
          className="object-cover opacity-[0.14] mix-blend-overlay"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#2A060C]/60 to-black/80" />
      </div>

      {/* ── Single-screen two-column layout ───────────────── */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-20 pb-8 lg:pb-6 my-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* LEFT — RIKO Maroon editorial & instant phone box */}
        <div className="lg:w-[42%] flex flex-col justify-center">
          {/* Eyebrow badge */}
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#DF9F7E] mb-4 font-semibold px-3 py-1 rounded-full border border-[#9E2336]/40 bg-[#3E0E16]/40 w-fit backdrop-blur-sm">
            ★ Reservations
          </span>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.06] tracking-[0.04em] uppercase drop-shadow-md">
            Reserve{" "}
            <span className="font-calligraphy text-4xl sm:text-6xl lg:text-7xl text-[#DF9F7E] font-normal lowercase px-1.5 align-middle">
              your evening
            </span>
          </h1>

          <p className="mt-4 text-sm text-white/70 font-light leading-relaxed max-w-sm">
            Tables are intimate and limited. Reserve online or call us directly for instant phone booking.
          </p>

          {/* Prominent RIKO Maroon Call-to-Reserve Card */}
          <div className="mt-6 p-5 rounded-2xl border border-[#9E2336]/50 bg-gradient-to-br from-[#3E0E16]/90 via-[#24060A]/80 to-[#120204]/90 backdrop-blur-md max-w-sm shadow-[0_10px_30px_rgba(158,35,54,0.25)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#DF9F7E] font-bold">
                Instant Reservation
              </span>
              <span className="text-[10px] text-white/50">Tue – Sun · 6:30 PM – Late</span>
            </div>
            <p className="text-xs text-white/80 mb-3">Prefer booking over the phone?</p>
            <a
              href="tel:+919972540238"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#9E2336] to-[#C8344B] text-white font-semibold text-xs tracking-wider uppercase hover:from-[#DF9F7E] hover:to-[#DF9F7E] hover:text-black transition-all duration-300 w-full justify-center shadow-lg group cursor-pointer"
            >
              <Phone size={15} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
              Call +91 99725 40238
            </a>
          </div>

          {/* Quick links on mobile */}
          <div className="mt-5 flex gap-5 lg:hidden">
            <Link
              href="/menu"
              className="text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-[#DF9F7E] transition-colors border-b border-white/15 pb-0.5"
            >
              View Menu
            </Link>
            <Link
              href="/social#contact"
              className="text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-[#DF9F7E] transition-colors border-b border-white/15 pb-0.5"
            >
              Find Us
            </Link>
          </div>
        </div>

        {/* RIGHT — Rich Maroon Form Panel */}
        <div className="lg:w-[58%] w-full flex items-center justify-center">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-[#9E2336]/40 bg-gradient-to-b from-[#220509]/95 via-[#1A0407]/90 to-[#120204]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]">

            {/* Success state */}
            {success ? (
              <div className="text-center py-12 px-6 rounded-2xl border border-[#DF9F7E]/30 bg-[#DF9F7E]/10">
                <div className="text-[#DF9F7E] text-3xl mb-3">✦</div>
                <h2 className="font-serif text-3xl text-white mb-2">Request Received</h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                  We&apos;ll confirm your table within 24 hours. Check your email or call us directly.
                </p>
                <a
                  href="tel:+919972540238"
                  className="inline-flex items-center gap-2 mt-6 text-xs tracking-[0.25em] uppercase text-[#DF9F7E] border border-[#DF9F7E]/40 px-6 py-3 rounded-full hover:bg-[#DF9F7E] hover:text-black transition-all duration-300 font-semibold"
                >
                  <Phone size={14} /> Call Us
                </a>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

                {/* Form header */}
                <div className="flex items-center justify-between border-b border-[#9E2336]/30 pb-3.5">
                  <div>
                    <h2 className="font-serif text-2xl text-white">Book Online</h2>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-white/50 mt-0.5">
                      Instant Request · Confirmation in 24h
                    </p>
                  </div>
                  <span className="text-[10px] text-[#DF9F7E] font-semibold uppercase tracking-widest border border-[#DF9F7E]/40 bg-[#3E0E16]/50 px-2.5 py-1 rounded-md">
                    UB City
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <div className="py-2.5 px-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-xs text-center">
                    {error}
                  </div>
                )}

                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field label="Full Name" name="name" required placeholder="Your name" />
                  <Field label="Phone" name="phone" type="tel" required placeholder="+91 00000 00000" icon={Phone} />
                </div>

                {/* Row 2: Email & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
                  <div className="relative">
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[#DF9F7E] mb-1.5 font-medium">
                      Guests
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DF9F7E]/50">
                        <Users size={14} strokeWidth={1.5} />
                      </div>
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        max="30"
                        required
                        defaultValue="2"
                        placeholder="Number of guests"
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field label="Date" name="date" type="date" required icon={Calendar} />
                  <div className="relative">
                    <label className="block text-[10px] tracking-[0.25em] uppercase text-[#DF9F7E] mb-1.5 font-medium">
                      Time
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DF9F7E]/50">
                        <Clock size={14} strokeWidth={1.5} />
                      </div>
                      <input
                        type="time"
                        name="time"
                        min="18:00"
                        max="23:30"
                        required
                        defaultValue="19:00"
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Special requests */}
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[#DF9F7E] mb-1.5 font-medium">
                    Special Requests
                    <span className="ml-1.5 text-white/30 normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    name="specialRequest"
                    rows={1}
                    placeholder="Allergies, occasion, seating preference…"
                    className={`${inputBase} resize-none h-11 py-2.5`}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#DF9F7E] text-black text-xs uppercase tracking-[0.3em] font-semibold hover:bg-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(223,159,126,0.3)] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Requesting…
                    </>
                  ) : (
                    "Request Reservation"
                  )}
                </button>

                {/* Fine print */}
                <p className="text-center text-[10px] text-white/40 pt-1">
                  Same-day bookings? Call{" "}
                  <a href="tel:+919972540238" className="text-[#DF9F7E] font-medium hover:underline">
                    +91 99725 40238
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
