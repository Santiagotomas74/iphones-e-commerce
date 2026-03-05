export default function IphoneHeroElegant() {
  return (
    <section className="relative w-full overflow-hidden lg:h-[90vh] h-[65vh] bg-black">

      {/* Fondo */}
      <div
        className="
          absolute inset-0
          bg-no-repeat
          bg-contain
          sm:bg-cover
          bg-bottom sm:bg-center
        "
        style={{
          marginTop: "-150px",
          backgroundImage: 'url("/image/19.png")',
        }}
      />

      {/* Overlay SOLO en desktop */}
      <div className=" sm:block absolute inset-0 bg-black/10 lg:bg-black/40" />

      {/* Contenido */}
      <div
        className="
          relative z-10
          flex flex-col items-center
          justify-start sm:justify-center
          text-center
          px-6
          pt-24 sm:pt-0
          sm:min-h-screen
        "
      >

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

      </div>
    </section>
  );
}