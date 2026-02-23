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

    // Si ya está cargando, evitamos clicks dobles
    if (loading) return;

    const email = getCookie("emailTech");

    if (!email) {
      Swal.fire({
        text: 'Debes iniciar sesión',
        icon: 'info', // Cambiado a info para ser más preciso
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Inicia la carga
    setLoading(true);

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

      Swal.fire({
        text: 'Producto agregado al carrito...',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

    } catch (error) {
      console.error("Error agregando al carrito:", error);
      Swal.fire({
        text: 'Hubo un problema al agregar el producto...',
        icon: 'error', // Cambiado a error para feedback visual correcto
        confirmButtonText: 'Ok'
      });
    } finally {
      // 3. Finaliza la carga pase lo que pase
      setLoading(false);
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

      <h2 className="font-semibold mt-3 text-gray-700">{product.name}</h2>

      <p className="text-gray-500 text-sm">
        {product.memory} • {product.color}
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xl font-bold text-gray-700">
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