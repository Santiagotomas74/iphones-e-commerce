type PS5HeroBannerProps = {
  backgroundImage: string;
};

export default function PS5HeroBanner({ backgroundImage }: PS5HeroBannerProps) {
  return (
    <section className="relative w-full sm:h-[70vh] lg:h-[80vh] h-[103vh] overflow-hidden">

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 
      
          bg-center
          bg-contain
          sm: bg-center
        "
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Overlay oscuro elegante */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">

        <h1 className="
          text-4xl sm:text-6xl lg:text-7xl 
          font-semibold 
          tracking-[-0.03em]
        ">
          PlayStation 5
        </h1>

        <div className="mt-4 h-[3px] w-24 bg-blue-500 rounded-full" />

        <p className="mt-6 text-gray-300 max-w-xl text-base sm:text-lg">
          Nueva generación de potencia, velocidad y experiencia inmersiva.
        </p>

      </div>
    </section>
  );
}