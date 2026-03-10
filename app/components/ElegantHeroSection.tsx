import {FaChevronDown } from "react-icons/fa"; 


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
   <div className="absolute top-1/5 sm:top-12 left-1/2 -translate-x-1/2 text-center flex flex-col items-center max-w-2xl">

  {/* Parte superior */}
<div className="flex flex-col items-center justify-center text-center px-4">

  <h2 className="
    text-sm
    sm:text-base
    tracking-[0.25em]
    uppercase
    text-gray-400
    mb-3
  ">
    Tecnología de nueva generación
  </h2>

  <h1 className="
    text-6xl
    sm:text-8xl
    font-extrabold
    tracking-tight
    leading-[0.95]
  ">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 drop-shadow-[0_0_20px_rgba(255,140,0,0.35)]">
      TechStore
    </span>
  </h1>

</div>
 


</div>
     </div>
    </section>
  );
}