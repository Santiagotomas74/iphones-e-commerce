export default function NewSection() {
  return (
<section className="relative w-full min-h-[600px] h-[85dvh] md:h-screen overflow-hidden bg-black">      
      <div className="absolute inset-0 z-0">
       <video
  src="https://res.cloudinary.com/ddhtkntrd/video/upload/v1772582392/ns8hy0vpkvsgxtx7vqxd.mp4"
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"
  className="absolute inset-0 w-full h-full object-cover md:object-cover object-center"
/>
       
        <div className="absolute inset-0 
                bg-gradient-to-b md:bg-gradient-to-r
                from-black/90 via-black/30 md:via-black/40 to-transparent 
                z-10" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-orange-500/20 blur-[120px] rounded-full z-0" />
      </div>

      <div className="relative z-20 h-full max-w-7xl mx-auto flex items-center">
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 w-full lg:w-1/2 text-center lg:text-left text-white">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-8 w-fit mx-auto lg:mx-0 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Nuevo Acabado Orange
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold leading-[0.9] mb-6 tracking-tighter">
            iPhone 15 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 font-bold">
              Pro Max
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-md mb-8 mx-auto lg:mx-0 font-light">
            El titanio se une al color más vibrante. 
            <span className="text-white font-medium"> Más potencia. Más carácter.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 mx-auto lg:mx-0">
            <p className="text-3xl md:text-4xl font-light">
              Desde <span className="font-bold">$1.500.000</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <button className="bg-white text-black font-bold px-10 py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 hover:bg-orange-500 hover:text-white hover:scale-105 active:scale-95">
              Comprar ahora
            </button>
            <button className="bg-transparent border border-white/30 backdrop-blur-sm text-white font-medium px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10">
              Más información
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block opacity-50">
        
      </div>

    </section>
  );
}