"use client";

import { useEffect, useState } from "react";

export default function HeroProduct() {
  const images = ["/recorte4.png", "/recorte3.png", "/iphone2.svg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % images.length);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);
    }, 4800);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030301] mt-50 mb-50">
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Contenedor */}
        <div className="relative w-[320px] md:w-[420px] h-[420px] overflow-hidden">

          {images.map((img, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === prevIndex;

            return (
              <img
                key={index}
                src={img}
                alt="iPhone Premium"
                className={`
                  absolute inset-0 w-full h-full object-contain
                  transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                  
                  ${
                    isActive
                      ? "translate-x-0 opacity-100 scale-105 blur-0"
                      : isPrev && isTransitioning
                      ? "-translate-x-full opacity-0 scale-100 blur-sm"
                      : "translate-x-full opacity-0 scale-100 blur-sm"
                  }
                `}
              />
            );
          })}
        </div>

        <h1 className="mt-10 text-4xl md:text-6xl font-bold text-white tracking-tight">
          iPhone 17 Pro Max
        </h1>

        <p className="mt-4 text-gray-400 max-w-xl">
          Potencia, diseño y tecnología en su versión más premium.
        </p>

        <button className="mt-8 px-8 py-4 bg-gradient-to-r from-[#FF6A00] to-[#B94700] text-white rounded-2xl font-semibold shadow-[0_0_25px_rgba(255,106,0,0.4)] hover:scale-105 transition-all duration-300">
          Comprar ahora
        </button>
      </div>
    </section>
  );
}