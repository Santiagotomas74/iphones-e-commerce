import Image from "next/image";

export default function PromoSectionTopGlow() {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">

      {/* Fondo (NO SE TOCA) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(
              circle at 50% -15%,
              #1a4dff 0%,
              #0a2cff 25%,
              #001a66 55%,
              #000814 80%,
              #000000 100%
            )
          `
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* CONTENIDO NUEVO */}
      <div className="relative z-10 max-w-7xl mx-auto 
                      grid grid-cols-1 lg:grid-cols-2 
                      items-center gap-12">

        {/* TEXTO */}
        <div className="text-white space-y-6 text-center lg:text-left">

          <span className="uppercase tracking-widest text-blue-400 text-sm">
            Nueva Generación
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
            PlayStation 5 Digital
          </h1>

          <h2 className="text-2xl sm:text-3xl text-blue-400 font-light">
            1TB SSD
          </h2>

          <p className="text-gray-300 max-w-xl mx-auto lg:mx-0">
            Experimentá tiempos de carga ultrarrápidos, gráficos en 4K y una
            experiencia inmersiva con el control DualSense.
            Sin lector físico. 100% digital.
          </p>

          <div className="pt-4">
            <p className="text-3xl font-bold">$ XXX.XXX</p>
            <p className="text-gray-400 text-sm">o hasta 12 cuotas sin interés</p>
          </div>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 
                             px-8 py-3 rounded-full 
                             font-medium 
                             transition-all duration-300 
                             hover:scale-105">
            Comprar ahora
          </button>

        </div>

        {/* IMAGEN */}
        <div className="flex justify-center relative">

          <div className="relative w-[280px] sm:w-[350px] lg:w-[420px] 
                          drop-shadow-[0_0_40px_rgba(26,77,255,0.4)] 
                          hover:scale-105 transition-transform duration-700">

            <Image
              src="/image/play5.png"
              alt="PlayStation 5 Digital 1TB"
              width={1500}
              height={1600}
              className="object-contain"
              priority
            />

          </div>
        </div>

      </div>
    </section>
  );
}