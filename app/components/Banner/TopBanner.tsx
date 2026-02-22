"use client";

export default function TopBanner() {
  return (
    <div className="w-full bg-black overflow-hidden">
      <div className="whitespace-nowrap animate-marquee ">
        <span className="mx-10 text-yellow-400 font-extrabold tracking-wider text-lg md:text-xl uppercase tracking-wide">
          30% DE DESCUENTO EQUIPOS REFACCIONADOS Y MÁS •
        </span>
        <span className="mx-10 text-white font-extrabold tracking-wider text-lg md:text-xl uppercase tracking-wide">
          Aceptamos todos los medios de pagos •
        </span>
        <span className="mx-10 text-yellow-400 font-extrabold tracking-wider text-lg md:text-xl uppercase tracking-wide">
          10% en efectivo •
        </span>
      </div>
    </div>
  );
}