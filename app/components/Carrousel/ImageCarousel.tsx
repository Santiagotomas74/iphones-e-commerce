"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const images = [
  "/image/iphone6.png",
  "/image/iphone7.jpeg",
  "/image/iphone8.jpeg",
  "/image/iphone9.png",
  "/image/iphone10.jpeg",
  
];

export default function ImageCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 Scroll vertical → cambia fondo
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.4;

      if (rect.top < triggerPoint) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Autoplay horizontal
  useEffect(() => {
    if (!emblaApi) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        emblaApi.scrollNext();
      }, 2500);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };

    startAutoplay();

    emblaApi.on("pointerDown", stopAutoplay);
    emblaApi.on("pointerUp", startAutoplay);

    return () => stopAutoplay();
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      className={`w-full py-24 mt-10 transition-colors duration-700  ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex-[0_0_70%] md:flex-[0_0_40%] px-6 "
            >
              <div className="w-full h-[500px] flex items-center justify-center rounded-2xl overflow-hidden">
                <img
                  src={src}
                  alt=""
                  className={`max-h-full max-w-full object-contain transition-all duration-700 hover:scale-105  ${
                    isDark ? "brightness-90" : "brightness-100"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}