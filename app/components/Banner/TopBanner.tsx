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
            Pagos asegurados por mercado pago •
          </span>
          <span className="mx-8 text-gray-300 text-xs uppercase">
            Equipos Nuevos y Semi nuevos •
          </span>
          <span className="mx-8 text-yellow-400 text-xs uppercase">
            15% en Transferencia Bancaria •
          </span>       
        </div> 
      </div>
    </div>
  );
}