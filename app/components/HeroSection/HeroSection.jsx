export default function HeroIphone() {
  return (
    <section className="relative w-full px-4 sm:px-8 lg:px-16 py-10 sm:py-16">

      {/* Radial light effect desktop */}
    <div className="
  hidden lg:block
  absolute right-[-150px] top-1/2 -translate-y-1/2
  w-[600px] xl:w-[800px]
  aspect-square
  rounded-full
  bg-[radial-gradient(circle,rgba(120,80,255,0.55),transparent_60%)]
  blur-[140px]
  z-0
"/>

      <div className="relative grid lg:grid-cols-2 items-center gap-12 lg:gap-20">

        {/* LEFT */}
        <div className="w-full max-w-2xl mx-auto px-4 text-center lg:text-left">

  <span className="inline-block bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-6">
    Nuevo
  </span>

  <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-medium text-gray-900 leading-tight mb-6 tracking-[-0.02em]">
    iPhone 15 Pro Max
  </h1>

  <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6">
    Más potencia. Más carácter. Nuevo acabado Orange
  </p>

  <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 mb-8">
    Desde $1.500.000
  </p>

  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 sm:py-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
    Comprar ahora
  </button>

</div>

        {/* RIGHT */}
        <div className="relative flex justify-center lg:justify-end">

          {/* Glow effect */}
           <div className="
    absolute left-1/2 -translate-x-1/2 
    w-[250px] sm:w-[350px] md:w-[450px] lg:w-[550px]
    aspect-square
    rounded-full
    bg-[radial-gradient(circle,rgba(60,35,185,0.6),transparent_90%)]
    blur-3xl
    z-0
  " />

        <video
  src="/videos/17protwo.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="
    relative z-10
    w-full
    max-w-[760px]
    min-w-[300px]
    h-auto
    object-contain
    
  "
/>

        </div>

      </div>
    </section>
  );
}