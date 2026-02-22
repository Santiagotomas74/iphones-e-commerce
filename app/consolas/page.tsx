import HeroProduct from "@/app/components/HeroProduct/HeroProduct";
import HeroSection from "@/app/components/HeroSection/HeroSection"
import Seciones from "./Seciones"

export default function HomePage() {
  return (
    <main>
    <Seciones/>
    </main>
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