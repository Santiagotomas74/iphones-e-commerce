export default function HeroIphone() {
  return (
    <section className="relative w-full min-h-[750px] flex items-center overflow-hidden bg-[#f5f5f7]">
      
      {/* Radial light effect */}
      <div className="absolute right-0 top-1/4 -translate-y-1/3 translate-x-1/10
           w-[700px] aspect-square rounded-full 
           bg-[radial-gradient(circle,rgba(160,140,255,0.75),transparent_70%)] blur-2xl">
         </div>
      
      <div className="relative px-6 lg:px-10 w-full">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center tracking-wide">
          
          {/* LEFT – TEXT */}
          <div className="max-w-xl">
            
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
              Nuevo
            </span>

            <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 leading-tight mb-6">
              iPhone 17 <br />
              <span className="font-bold">Pro Max</span>
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              Más potencia. Más carácter. Nuevo acabado Orange
            </p>

            <p className="text-2xl font-medium text-gray-900 mb-8">
              Desde $1.500.000
            </p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
              Comprar ahora
            </button>

          </div>

        </div>
      </div>

      
          {/* RIGHT – VIDEO */}
          <div className="relative flex justify-center lg:justify-end">

  {/* VIOLET LIGHT debajo del celular */}
  <div className="absolute bottom-10 w-[600px] h-[600px] rounded-full 
    bg-[radial-gradient(circle,rgba(160,140,255,0.6),transparent_70%)] 
    blur-3xl">
  </div>

  <video
    autoPlay
    loop
    muted
    playsInline
    className="relative z-10 h-[800px] lg:h-[1000px] w-auto object-contain"
  >
    <source src="/videos/17protwo.mp4" type="video/mp4" />
  </video>

</div>
          {/* RIGHT – GIF */}
          {/* <div className="relative flex justify-center mt-16 lg:mt-24">
            <div className="w-[420px] h-[420px] lg:w-[520px] lg:h-[520px] rounded-full overflow-hidden shadow-2xl bg-white">
              <img
                src="/videos/iphones-7.gif"
                alt="iPhone girando"
                className="w-full h-full object-cover"
              />
            </div>
          </div> */}
    </section>
  );
}
