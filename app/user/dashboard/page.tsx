"use client";

import { useEffect, useState } from "react";
import AddressCard from "./components/AddressCard";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingAddress, setEditingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    street: "",
    altura: "",
    zip_code: "",
    city: "",
    province: "",
    address_description: "",
  });

  // 🔄 Cargar dashboard
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
        console.log("Datos del dashboard:", data.user);
        setAddressForm({
          street: data.user?.street || "",
          altura: data.user?.altura || "",
          zip_code: data.user?.zip_code || "",
          city: data.user?.city || "",
          province: data.user?.province || "",
          address_description:
            data.user?.address_description || "",
        });


      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  
  if (loading) return <p className="text-center mt-10">Cargando dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10 bg-red-400 text-white rounded shadow p-6">

      <h1 className="text-3xl font-bold">
        Hola {user?.name}, Bienvenido 👋
      </h1>

      {/* 👤 Datos personales */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Datos Personales
        </h2>
        <p>Nombre: {user?.name} {user?.lastName}</p>
        <p>Email: {user?.email}</p>
        <p>Teléfono: {user?.phone}</p>
        <p>
          Registrado el:{" "}
          {user?.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "-"}
        </p>
      </div>

    <AddressCard
  address={user}
  onAddressUpdated={(newAddress) =>
    setUser((prev: any) => ({
      ...prev,
      address: newAddress,
    }))
  }
/>

      {/* 📦 Órdenes */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Mis Órdenes
        </h2>

        {orders.length === 0 ? (
          <p>No tenés órdenes todavía.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-b py-3">
              <p>Orden #: {order.order_number}</p>
              <p>Total: ${order.total_amount}</p>
              <p>Estado: {order.payment_status}</p>
              <p>
                Fecha:{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                Expira:{" "}
                {order.expire_at
                  ? new Date(order.expire_at).toLocaleDateString()
                  : "-"}
              </p>
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
            <div key={payment.id} className="border-b py-3">
              <p>Orden: {payment.order_number}</p>
              <p>Monto: ${payment.amount}</p>
              <p>Estado: {payment.status}</p>
              <p>Proveedor: {payment.provider}</p>
              <p>
                Fecha:{" "}
                {payment.created_at
                  ? new Date(payment.created_at).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}