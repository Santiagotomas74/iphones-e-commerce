"use client";

import { useEffect, useState } from "react";

type Order = {
  address: {
    street: string;
    number: string;
    city: string;
    province: string;
    postal_code: string;
    additional_info: string;
    full_name: string;
  } | null;
  id: string;
  order_number: string;
  user_email: string;
  total_amount: number;
  order_status: string;
  delivery_type: string;
  created_at: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
};

export default function AdminShipping() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/shipping");
      const data = await res.json();
      setOrders(data.orders);
      console.log("Pedidos cargados:", data.orders[0]?.address);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);

    try {
      const res = await fetch("/api/admin/shipping/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Error actualizando");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error actualizando estado");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="p-10">Cargando pedidos...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Despachos</h1>

      {orders.length === 0 ? (
        <p>No hay pedidos aprobados.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border p-6 rounded-xl shadow bg-white space-y-4"
          >
            <div className="flex justify-between">
              <div>
                <p><strong>Orden:</strong> {order.order_number}</p>
                <p><strong>Cliente:</strong> {order.user_email}</p>
                <p><strong>Total:</strong> ${order.total_amount}</p>
                <p><strong>Tipo:</strong> {order.delivery_type}</p>
                <p><strong>Estado actual:</strong> {order.order_status}</p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

           {order.delivery_type === "pickup" && order.address && (
  
    <div className="flex gap-3">
              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, "dispatch")}
                className={`px-4 py-2 rounded-lg ${
                  order.order_status === "dispatch"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                Pendiente de retiro
              </button>


              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, "delivered")}
                className={`px-4 py-2 rounded-lg ${
                  order.order_status === "delivered"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Retirado
                
              </button>
            </div>

            
)}
              
            {order.delivery_type === "shipping" && order.address && (
  <div className="bg-gray-50 p-3 rounded">
    <p><strong>Dirección:</strong></p>
    <p>{order.address.street} {order.address.number}</p>
    <p>{order.address.city} - {order.address.province}</p>
    <p>CP: {order.address.postal_code}</p>
    {order.address.additional_info && (
      <p><em>Info adicional:</em> {order.address.additional_info}</p>
    )}
    <p><strong>Cliente:</strong> {order.address.full_name}</p>

    <div className="flex gap-3">
              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, "dispatch")}
                className={`px-4 py-2 rounded-lg ${
                  order.order_status === "dispatch"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                Pendiente
              </button>

              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, "in_transit")}
                className={`px-4 py-2 rounded-lg ${
                  order.order_status === "in_transit"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                En camino
              </button>

              <button
                disabled={updatingId === order.id}
                onClick={() => updateStatus(order.id, "delivered")}
                className={`px-4 py-2 rounded-lg ${
                  order.order_status === "delivered"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Entregado
              </button>
            </div>
  </div>
            
)}

<div className="mt-3">
  <strong>Productos:</strong>
  {order.items.map((item: any) => (
    <div key={item.product_id}>
      {item.product_name} - Cantidad: {item.quantity} - Precio unitario: ${item.unit_price} - Memoria: {item.product_memory} - Color: {item.product_color}
   
    </div>
  ))}
</div>
          </div>
        ))
      )}
    </div>
  );
}