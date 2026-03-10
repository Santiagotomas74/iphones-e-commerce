export default function IphoneHeroElegant() {
  return (
    <section className="relative w-full overflow-hidden lg:h-[90vh] h-[75vh] bg-black">
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
      <div className="absolute inset-0 bg-black/10 lg:bg-black/40" />
      <div
        className="
          relative z-10
          flex flex-col
          items-center
          justify-center
          text-center
          px-6
          h-full
          min-h-[75vh]
        "
      >
     <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center flex flex-col items-center">
  <h2 className="text-lg sm:text-2xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-100 mb-3">
    Bienvenido al    
    <span className="text-orange-600 not-italic ml-2 drop-shadow-[0_0_8px_rgba(234,88,12,0.4)]">
      SIGUIENTE NIVEL
    </span>
  </h2>
  <h1 className="text-5xl sm:text-8xl font-black uppercase tracking-tight leading-[0.9]">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 ">
      TechStore
    </span>
  </h1>
  <p className="mt-6 text-gray-300 text-sm sm:text-lg max-w-md border-l-2 border-orange-600 pl-4 text-left">
    Potencia redefinida. Diseño impecable. <br />
    La experiencia más avanzada jamás creada.
  </p>
</div>
     </div>
    </section>
  );
}