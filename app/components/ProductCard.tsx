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
  image_2: string;
  image_3: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  // 2. Estado para controlar la carga del botón
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
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
  try {
  // 1️⃣ verificar sesión
  let sessionRes = await fetch("/api/me", {
    method: "GET",
    credentials: "include",
  });

  let data = await sessionRes.json();

  // 2️⃣ si el token expiró → refrescar
  if (sessionRes.status === 401 && data.error === "TokenExpired") {

    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Refresh failed");
    }

    // 3️⃣ volver a intentar /api/me
    sessionRes = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    data = await sessionRes.json();
  }

  // 4️⃣ si sigue fallando → usuario no logueado
  if (!sessionRes.ok) {
    Swal.fire({
      text: "Debes iniciar sesión",
      icon: "info",
      confirmButtonText: "Ok",
    });
    return;
  }

  // 5️⃣ usuario válido
  console.log("User:", data.user);
  console.log("Datos de sesión:", data.user.email); // Verificar que el email esté presente
  setUser({ email: data.user.email });


} catch (error) {
  console.error("Auth error:", error);
}

    
    // 🛒 2️⃣ Agregar producto al carrito
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante
      body: JSON.stringify({
        email: user?.email, // Usamos el email del usuario autenticado
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
  className="group relative bg-white rounded-3xl
             border border-gray-100
             shadow-sm
             transition-all duration-500 ease-out
             hover:shadow-xl hover:-translate-y-2
             p-7 cursor-pointer"
>
  {/* Imagen */}
<div className="relative h-56 overflow-hidden rounded-2xl group">

  {/* Imagen 1 */}
  <img
    src={product.image_1}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-contain
               transition-opacity duration-500 ease-in-out
               group-hover:opacity-0"
  />

  {/* Imagen 2 */}
  <img
    src={product.image_2}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-contain
               opacity-0
               transition-opacity duration-500 ease-in-out
               group-hover:opacity-100"
  />

  {/* Cortina */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-black
                    -translate-x-[110%]
                    group-hover:translate-x-[110%]
                    transition-transform duration-700 ease-in-out
                    will-change-transform">
    </div>
  </div>

</div>

  {/* Título */}
  <h2 className="mt-6 text-black font-medium tracking-[-0.02em] text-lg">
    {product.name}
  </h2>

  {/* Subtítulo */}
  <p className="text-gray-500 text-sm mt-1 tracking-[-0.01em]">
    {product.memory} • {product.color}
  </p>

  {/* Precio + botón */}
  <div className="flex items-center justify-between mt-5">
    <span className="text-2xl font-semibold text-black tracking-[-0.03em]">
      ${product.price.toLocaleString()}
    </span>

    <button
      onClick={addToCart}
      disabled={loading}
      className={`relative text-white rounded-xl
                  transition-all duration-300
                  flex items-center justify-center
                  w-10 h-10
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                  }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <ShoppingCart size={18} />
      )}
    </button>
  </div>

  {/* Glow sutil al hover */}
  <div className="absolute inset-0 rounded-3xl opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-500
                  pointer-events-none
                  bg-gradient-to-tr from-blue-50/40 to-transparent">
  </div>
</div>
  );

}

    