"use client";

import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/user/dashboard", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("No autorizado");
      }

      const data = await res.json();

      setUser(data.user);
      setOrders(data.orders);
      setPayments(data.payments);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10 bg-black rounded shadow p-6">

      <h1 className="text-3xl font-bold">
        Hola {user?.name}
      </h1>

      {/* 👤 Datos personales */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Datos Personales
        </h2>
        <p>Email: {user?.email}</p>
        <p>Teléfono: {user?.phone}</p>
      </div>

      {/* 📍 Dirección */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Dirección de Envío
        </h2>
        <p>{user?.address?.street}</p>
        <p>
          {user?.address?.city} - {user?.address?.state}
        </p>
        <p>{user?.address?.zip_code}</p>
      </div>

      {/* 📦 Órdenes */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Mis Órdenes
        </h2>

        {orders.length === 0 ? (
          <p>No tenés órdenes todavía.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-b py-2">
              <p>Orden #{order.id}</p>
              <p>Total: ${order.total}</p>
              <p>Estado: {order.status}</p>
            </div>
          ))
        )}
      </div>

      {/* 💳 Pagos */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Historial de Pagos
        </h2>

        {payments.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="border-b py-2">
              <p>Monto: ${payment.amount}</p>
              <p>Estado: {payment.status}</p>
              <p>Fecha: {new Date(payment.paid_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}