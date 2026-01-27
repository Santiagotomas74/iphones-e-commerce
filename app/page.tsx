import ProductCard from "./components/ProductCard";
import { query } from "@/db";

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
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📱 Tienda de Celulares</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
