import ProductCard from "./components/ProductCard";
import { query } from "@/db";
import Seciones from "@/app/components/Seciones";
import {FaWhatsapp} from "react-icons/fa";
import NewSection from "./components/NewSection/NewSection";
import FadeInSection from "./components/FadeInSection";
import PromoCard from "./consolas/PromoCard";
import ElegantHeroSection from "./components/ElegantHeroSection";


type Product = {
  id: string;
  name: string;
  memory: string;
  color: string;
  price: number;
  quantity: number;
  description: string;
  image_1: string;
  image_2: string;
  image_3: string;
};

async function getProducts(): Promise<Product[]> {
  const { rows } = await query(`
    SELECT id, name, memory, color, price, quantity, description, image_1, image_2, image_3
    FROM products
  `);

  return rows;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
     
      <ElegantHeroSection />
     
        <Seciones />
       
        <main className="max-w-7xl mx-auto mt-20 tracking-wide  mb-20">
        <div className="text-center mb-14">

       <h1
    className="text-4xl md:text-5xl font-medium text-gray-900
               tracking-[-0.02em]
               transition-all duration-700 ease-out
               hover:tracking-[-0.01em]"
  >
    Nuestra Colección
  </h1>
  <div className="mx-auto mt-4 h-[4px] w-30 bg-blue-500 hover:w-60
                  transition-all duration-500
                  ">

                  </div>

  <span
    className="block text-gray-500 text-base mt-6
               tracking-[-0.01em]
               transition-opacity duration-700"
  >
    Elegí el iPhone que se adapta a tu estilo.
  </span>

</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

            <div className="text-center mb-14 mt-20">

  <h1
    className="text-4xl md:text-5xl font-medium text-gray-900
               tracking-[-0.02em]
               transition-all duration-700 ease-out
               hover:tracking-[-0.01em]"
  >
    Acessorios originales
  </h1>
  <div className="mx-auto mt-4 h-[4px] w-30 bg-blue-500 hover:w-60
                  transition-all duration-500
                  ">

                  </div>



</div>

          {/* Contenido */}
           <div className="relative z-10 max-w-7xl mx-auto 
                          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                          gap-6 sm:gap-8 lg:gap-10 
                          mt-12 mb-12">

                  
                  <PromoCard
                    title="Cargador Magnetic"
                    subtitle="Original"
                    backgroundImage="/image/charger.png"
                  />
          
                  <PromoCard
                    title="Apple AirPods"
                    subtitle="Pro 2"
                    backgroundImage="https://i.pinimg.com/1200x/52/ce/99/52ce99b8df2adf77f55ff42f18adc069.jpg"
                  />
          
                  <PromoCard
                    title="Apple Watch  "
                    subtitle="Series 11"
                    backgroundImage="https://i.pinimg.com/736x/cc/00/90/cc00909e143d7b0dc3029b048c6fc794.jpg"
                  />
          
                </div>
        </main>
        
      
 <a
  href="https://wa.me/549XXXXXXXXXX"
  target="_blank"
  rel="noopener noreferrer"

  className="absolute bottom-4 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg transition-all z-10 flex items-center justify-center group"
>
  <FaWhatsapp size={32} className="md:w-10 md:h-10" />
  
  <span className="absolute right-20 bg-white text-black text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md whitespace-nowrap hidden md:block">
    ¡Chatea con nosotros!
  </span>
</a>
    
 </>
    
  );
}