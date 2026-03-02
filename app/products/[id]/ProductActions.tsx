"use client";

import { ShoppingCart,Store, Truck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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


  const addToCart = async () => {
  try {
    setLoading(true);

    const sessionRes = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    if (!sessionRes.ok) {
      Swal.fire({
        icon: "info",
        text: "Debes iniciar sesión",
      });
      return false;
    }

    const sessionData = await sessionRes.json();

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: sessionData.user.email,
        productId: productId,
      }),
    });

    if (!res.ok) {
      throw new Error("Error agregando producto");
    }

    return true;

  } catch (error) {
    Swal.fire({
      icon: "error",
      text: "Hubo un problema al agregar el producto",
    });
    return false;

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mt-8 space-y-4">

      {/* 🔹 PASO 0 */}
      {step === "initial" && (
        <>
          <button
            onClick={() => setStep("delivery")}
            className="w-full bg-black text-white px-6 py-4 rounded-2xl transition-all font-semibold flex flex-col items-center justify-center shadow-lg hover:bg-neutral-900 active:scale-[0.98]"
          >
            <span className="text-lg">Comprar ahora</span>
            < span className="text-xs text-white/70 mt-1">
              Envíos rápidos · Pago seguro
            </span>
          </button>
<button
  onClick={async () => {
    const added = await addToCart(); 

    if (!added) return; 

    const result = await Swal.fire({
      icon: "success",
      title: "Producto agregado",
      confirmButtonColor: "#000",
      // confirmButtonText: "Ver carrito",
      showCancelButton: true,
      cancelButtonText: "Seguir comprando",
    });

    if (result.isConfirmed) {
      router.push("/");
    }
  }}
  disabled={loading}
  className="w-full bg-neutral-100 hover:bg-neutral-200 text-black p-3 rounded-xl transition flex items-center justify-center gap-2"
>
  <ShoppingCart size={20} />
  <span>Agregar al carrito</span>
</button>
        </>
      )}

      {/* 🔹 PASO 1 */}
        {step === "delivery" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={16} /> Volver
          </button>
          
          <h3 className="text-xl font-black text-gray-900 px-1">¿Cómo querés recibirlo?</h3>

          <div className="grid gap-3">
            <button
              onClick={() => { setDeliveryType("pickup"); setStep("payment"); }}
              className="group flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-3xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-900 rounded-2xl   transition-colors">
                  <Store size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Retiro en local</p>
                  <p className="text-xs text-gray-500">Estamos en CABA</p>
                </div>
              </div>
              <span className="font-black text-green-600 text-sm">Gratis</span>
            </button>

            <button
              onClick={() => { setDeliveryType("shipping"); setStep("address"); }}
              className="group flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-3xl  transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-900 rounded-2xl  transition-colors">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Envío a domicilio</p>
                  <p className="text-xs text-gray-500">Llega en 24-48hs</p>
                </div>
              </div>
              <span className="font-black text-gray-900 text-sm">+${shippingCost}</span>
            </button>
          </div>
        </div>
      )}

      {/* 🔹 PASO 2 - DIRECCIÓN REAL */}
      {step === "address" && (
       <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">

  <button
    onClick={handleBack}
    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition"
  >
    ← Volver
  </button>

  <div>
    <h3 className="text-xl font-semibold text-gray-900">
      Dirección de entrega
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      Completá los datos para recibir tu pedido.
    </p>
  </div>

  {/* GRID FORM */}
  <div className="space-y-4 text-black">

    <input
      placeholder="Nombre completo *"
      value={address.full_name}
      onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
    />

    <input
      placeholder="Teléfono"
      value={address.phone}
      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
    />

    <div className="grid grid-cols-3 gap-3">
      <input
        placeholder="Calle *"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        className="col-span-2 bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
      />

      <input
        placeholder="N° *"
        value={address.street_number}
        onChange={(e) => setAddress({ ...address, street_number: e.target.value })}
        className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
      />
    </div>

    <input
      placeholder="Departamento"
      value={address.apartment}
      onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
    />

    <div className="grid grid-cols-2 gap-3">
      <input
        placeholder="Ciudad *"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
      />

      <input
        placeholder="Provincia *"
        value={address.province}
        onChange={(e) => setAddress({ ...address, province: e.target.value })}
        className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
      />
    </div>

    <input
      placeholder="Código Postal *"
      value={address.postal_code}
      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition"
    />

    <textarea
      placeholder="Información adicional (opcional)"
      value={address.additional_info}
      onChange={(e) => setAddress({ ...address, additional_info: e.target.value })}
      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition resize-none"
      rows={3}
    />
  </div>

  {/* CTA */}
  <button
    onClick={() => setStep("payment")}
    className="w-full bg-black text-white py-4 rounded-2xl font-semibold shadow-lg hover:bg-neutral-900 active:scale-[0.98] transition-all"
  >
    Continuar al pago
  </button>

</div>
      )}

      {/* 🔹 PASO 3 - PAGO */}
    {step === "payment" && (
  <div className="space-y-6">
    <button
      onClick={handleBack}
      className="text-sm text-gray-500 hover:text-black"
    >
      ← Volver
    </button>

    <div className="space-y-4">

      {/* 🔵 MERCADO PAGO */}
      <div className="space-y-0">
        <button
          disabled={loading}
          onClick={() => createOrder("mercadopago")}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 py-4 rounded-t-2xl flex items-center justify-between px-5 font-semibold transition border border-gray-300 shadow-sm disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <img
              src="/image/Mercadopago.png"
              alt="Mercado Pago"
              className="h-7 w-auto"
            />
            <span>Mercado Pago</span>
          </div>

          <span className="text-xs text-gray-500">
            Tarjetas · Cuotas
          </span>
        </button>

        <div className="bg-blue-50 border border-blue-100 rounded-b-2xl px-5 py-3 text-xs text-blue-900">
          Compra protegida · Pago 100% seguro · Aprobación inmediata
        </div>
      </div>

      {/* ⚫ TRANSFERENCIA */}
      <div className="space-y-0">
        <button
          disabled={loading}
          onClick={() => createOrder("transfer")}
          className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-t-2xl flex items-center justify-between px-5 font-semibold transition border border-gray-800 disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <span>$</span>
            <span>Transferencia bancaria</span>
          </div>

          <span className="text-xs bg-green-500 px-3 py-1 rounded-full font-bold tracking-wide">
            15% OFF
          </span>
        </button>

        <div className="bg-green-50 border border-green-100 rounded-b-2xl px-5 py-3 text-xs text-green-900">
          Ahorrás pagando por transferencia · Acreditación hasta 48hs
        </div>
      </div>

    </div>
  </div>
)}
      {/* 🔹 PASO 4 */}
      {step === "transferCard" && (
        <div className="bg-white border rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in text-black">
          <h3 className="text-lg font-semibold ">
            Datos para realizar la transferencia
          </h3>

          <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2  ">
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