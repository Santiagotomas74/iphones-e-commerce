import ProductCard from "./components/ProductCard";
import { query } from "@/db";
import Seciones from "@/app/consolas/Seciones";
import RevealFromBottom from "./components/RevealFromBottom";
import {FaWhatsapp} from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  memory: string;
  color: string;
  price: number;
  quantity: number;
  description: string;
  image_1: string;
};

async function getProducts(): Promise<Product[]> {
  const { rows } = await query(`
    SELECT id, name, memory, color, price, quantity, description, image_1
    FROM products
  `);

  return rows;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Seciones />

      <RevealFromBottom>
        <main className="max-w-7xl mx-auto p-6 tracking-wide mt-10 mb-20">
          <h1 className="text-4xl md:text-5xl font-medium mb-6 text-center text-gray-900 tracking-[-0.02em]">
  Nuestra Colección
</h1>

<span className="block text-gray-500 text-ml text-center mt-3 tracking-[-0.01em]">
  Elegí el iPhone que se adapta a tu estilo.
</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </RevealFromBottom>
      <a
  href="https://wa.me/549XXXXXXXXXX?text=Hola!%20Quiero%20consultar%20por%20un%20iPhone"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-10 right-10 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 text-2xl"
>
  <FaWhatsapp  size={40}/>
</a>

      
    </>
    
  );
}