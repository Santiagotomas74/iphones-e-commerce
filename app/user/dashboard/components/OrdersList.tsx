"use client";

import { useEffect, useState } from "react";

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
      const res = await fetch("/api/user/orders");
      const data = await res.json();
      setOrders(data.orders);
      console.log("Orders fetched:", data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "dispatch":
        return "Pendiente de despacho";
      case "in_transit":
        return "En camino 🚚";
      case "delivered":
        return "Entregado ✅";
      default:
        return status;
    }
  };

  if (loading) return <p className="p-10">Cargando pedidos...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6 bg-black rounded-lg p-6">
      <h1 className="text-3xl font-bold">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <p>No tienes pedidos todavía.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-6 shadow bg-white space-y-4 bg-black"
          >
            <div className="flex justify-between bg-black">
              <div>
                <p><strong>Orden:</strong> {order.order_number}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.total_amount}</p>
              </div>

              <div className="text-right ">
                <p className="font-semibold">
                  {getStatusLabel(order.order_status)}
                </p>
              </div>
            </div>

            {/* Productos */}
            <div className=" bg-black p-3 rounded-lg">
              <strong>Productos:</strong>
              <div className="mt-2 space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.product_name} - Memoria: {item.product_memory} - Color: {item.product_color}
                    </span>
                    <span>${item.unit_price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dirección */}
            {order.delivery_type === "shipping" && order.address && (
              <div className="bg-black p-3 rounded-lg">
                <strong>Dirección de entrega:</strong>
    <p>{order.address.street} {order.address.number}</p>
    <p>{order.address.city} - {order.address.province}</p>
    <p>CP: {order.address.postal_code}</p>
    {order.address.additional_info && (
      <p><em>Info adicional:</em> {order.address.additional_info}</p>
    )}
              </div>
            )}
          </div>
          
        ))
      )}
    </div>
  );
}