"use client";
import HeroProduct from "@/app/components/HeroProduct/HeroProduct";
import HeroSection from "@/app/components/HeroSection/HeroSection";

import { useEffect, useState } from "react";

export default function FadeToDark() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("transition");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const value = 1 - rect.top / windowHeight;
      setProgress(Math.min(Math.max(value, 0), 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="bg-white min-h-screen flex items-center justify-center">
        <HeroSection/>
      </section>

      <section
        id="transition"
        className="relative min-h-screen flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black transition-all duration-500"
          style={{
            opacity: progress,
            backdropFilter: `blur(${progress * 10}px)`,
          }}
        />

        <h2 className="text-5xl font-bold relative z-10">
          Transición Premium
        </h2>
      </section>

      <section className="bg-black min-h-screen flex items-center justify-center text-white">
        <HeroProduct/>
      </section>
    </>
  );
}