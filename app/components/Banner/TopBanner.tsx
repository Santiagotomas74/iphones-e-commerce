"use client";

export default function TopBanner() {
  return (
    <div className="w-full bg-black overflow-hidden">
      
      <div className="marquee">
        <div className="marquee-track">

          {/* contenido */}
          <div className="marquee-group mr-100">
            <Item text="30% OFF EQUIPOS REACONDICIONADOS" highlight />
            <Item text="PAGOS SEGUROS CON MERCADO PAGO" />
            <Item text="EQUIPOS NUEVOS Y SEMI NUEVOS" />
            <Item text="15% OFF PAGANDO POR TRANSFERENCIA" highlight />
          </div>

          {/* duplicado */}
          <div className="marquee-group ml-16">
            <Item text="30% OFF EQUIPOS REACONDICIONADOS" highlight />
            <Item text="PAGOS SEGUROS CON MERCADO PAGO" />
            <Item text="EQUIPOS NUEVOS Y SEMI NUEVOS" />
            <Item text="15% OFF PAGANDO POR TRANSFERENCIA" highlight />
          </div>

        </div>
      </div>

    </div>
  );
}

function Item({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <span
      className={`mx-8 text-xs uppercase whitespace-nowrap ${
        highlight ? "text-yellow-400 font-semibold" : "text-gray-300"
      }`}
    >
      {text} •
    </span>
  );
}