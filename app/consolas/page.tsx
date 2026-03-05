import PromoSection from "./PromoSection";
import PS5HeroBanner from "./PS5HeroBanner";
import PromoSectionTopGlow from "./SectionTopGlow";

export default function PageConsola() {
  return (
    <div className="bg-black">
      <PS5HeroBanner backgroundImage="https://i.pinimg.com/1200x/3d/60/cb/3d60cbaf1a8349ed22d1c6a74ca22971.jpg" />
      <PromoSection />
      <PromoSectionTopGlow />
      
    </div>
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