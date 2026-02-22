"use client";

import HeroProduct from "@/app/components/HeroProduct/HeroProduct";
import HeroSection from "@/app/components/HeroSection/HeroSection";
import { motion } from "framer-motion";
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
      {/* Sección Blanca */}
      <section className="bg-white min-h-screen flex items-center justify-center">
        <HeroSection />
      </section>

      {/* Transición Blur */}
      <section
        id="transition"
        className="relative min-h-screen flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black transition-all duration-100"
          style={{
            opacity: Math.min(progress * 2, 1),
            backdropFilter: `blur(${progress * 10}px)`,
          }}
        />

         {/* Sección Negra con animación premium */}
       <motion.div
          initial={{
            y: 140,
            opacity: 0,
            scale: 0.96,
            filter: "blur(12px)",
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1], // easing tipo Apple real
          }}
          viewport={{
            once: false, // 🔥 ahora se repite
            amount: 0.4,
          }}
        >
          <HeroProduct />
        </motion.div>
      </section>

     
      
    </>
  );
}