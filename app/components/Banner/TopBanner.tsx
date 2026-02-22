"use client";

export default function TopBanner() {
  return (
    <div className="w-full bg-black overflow-hidden">
      <div className="flex">
        <div className="animate-marquee whitespace-nowrap py-2">
          <span className="mx-8 text-yellow-400 text-xs uppercase">
            30% equipos refaccionados •
          </span>
          <span className="mx-8 text-gray-300 text-xs uppercase">
            Aceptamos Todos los medios de pago •
          </span>
          <span className="mx-8 text-gray-300 text-xs uppercase">
            Equipos semi nuevos •
          </span>
          <span className="mx-8 text-yellow-400 text-xs uppercase">
            10% en efectivo
          </span>       
        </div> 
      </div>
    </div>
  );
}