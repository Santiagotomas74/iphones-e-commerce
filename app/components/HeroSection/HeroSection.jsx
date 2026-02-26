export default function HeroIphone() {
  return (
    <section className="relative mt-0 px-2 sm:px-8 lg:px-16 w-full flex-1">
      
      {/* Radial light effect */}
      <div className=" hidden sm:block absolute right-0 top-1/4 -translate-y-1/3 
           w-[400px] sm:w-[500px] md:w-[600px] lg:w-[700px] aspect-square rounded-full 
           bg-[radial-gradient(circle,rgba(160,140,255,0.75),transparent_70%)] blur-2xl">
      </div>
      
      <div className="relative mt-6 sm:mt-0 px-2 sm:px-8 lg:px-16 w-full flex-1">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center tracking-wide ">
          
          {/* LEFT – TEXT */}
          <div className="max-w-xl mx-auto lg:mx-30 text-center lg:text-left">
            
            <span className="inline-block bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium px-3 py-1 rounded-full mb-4 sm:mb-6">
              Nuevo
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-tight mb-4 sm:mb-6">
              iPhone 15 <br />
              <span className="font-bold">Pro Max</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-4 sm:mb-6">
              Más potencia. Más carácter. Nuevo acabado Orange
            </p>

            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-6 sm:mb-8">
              Desde $1.500.000
            </p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
              Comprar ahora
            </button>

          </div>

          {/* RIGHT – VIDEO */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            {/* VIOLET LIGHT debajo del celular */}
            <div className="absolute bottom-10 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-full 
              bg-[radial-gradient(circle,rgba(160,140,255,0.6),transparent_70%)] 
              blur-3xl">
            </div>

            <video
              autoPlay
              loop
              muted
              playsInline
              className="relative z-10 h-[400px] sm:h-[600px] md:h-[800px] lg:h-[1000px] w-auto object-contain"
            >
              <source src="/videos/17protwo.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </div>

    </section>
  );
}