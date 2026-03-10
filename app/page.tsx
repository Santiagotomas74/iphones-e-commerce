import ProductCard from "./components/ProductCard";
import { query } from "@/db";
import Seciones from "@/app/components/Seciones";
import { FaWhatsapp, FaChevronDown } from "react-icons/fa"; 
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
  status: "new" | "used";
};

async function getProducts(): Promise<Product[]> {
  const { rows } = await query(`
    SELECT id, name, memory, color, price, quantity, status, description, image_1, image_2, image_3
    FROM products
  `);
  return rows;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      {/* SECCIÓN HERO CON FLECHA INDICADORA */}
      <div className="relative">
        <ElegantHeroSection />
        
        {/* Flecha con animación de rebote (Solo visible en tablets y desktop) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <a 
            href="#nuestra-coleccion" 
            className="flex flex-col items-center text-gray-400 hover:text-gray-100 transition-colors duration-300 animate-bounce group"
          >
            <span className="text-xs uppercase tracking-[0.2em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Explorar
            </span>
            <FaChevronDown size={28} />
          </a>
        </div>
      </div>

      {/* Secciones de categorías/marcas */}
      <Seciones />      

      
      <main id="nuestra-coleccion" className="max-w-7xl mx-auto mt-20 tracking-wide mb-20 scroll-mt-24">
        
        {/* Encabezado de Colección */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-[-0.02em] transition-all duration-700 ease-out hover:tracking-[-0.01em]">
            Nuestra Colección
          </h1>
          <div className="mx-auto mt-4 h-[4px] w-30 bg-blue-500 hover:w-60 transition-all duration-500"></div>
          <span className="block text-gray-500 text-base mt-6 tracking-[-0.01em] transition-opacity duration-700">
            Elegí el iPhone que se adapta a tu estilo.
          </span>
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Encabezado de Accesorios */}
        <div className="text-center mb-14 mt-20">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-[-0.02em] transition-all duration-700 ease-out hover:tracking-[-0.01em]">
            Accesorios originales
          </h1>
          <div className="mx-auto mt-4 h-[4px] w-30 bg-blue-500 hover:w-60 transition-all duration-500"></div>
        </div>

        {/* Grilla de Accesorios/Promos */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 sm:gap-8 lg:gap-10 mt-12 mb-12">
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
            title="Apple Watch"
            subtitle="Series 11"
            backgroundImage="https://i.pinimg.com/736x/cc/00/90/cc00909e143d7b0dc3029b048c6fc794.jpg"
          />
        </div>
      </main>

      {/* BOTÓN WHATSAPP FIJO */}
      <a
        href="https://wa.me/549XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg transition-all z-50 flex items-center justify-center group hover:scale-110"
      >
        <FaWhatsapp size={32} className="md:w-10 md:h-10" />
        <span className="absolute right-20 bg-white text-black text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md whitespace-nowrap hidden md:block">
          ¡Chatea con nosotros!
        </span>
      </a>
    </>
  );
}