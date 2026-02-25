"use client";

import { X, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  product_id: string;
  name: string;
  memory: string;
  color: string;
  price: number;
  quantity: number;
  image_1: string;
}


export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
const [selectedPayment, setSelectedPayment] = useState<"transfer" | "mercadopago" | null>(null);
console.log("Selected payment method:", selectedPayment);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Función para leer cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchCart = async () => {
      const email = getCookie("emailTech");

      if (!email) {
        setCartItems([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        console.log("Carrito obtenido:", data);

        if (res.ok) {
          setCartItems(data.items);
        }
      } catch (error) {
        console.error("Error cargando carrito:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isOpen]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const removeItem = async (product_id: string) => {
  const email = getCookie("emailTech");
  

  if (!email) return;

  try {
    const res = await fetch("/api/cart/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, product_id }),
    });

    if (res.ok) {
      // 🔥 Actualizamos estado sin volver a pedir todo
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    }
  } catch (error) {
    console.error("Error eliminando producto:", error);
  }
};

const checkAddressAndContinue = async () => {
  try {
    const res = await fetch("/api/user/has-address");
    const data = await res.json();

    if (!res.ok || !data.hasAddress) {
      alert("Debes completar tu dirección antes de continuar.");
      window.location.href = "/user/dashboard"; // o donde edite dirección
      return;
    }

    // ✅ Si tiene dirección, mostramos métodos de pago
    setShowPaymentMethods(true);

  } catch (error) {
    console.error("Error verificando dirección:", error);
  }
};

const handleCheckout = async () => {
  if (!selectedPayment) return;

  const email = getCookie("emailTech");
  if (!email) return;

  try {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        payment_method: selectedPayment,
      }),
    });

    const data = await res.json();

    if (selectedPayment === "mercadopago") {
      window.location.href = data.init_point; // redirige a MP
    }

    if (selectedPayment === "transfer") {
      window.location.href = `/order/${data.order_id}`;
    }

  } catch (error) {
    console.error("Error iniciando checkout:", error);
  }
};


  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[45%] bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center gap-2 text-gray-600">
            <ShoppingBag size={20} />
            <h2 className="text-xl font-semibold text-gray-600 ">Tu Carrito</h2>
          </div>

          <button onClick={onClose}
          className="text-gray-900">
            
            <X size={25} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 flex flex-col h-[85%]">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">
              Cargando carrito...
            </p>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={60} className="text-gray-300 mb-4" />
              <p className="text-gray-800 mb-6">
                Tu carrito está vacío
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
             {cartItems.map((item) => (
  <div
    key={item.product_id}
    className="bg-gray-100 rounded-2xl p-4 flex gap-4 items-start"
  >
    {/* Imagen */}
    <img
      src={item.image_1}
      alt={item.name}
      className="w-30 h-30 rounded-xl object-cover"
    />

    {/* Info */}
    <div className="flex-1">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-base text-gray-800">
            {item.name}
          </p>
          <p className="text-sm text-gray-500">
            {/* si tienes variante puedes ponerla aquí */}
            {item.memory} {item.color}
          </p>
        </div>

        <button
  onClick={() => removeItem(item.product_id)}
  className="text-gray-400 hover:text-red-600 transition"
>
  <X size={16} />
</button>

      </div>

      {/* Controles cantidad */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center bg-white rounded-xl px-3 py-1 gap-3 shadow-sm text-gray-800">
          <button className="text-lg">−</button>
          <span>{item.quantity}</span>
          <button className="text-lg">+</button>
        </div>

        <p className="font-semibold text-base text-gray-800">
          ${(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
))}

              </div>

              {/* Subtotal */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-gray-400">Subtotal</span>
                  <span className="font-semibold text-lg text-gray-800">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

{/* desplegable de metodos de pago*/}
              {showPaymentMethods && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[90%] md:w-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Seleccioná método de pago
      </h3>

      <div className="space-y-3">
        <button
          onClick={() => setSelectedPayment("transfer")}
          className={`w-full border rounded-xl py-3 text-gray-800  ${
            selectedPayment === "transfer"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300"
          }`}
        >
          Transferencia bancaria (10% OFF)
        </button>

        <button
          onClick={() => setSelectedPayment("mercadopago")}
          className={`w-full border rounded-xl py-3 text-gray-800 ${
            selectedPayment === "mercadopago"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300"
          }`}
        >
          Pagar con Mercado Pago
        </button>
      </div>

      <button
        disabled={!selectedPayment}
        className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 disabled:opacity-50"
        onClick={handleCheckout}
      >
        Confirmar pago
      </button>

      <button
        onClick={() => setShowPaymentMethods(false)}
        className="w-full mt-3 text-sm text-gray-800"
      >
        Cancelar
      </button>
    </div>
  </div>
)}

              <button
  onClick={checkAddressAndContinue}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
>
  Ir a pagar
</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
