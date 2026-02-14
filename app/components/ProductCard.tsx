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

  // 🔹 Función para leer cookies
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return null;
  };

  const goToProduct = () => {
    router.push(`/products/${product.id}`);
  };

  const addToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const email = getCookie("emailTech");

    if (!email) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: decodeURIComponent(email),
          productId: product.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error agregando producto");
      }

      alert("Producto agregado al carrito 🛒");
    } catch (error) {
      console.error("Error agregando al carrito:", error);
      alert("Hubo un problema al agregar el producto");
    }
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
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}
