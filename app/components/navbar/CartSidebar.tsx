"use client";

import { X, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";


interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
}

interface CartItem {
  product_id: string;
  name: string;
  memory: string;
  color: string;
  price: number;
  quantity: number;
  image_1: string;
  stock: number;
}

export default function CartSidebar({ isOpen, onClose, count }: CartSidebarProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

const [checkoutStep, setCheckoutStep] = useState<
  "delivery" | "address" | "payment" | "transferCard" | null
>(null);

  const [deliveryType, setDeliveryType] = useState<"pickup" | "shipping" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"transfer" | "mercadopago" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const shippingCost = 3500;

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

  useEffect(() => {
    if (!isOpen) return;

    const fetchCart = async () => {


      try {
        setLoading(true);
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



        const res = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({  email: sessionData.user.email }), // Usamos el email del usuario autenticado
        });

        const data = await res.json();
        if (res.ok) setCartItems(data.items);

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

  const total =
    deliveryType === "shipping"
      ? subtotal + shippingCost
      : subtotal;

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
  
//actualizar cantidad en carrito
const updateQuantity = async (productId: string, newQuantity: number) => {
  if (newQuantity < 1) return;

  const previousCart = [...cartItems];

  setUpdatingId(productId);

  // Optimistic UI
  setCartItems((prev) =>
    prev.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    )
  );

  try {
    const res = await fetch("/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        quantity: newQuantity,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }
    router.refresh(); // Refrescar para actualizar el contador del carrito

  } catch (error: any) {
    setCartItems(previousCart); // rollback
    alert(error.message);
  } finally {
    setUpdatingId(null);
  }
};
 const removeItem = async (product_id: string) => {

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

    const res = await fetch("/api/cart/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: sessionData.user.email, product_id }),
    });

    if (res.ok) {
      // 🔥 Actualizamos estado sin volver a pedir todo
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    }
    router.refresh(); // Refrescar para actualizar el contador del carrito
  } catch (error) {
    console.error("Error eliminando producto:", error);
  }
};
  const handleCheckout = async (paymentMethod: "transfer" | "mercadopago") => {
  if (loading) return;

    

    if (deliveryType === "shipping" && !validateAddress()) return;

    try {
      setLoading(true);
    
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


      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionData.user.email,
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
  setCheckoutStep("transferCard");
  return;
}

    }  catch (error: any) {
  alert(error.message);
}finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[45%] bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <div className="flex items-center gap-2 text-gray-700">
            <ShoppingBag size={20} />
            <h2 className="text-xl font-semibold">Tu Carrito</h2> 
            <span className="bg-blue-500 text-white text-xl px-2 py-1 rounded-md ml-2">
              {count}
            </span>
          </div>
         <button
  onClick={() => {
    setCheckoutStep(null);
    onClose();
  }}
  className="text-gray-400 hover:text-gray-600 transition"
>
  <X  size={22} />
</button>
        </div>

        <div className="p-6 flex flex-col h-[85%]">

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
              <p>Tu carrito está vacío</p>
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

    <button
      className="text-lg disabled:opacity-40"
      onClick={() =>
        updateQuantity(item.product_id, item.quantity - 1)
      }
      disabled={item.quantity <= 1 || updatingId === item.product_id}
    >
      −
    </button>

    {updatingId === item.product_id ? (
      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      <span>{item.quantity}</span>
    )}

    <button
      className="text-lg disabled:opacity-40"
      onClick={() =>
        updateQuantity(item.product_id, item.quantity + 1)
      }
      disabled={updatingId === item.product_id}
    >
      +
    </button>

  </div>

  <p className="font-semibold text-base text-gray-800">
    ${(item.price * item.quantity).toLocaleString()}
  </p>
</div>
    </div>
  </div>
))}

              </div>
              <div className="border-t pt-4 mt-4 space-y-4">

                {/* Subtotal */}
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>

                {/* Flujo checkout */}
                {!checkoutStep && (
                  <button
                    onClick={() => setCheckoutStep("delivery")}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl"
                  >
                    Ir a pagar
                  </button>
                )}

                {checkoutStep === "delivery" && (
                  <div className="space-y-3 fade-step">
                    <button
                   onClick={() => setCheckoutStep(null)}
                   className="text-sm text-gray-700"
                    >
                   ← Volver
                   </button>
                    <button
                      onClick={() => {
                        setDeliveryType("pickup");
                        setCheckoutStep("payment");
                      }}
                      className="w-full bg-black text-white py-3 rounded-xl"
                    >
                      Retiro en local
                    </button>

                    <button
                      onClick={() => {
                        setDeliveryType("shipping");
                        setCheckoutStep("address");
                      }}
                      className="w-full bg-black text-white py-3 rounded-xl"
                    >
                      Envío a domicilio (+ ${shippingCost})
                    </button>
                  </div>
                )}
                {checkoutStep === "address" && (
              <div className="space-y-3 fade-step bg-black" >
              <button
                onClick={() => setCheckoutStep("delivery")}
                className="text-sm text-white text-gray-700"
                    >
                 ← Volver
              </button>
               <input
                 type="text"
                 placeholder="Nombre completo"
                 value={address.full_name}
                 onChange={(e) =>
                  setAddress({ ...address, full_name: e.target.value })
              }
                   className="w-full border rounded-xl p-3"
               />

               <input
                 type="text"
                 placeholder="Teléfono"
                 value={address.phone}
                 onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
              }
                   className="w-full border rounded-xl p-3"
            />

               <input
                  type="text"
                  placeholder="Calle"
                  value={address.street}
                  onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
               }
               className="w-full border rounded-xl p-3"
             />

            <input
              type="text"
              placeholder="Número"
              value={address.street_number}
              onChange={(e) =>
                setAddress({ ...address, street_number: e.target.value })
      }
               className="w-full border rounded-xl p-3"
               />
              <input placeholder="Departamento"
                   value={address.apartment}
                   onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                   className="w-full border p-2 rounded-lg"
               />
            <input
                type="text"
                placeholder="Ciudad"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
      }
                  className="w-full border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="Provincia"
      value={address.province}
      onChange={(e) =>
        setAddress({ ...address, province: e.target.value })
      }
      className="w-full border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="Código Postal"
      value={address.postal_code}
      onChange={(e) =>
        setAddress({ ...address, postal_code: e.target.value })
      }
      className="w-full border rounded-xl p-3"
    />
     <textarea placeholder="Información adicional"
            value={address.additional_info}
            onChange={(e) => setAddress({ ...address, additional_info: e.target.value })}
            className="w-full border p-2 rounded-lg"
          />

    <button
      onClick={() => setCheckoutStep("payment")}
      className="w-full bg-blue-600 text-white py-3 rounded-xl"
    >
      Continuar al pago
    </button>

  </div>
)}

                {checkoutStep === "payment" && (
                  <div className="space-y-3 fade-step">
                    <button
  onClick={() => setCheckoutStep("delivery")}
  className="text-sm text-gray-700"
>
  ← Volver
</button>
                    {/* Total dinámico */}
                    <div className="bg-neutral-100 p-3 rounded-xl text-sm">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-semibold">
                          ${total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={loading}
                     onClick={() => handleCheckout("mercadopago")}
                      className="w-full bg-blue-500 text-white py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Mercado Pago"
                      )}
                    </button>

                    <button
                      disabled={loading}
                     onClick={() => handleCheckout("transfer")}
                      className="w-full bg-blue-600 text- py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Transferencia"
                      )}
                    </button>
                  </div>
                )}

                {checkoutStep === "transferCard" && orderId && (
  <div className="bg-white border rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in">
    
    <h3 className="text-lg font-semibold text-black ">
      Datos para realizar la transferencia
    </h3>

    <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
      <p><strong>CBU:</strong> 0000003100000000000000</p>
      <p><strong>Alias:</strong> TECHSTORE.PAGOS</p>
      <p><strong>Titular:</strong> Tech Store S.A.</p>
    </div>
    
    <p className="text-sm text-gray-900">
      El total que deberás transferir es exactamente <strong>${total.toLocaleString()}</strong> para que podamos identificar tu pago.
    </p>
    
     <p className="text-sm text-gray-900">
   Tiene 2 horas para subir el comprobante de la transferencia. Pasado ese tiempo, la orden se cancelará automáticamente y el stock se liberará.
    </p>
   <p className="text-sm text-gray-900">
      ⏳ El pago puede demorar hasta 48 hs en acreditarse.
    </p>

    <button
      onClick={() => window.location.href = "/user/dashboard"}
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
            </>
          )}
        </div>
      </div>
    </>
  );
}