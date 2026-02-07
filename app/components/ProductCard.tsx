"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

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

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const goToProduct = () => {
    router.push(`/products/${product.id}`);
  };

  const addToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // MUY IMPORTANTE
    console.log("Agregar al carrito", product);
      
    await fetch("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({
      userId: "7b263d9e-3242-44e4-bc3a-a2b7d80ff46b",
      productId: product.id,
    }),
  });

  alert("Producto agregado al carrito");
  };

  return (
    <div
      onClick={goToProduct}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 cursor-pointer"
    >
      <img
        src={product.image_1}
        alt={product.name}
        className="w-full h-56 object-contain"
      />

      <h2 className="font-semibold mt-3">{product.name}</h2>
      <p className="text-gray-500 text-sm">
        {product.memory} • {product.color}
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xl font-bold">
          ${product.price.toLocaleString()}
        </span>

        <button
          onClick={addToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}
