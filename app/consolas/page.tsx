import PromoCard from "./PromoCard";

export default function PromoSection() {
  return (
  <section className="relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden">

    {/* --- EL GRADIENTE DE LA FOTO --- */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
  radial-gradient(
    circle at 50% 115%,
    #1a4dff 0%,
    #0a2cff 25%,
    #001a66 55%,
    #000814 80%,
    #000000 100%
  )
`
        }}
      >
        {/* Efecto de grano/ruido sutil para igualar la textura de la foto */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3钩%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Luces dinámicas suaves para dar profundidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      </div>


  {/* Contenido */}
 <div className="relative z-10 max-w-7xl mx-auto 
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                gap-6 sm:gap-8 lg:gap-10 
                mt-12 mb-12">
        
        <PromoCard
          title=""
          subtitle=""
          backgroundImage="https://i.pinimg.com/736x/68/57/4b/68574b37edc9cc9bd8586183c90ab345.jpg"
        />

        <PromoCard
          title=""
          subtitle=""
          backgroundImage="https://i.pinimg.com/1200x/ce/51/2d/ce512db0e42eaed1d5a6ff1c90bd006a.jpg"
        />

        <PromoCard
          title=""
          subtitle=""
          backgroundImage="https://i.pinimg.com/1200x/f1/35/81/f13581ba3c4d69c2ba8252190a43ff4d.jpg"
        />

      </div>
    </section>
  );
}

/*

  <section className="bg-white">
        <HeroSection/>
</section>

<div className="relative h-32 bg-white overflow-hidden">
  <div className="absolute bottom-0 w-full h-32 bg-black rounded-t-[100%]" />
</div>

<section className="bg-black py-32">
  <HeroProduct/>
</section>

<section className="bg-white">
 <HeroSection/>
</section>

<div className="relative h-40 bg-white overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-black backdrop-blur-md" />
</div>

<section className="bg-black">
   <HeroProduct/>
</section>

*/