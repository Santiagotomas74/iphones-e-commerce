export default function IphoneHeroElegant() {
  return (
    <section className="relative w-full lg:h-[95vh] overflow-hidden">

      {/* Fondo optimizado */}
      <div
        className="
          absolute inset-0 
          bg-cover 
          bg-center 
          sm:bg-center 
          bg-black
          bg-[position:60%_center] 
          lg:bg-center
        "
        style={{
          backgroundImage: 'url("/image/19.png")',
        }}
      />

      {/* Overlay más suave en mobile */}
      <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen lg:h-full text-center px-6">

        <p className="text-gray-300 tracking-widest text-xs sm:text-sm uppercase">
          Presentamos
        </p>

        <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-[-0.03em] leading-tight">
          iPhone 17 Pro Max
        </h1>

        <p className="mt-6 text-gray-300 text-base sm:text-lg max-w-xl">
          Potencia redefinida. Diseño impecable.
          La experiencia más avanzada jamás creada.
        </p>

        <div className="mt-10 flex gap-8 sm:gap-10 text-white text-base sm:text-lg font-medium">
          <button className="hover:opacity-70 transition">
            Más información
          </button>

          <button className="hover:opacity-70 transition">
            Comprar
          </button>
        </div>

      </div>
    </section>
  );
}