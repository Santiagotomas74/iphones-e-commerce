"use client";

import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";

type Order = {
  id: string;
  order_number: string;
  total_amount: number;
  order_status: string;
  delivery_type: string;
  created_at: string;
  address: any;
  items: any[];
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      let res = await fetch("/api/user/orders");

      if (res.status === 401) {
        const refresh = await fetch("/api/refresh", { method: "POST" });

        if (refresh.ok) {
          res = await fetch("/api/user/orders");
        } else {
          window.location.href = "/login";
          return;
        }
      }

      if (!res.ok) throw new Error("Error al obtener pedidos");

      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "dispatch":
        return "bg-amber-100 text-amber-700";
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "dispatch":
        return "Pendiente de despacho";
      case "in_transit":
        return "En camino";
      case "delivered":
        return "Entregado";
      default:
        return status;
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
        <p className="text-sm font-medium animate-pulse">
          Cargando pedidos...
        </p>
      </div>
    );

  return (
    <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="p-8 border-b border-gray-50 flex items-center gap-2">
        <Package size={22} className="text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">
          Mis Pedidos
        </h2>
      </div>

      <div className="divide-y divide-gray-50">

        {orders.length === 0 && (
          <div className="p-16 text-center">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">
              No tienes pedidos todavía
            </p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="p-8 space-y-6">

            {/* HEADER ORDEN */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

              <div>
                <p className="text-xs font-black text-gray-400 uppercase">
                  Orden #{order.order_number}
                </p>

                <p className="text-2xl font-black text-gray-900 mt-1">
                  ${order.total_amount}
                </p>

                <p className="text-xs text-gray-400 font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${getStatusStyle(
                  order.order_status
                )}`}
              >
                {getStatusLabel(order.order_status)}
              </span>
            </div>

            {/* PRODUCTOS */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">

              <p className="text-xs font-black text-gray-400 uppercase mb-4">
                Productos
              </p>

              <div className="space-y-3">

                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="text-gray-700 font-medium">
                      {item.product_name}
                      <p className="text-xs text-gray-400">
                        {item.product_memory} · {item.product_color}
                      </p>
                    </div>

                    <span className="font-semibold text-gray-900">
                      ${(item.unit_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

              </div>
            </div>

            {/* DIRECCIÓN */}
            {order.delivery_type === "shipping" && order.address && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">

                <p className="text-xs font-black text-gray-400 uppercase mb-2">
                  Dirección de entrega
                </p>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    {order.address.street} {order.address.number}
                  </p>
                  <p>
                    {order.address.city} · {order.address.province}
                  </p>
                  <p>CP: {order.address.postal_code}</p>

                  {order.address.additional_info && (
                    <p className="text-xs text-gray-400 italic">
                      {order.address.additional_info}
                    </p>
                  )}
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}