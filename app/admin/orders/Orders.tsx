"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (orderId: string) => {
    setValidatingId(orderId);

    try {
      const res = await fetch("/api/admin/orders/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) throw new Error("Error validando");

      // 🔥 Actualizar UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, payment_status: "approved", order_status: "dispatch" }
            : o
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error validando orden");
    } finally {
      setValidatingId(null);
    }
  };

  if (loading) return <p className="p-10">Cargando órdenes...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Órdenes Pendientes de Validación</h1>

      {orders.length === 0 ? (
        <p>No hay órdenes pendientes.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border p-6 rounded-xl shadow bg-white space-y-3"
          >
            <div className="flex justify-between">
              <div>
                <p><strong>Orden:</strong> {order.order_number}</p>
                <p><strong>Cliente:</strong> {order.user_email}</p>
                <p><strong>Total:</strong> ${order.total_amount}</p>
                <p><strong>Estado:</strong> {order.payment_status}</p>
              </div>

              {order.payment_receipt_url && (
                <a
                  href={order.payment_receipt_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Ver comprobante
                </a>
              )}
            </div>

            <button
              onClick={() => handleValidate(order.id)}
              disabled={validatingId === order.id}
              className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-80 disabled:opacity-50"
            >
              {validatingId === order.id
                ? "Validando..."
                : "Validar pago"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}