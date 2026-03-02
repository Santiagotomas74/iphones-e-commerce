"use client";

import { useRouter } from "next/navigation";
// 1. Importamos Loader2 para el spinning
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import Swal from 'sweetalert2';


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
  // 2. Estado para controlar la carga del botón
  const [loading, setLoading] = useState(false);

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

  if (loading) return;

  setLoading(true);

  try {
    // 🔐 1️⃣ Verificar sesión real
    const sessionRes = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    if (!sessionRes.ok) {
      Swal.fire({
        text: "Debes iniciar sesión",
        icon: "info",
        confirmButtonText: "Ok",
      });
      return;
    }

    const sessionData = await sessionRes.json();
    console.log("Datos de sesión:", sessionData.user.email); // Verificar que el email esté presente
    const user = sessionData.user;

    // 🛒 2️⃣ Agregar producto al carrito
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante
      body: JSON.stringify({
        email: user.email, // Usamos el email del usuario autenticado
        productId: product.id,
        
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error agregando producto");
    }

    Swal.fire({
      text: "Producto agregado al carrito...",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      router.refresh(); // Refrescar para actualizar el contador del carrito
      
    }
    );

  } catch (error) {
    

    Swal.fire({
      text: error instanceof Error ? error.message : "Error agregando al carrito",
      icon: "error",
      confirmButtonText: "Ok",
    });
  } finally {
    setLoading(false);
  }
};

 return (
  <div
    onClick={goToProduct}
    className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 cursor-pointer"
  >
    <img
      src={product.image_1}
      alt={product.name}
      className="w-full h-56 object-contain"
    />

    {/* Título */}
    <h2 className="mt-4 text-black font-medium tracking-[-0.02em] text-lg">
      {product.name}
    </h2>

    {/* Subtítulo */}
    <p className="text-gray-500 text-sm mt-1 tracking-[-0.01em]">
      {product.memory} • {product.color}
    </p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-2xl font-medium text-black tracking-[-0.03em]">
          ${product.price.toLocaleString()}
        </span>

        {/* 4. Botón con condicional para el icono y deshabilitación */}
        <button
          onClick={addToCart}
          disabled={loading}
          className={`text-white p-2 rounded-xl transition flex items-center justify-center min-w-[36px] h-[36px] ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShoppingCart size={18} />
          )}
        </button>
      </div>
    </div>
  );

}
