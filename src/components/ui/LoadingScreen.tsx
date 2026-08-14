"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Phase = "loading" | "exitingLogo" | "exitingScreen" | "done";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Let the logo spin for 3 seconds
    const exitLogo = setTimeout(() => setPhase("exitingLogo"), 3000);

    // 2. Shortly after the logo floats up, slide the entire black screen up
    const exitScreen = setTimeout(() => setPhase("exitingScreen"), 3400);

    // 3. Remove from DOM
    const done = setTimeout(() => setPhase("done"), 3400 + 1200);

    return () => {
      clearTimeout(exitLogo);
      clearTimeout(exitScreen);
      clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;

  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#0A0000",
        }}
      />
    );
  }

  const isExitingLogo = phase === "exitingLogo" || phase === "exitingScreen";
  const isExitingScreen = phase === "exitingScreen";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0A0000",
        pointerEvents: isExitingScreen ? "none" : "auto",
        // The entire black screen lifts up like a theater curtain
        transform: isExitingScreen ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Container for Logo + Text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          // Logo floats upwards as it fades out, leading the curtain lift
          transform: isExitingLogo ? "translateY(-40px)" : "translateY(0)",
          opacity: isExitingLogo ? 0 : 1,
          transition: "transform 0.8s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.6s ease-out",
        }}
      >
        <div style={{ position: "relative", width: 260, height: 260 }}>
          {/* Outer ring */}
          <div style={{ position: "absolute", inset: 0, animation: "spin-cw 6s linear infinite" }}>
            <Image
              src="/1.png"
              alt="Outer ring"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Inner emblem */}
          <div style={{ position: "absolute", inset: "15%", animation: "spin-ccw 5s linear infinite" }}>
            <Image
              src="/2.png"
              alt="Inner emblem"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Branding text */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "13px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#DF9F7E",
              fontWeight: 300,
              opacity: 0.9,
            }}
          >
            Peruvian · Latin · Fire
          </p>
          <p
            style={{
              marginTop: "8px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#FAF4EA",
              fontWeight: 300,
              opacity: 0.35,
            }}
          >
            UB City · Bengaluru
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
