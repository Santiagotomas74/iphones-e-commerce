import ProductCard from "./components/ProductCard";
import { query } from "@/db";
import HeroSection from "./components/HeroSection/HeroSection";
import Footer from "./components/footer/Footer"
import ImageCarousel from "./components/Carrousel/ImageCarousel";



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

    <HeroSection />
    <ImageCarousel/>
    <main className="max-w-7xl mx-auto p-6 tracking-wide ">   
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Nuestra Coleccion</h1>
      <span
      className="block text-gray-900 text-sm tracking-wide text-center mt-5">Elegí el iPhone que se adapta a tu estilo.</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
    
    <Footer />
     </>
  );
}
