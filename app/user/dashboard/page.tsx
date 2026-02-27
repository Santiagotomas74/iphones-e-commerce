"use client";

import { useEffect, useState } from "react";
import AddressCard from "./components/AddressCard";
import UserOrders from "./components/OrdersList";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 🔄 Cargar dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/user/dashboard", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("No autorizado");

        const data = await res.json();

        setUser(data.user);
        setOrders(data.orders);
        setPayments(data.payments);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // 📤 Click botón subir comprobante
  const handleUploadClick = (orderId: string) => {
    setUploadingOrderId(orderId);
  };

  // 📤 Subir archivo a backend (Cloudinary)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    orderId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orderId", orderId);

      const res = await fetch("/api/order/upload-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error subiendo archivo");

      // 🔥 Actualizar orden en UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                payment_receipt_url: data.url,
                payment_status: "receipt_uploaded",
              }
            : o
        )
      );

      setUploadingOrderId(null);
    } catch (err) {
      console.error("Error subiendo comprobante:", err);
      alert("Error al subir comprobante");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Cargando dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10 bg-red-400 text-white rounded shadow p-6">
      <h1 className="text-3xl font-bold">
        Hola {user?.name}, Bienvenido 👋
      </h1>

      {/* 👤 Datos personales */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
        <p>Nombre: {user?.name} {user?.lastName}</p>
        <p>Email: {user?.email}</p>
        <p>Teléfono: {user?.phone}</p>
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
      
      <UserOrders/>

      {/* 📦 Órdenes */}
      <div className="border p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Mis Órdenes</h2>

        {orders.length === 0 ? (
          <p>No tenés órdenes todavía.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-b py-4">
              <p>Orden #: {order.order_number}</p>
              <p>Total: ${order.total_amount}</p>
              <p>Estado de pago: {order.payment_status}</p>
              <p>Método: {order.payment_method}</p>
              <p>
                Fecha:{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "-"}
              </p>

              {/* 🔥 BOTÓN SUBIR COMPROBANTE */}
              {order.payment_method === "transfer" &&
                order.payment_status !== "approved" &&
                !order.payment_receipt_url && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleUploadClick(order.id)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
                    >
                      Subir comprobante
                    </button>
                  </div>
                )}

              {/* 📂 INPUT FILE */}
              {uploadingOrderId === order.id && (
                <div className="mt-3 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, order.id)}
                    className="text-sm"
                  />
                  {uploading && (
                    <p className="text-sm">Subiendo comprobante...</p>
                  )}
                </div>
              )}

              {/* ✅ YA ENVIADO */}
              {order.payment_receipt_url && (
                <p className="text-green-300 text-sm mt-2">
                  ✅ Comprobante enviado. En revisión.
                </p>
              )}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}