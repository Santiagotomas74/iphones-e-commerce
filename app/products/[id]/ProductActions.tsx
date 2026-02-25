"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductActions({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [showMethods, setShowMethods] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return null;
  };

  // 🔎 Verificar dirección antes de comprar
  const verifyAddress = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/user/has-address", {
        credentials: "include",
      });

      if (!res.ok) return false;

      const data = await res.json();

      if (!data.hasAddress) {
        alert("Debes completar tu dirección antes de comprar.");
        router.push("/user/dashboard");
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const addToCart = async () => {
    const email = getCookie("emailTech");

    if (!email) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decodeURIComponent(email),
          productId,
        }),
      });

      alert("Producto agregado al carrito 🛒");
    } catch {
      alert("Error agregando producto");
    }
  };

  const createOrder = async (method: "transfer" | "mercadopago") => {
    const email = getCookie("emailTech");

    if (!email) {
      alert("Debes iniciar sesión");
      return;
    }

    const hasAddress = await verifyAddress();
    if (!hasAddress) return;

    try {
      setLoading(true);

      const res = await fetch("/api/order/buy-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: decodeURIComponent(email),
          product_id: productId,
          payment_method: method,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      if (method === "mercadopago") {
        window.location.href = data.init_point;
      }

      if (method === "transfer") {
        alert("Orden creada ✅ Te enviaremos los datos de transferencia por email.");
      }

    } catch {
      alert("Error creando la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <button
        onClick={() => setShowMethods(true)}
        className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition font-medium"
      >
        Comprar ahora
      </button>

      {showMethods && (
        <div className="flex gap-3 animate-fade-in">
          <button
            disabled={loading}
            onClick={() => createOrder("mercadopago")}
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition"
          >
            Mercado Pago
          </button>

          <button
            disabled={loading}
            onClick={() => createOrder("transfer")}
            className="flex-1 bg-neutral-200 text-black px-4 py-3 rounded-xl hover:bg-neutral-300 transition"
          >
            Transferencia
          </button>
        </div>
      )}

      <button
        onClick={addToCart}
        className="w-full bg-neutral-100 hover:bg-neutral-200 text-black p-3 rounded-xl transition flex justify-center"
      >
        <ShoppingCart size={20} />
      </button>
    </div>
  );
}