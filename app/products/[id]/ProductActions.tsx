"use client";

import { ShoppingCart,Store, Truck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();

  const [step, setStep] = useState<
    "initial" | "delivery" | "address" | "payment" | "transferCard"
  >("initial");

  const [deliveryType, setDeliveryType] = useState<"pickup" | "shipping" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"transfer" | "mercadopago" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shippingCost = 3500;

  // 🔹 Estado dirección
  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    street: "",
    street_number: "",
    apartment: "",
    city: "",
    province: "",
    postal_code: "",
    additional_info: "",
  });

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const validateAddress = () => {
    if (
      !address.full_name ||
      !address.street ||
      !address.street_number ||
      !address.city ||
      !address.province ||
      !address.postal_code
    ) {
      alert("Completá todos los campos obligatorios");
      return false;
    }
    return true;
  };

const createOrder = async (paymentMethod: "transfer" | "mercadopago") => {
  if (!deliveryType) return;

  if (deliveryType === "shipping" && !validateAddress()) return;

  try {
    setLoading(true);

    // 🔐 1️⃣ Verificar sesión real
    const sessionRes = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    if (!sessionRes.ok) {
      alert("Debes iniciar sesión");
      return;
    }
  const sessionData = await sessionRes.json();

     // 🧾 2️⃣ Crear orden (sin enviar email)
    const res = await fetch("/api/order/buy-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: sessionData.user.email,
        product_id: productId,
        payment_method: paymentMethod,
        delivery_type: deliveryType,
        shipping_cost: deliveryType === "shipping" ? shippingCost : 0,
        address: deliveryType === "shipping" ? address : null,
      }),
    });

    const data = await res.json();
if (!res.ok) {
  throw new Error(data.error || "Error desconocido");
}
    if (paymentMethod === "mercadopago") {
      window.location.href = data.init_point;
    }

    if (paymentMethod === "transfer") {
      setOrderId(data.order_id);
      setStep("transferCard");
    }

  } catch (error: any) {
  alert(error.message);
} finally {
  setLoading(false);
}
};

  const handleBack = () => {
    if (step === "delivery") setStep("initial");
    if (step === "address") setStep("delivery");
    if (step === "payment") {
      if (deliveryType === "shipping") setStep("address");
      else setStep("delivery");
    }
    if (step === "transferCard") setStep("payment");
  };

  return (
    <div className="mt-8 space-y-4">

      {/* 🔹 PASO 0 */}
      {step === "initial" && (
        <>
          <button
            onClick={() => setStep("delivery")}
            className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition font-medium"
          >
            Comprar ahora
          </button>

          <button
            onClick={() => alert("Agregar al carrito")}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-black p-3 rounded-xl transition flex justify-center"
          >
            <ShoppingCart size={20} />
          </button>
        </>
      )}

      {/* 🔹 PASO 1 */}
      {step === "delivery" && (
        <div className="space-y-3">
          <button onClick={handleBack} className="text-sm text-gray-500 hover:text-black">
            ← Volver
          </button>

        <button
         onClick={() => {
                setDeliveryType("pickup");
                 setStep("payment");
            }}
                className="w-full bg-white text-black p-4 rounded-xl border-2 border-black font-medium flex items-center justify-center gap-3  hover:bg-black hover:text-white transition">
               <Store size={20} strokeWidth={1.5} />
                Retiro en el local <span className="text-sm opacity-70">(Gratis)</span>
             </button>
           <button
             onClick={() => {
              setDeliveryType("shipping");
              setStep("address");
            }}
           className="w-full bg-white text-black p-4 rounded-xl border-2 border-black font-medium flex items-center justify-center gap-3 hover:bg-black hover:text-white transition">
          <Truck size={20} strokeWidth={1.5} />
                 Envío a domicilio 
              <span className="text-sm opacity-70">
              (+ ${shippingCost})
              </span>
            </button>
        </div>
      )}

      {/* 🔹 PASO 2 - DIRECCIÓN REAL */}
      {step === "address" && (
        <div className="space-y-3 bg-black p-5 rounded-xl border">
          <button onClick={handleBack} className="text-sm text-gray-500 hover:text-white">
            ← Volver
          </button>

          <h3 className="font-semibold">Dirección de entrega</h3>

          <input placeholder="Nombre completo *"
            value={address.full_name}
            onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <input placeholder="Teléfono"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <div className="flex gap-2">
            <input placeholder="Calle *"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-2/3 border p-2 rounded-lg"
            />

            <input placeholder="Número *"
              value={address.street_number}
              onChange={(e) => setAddress({ ...address, street_number: e.target.value })}
              className="w-1/3 border p-2 rounded-lg"
            />
          </div>

          <input placeholder="Departamento"
            value={address.apartment}
            onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <input placeholder="Ciudad *"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <input placeholder="Provincia *"
            value={address.province}
            onChange={(e) => setAddress({ ...address, province: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <input placeholder="Código Postal *"
            value={address.postal_code}
            onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <textarea placeholder="Información adicional"
            value={address.additional_info}
            onChange={(e) => setAddress({ ...address, additional_info: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

          <button
            onClick={() => setStep("payment")}
            className="w-full bg-white text-black py-3 rounded-xl"
          >
            Continuar al pago
          </button>
        </div>
      )}

      {/* 🔹 PASO 3 - PAGO */}
      {step === "payment" && (
        <div className="space-y-3">
          <button onClick={handleBack} className="text-sm text-gray-500 hover:text-black mb-5">
            ← Volver
          </button>

       <button
           disabled={loading}
            onClick={() => createOrder("mercadopago")}
             className="w-full bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-xl flex items-center justify-center gap-3 font-semibold transition border border-gray-300 shadow-sm">
       <img
         src="/image/Mercadopago.png"
          alt="Mercado Pago"
          className="h-8 w-auto"
         />
        <span>Mercado Pago</span>
      </button>

        <button
           disabled={loading}
           onClick={() => createOrder("transfer")}
           className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition border border-gray-800"
            >
                 $ Transferencia bancaria
          </button>
        </div>
      )}

      {/* 🔹 PASO 4 */}
      {step === "transferCard" && (
        <div className="bg-white border rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in">
          <h3 className="text-lg font-semibold ">
            Datos para realizar la transferencia
          </h3>

          <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
            <p><strong>CBU:</strong> 0000003100000000000000</p>
            <p><strong>Alias:</strong> TECHSTORE.PAGOS</p>
            <p><strong>Titular:</strong> Tech Store S.A.</p>
          </div>

          <p className="text-sm text-gray-600">
            ⏳ El pago puede demorar hasta 48 hs en acreditarse.
            Luego deberás subir el comprobante desde tu panel.
          </p>

          <button
            onClick={() => router.push("/user/dashboard")}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Subir comprobante
          </button>

          <p className="text-xs text-gray-400 text-center">
            Orden #{orderId}
          </p>
        </div>
      )}
    </div>
  );
}