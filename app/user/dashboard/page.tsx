"use client";

import { useEffect, useState } from "react";
import AddressCard from "./components/AddressCard";
import UserOrders from "./components/OrdersList";
import { Package, User, CreditCard, UploadCloud, CheckCircle,Loader2 } from "lucide-react";

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
<div className="min-h-screen bg-[#F8F9FB] py-12 px-4">
  <div className="max-w-6xl mx-auto space-y-8">

    {/* HEADER */}
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-red-200">
        {user?.name?.[0] || "U"}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Hola {user?.name || "Usuario"}
        </h1>
        <p className="text-gray-500">
          Bienvenido a tu panel personal
        </p>
      </div>
    </div>

    {/* GRID PRINCIPAL */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* COLUMNA IZQUIERDA */}
      <div className="space-y-8">

        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <User size={16} className="text-red-500" />
            Datos Personales
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Nombre</p>
              <p className="text-gray-800 font-semibold">
                {user?.name} {user?.lastName}
              </p>
            </div>

            <div className="pb-3 border-b border-gray-50">
              <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
              <p className="text-gray-800 font-semibold">{user?.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Teléfono</p>
              <p className="text-gray-800 font-semibold">
                {user?.phone || "-"}
              </p>
            </div>
          </div>
        </section>

        {user && (
          <AddressCard
            address={user}
            onAddressUpdated={(newAddress) =>
              setUser((prev: any) => ({
                ...prev,
                address: newAddress,
              }))
            }
          />
        )}
      </div>

      {/* COLUMNA DERECHA */}
      <div className="lg:col-span-2 space-y-8">

          <UserOrders  />

        {/* ÓRDENES */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={22} className="text-red-500" />
              Mis Órdenes
            </h2>
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
              {orders.length} pedidos
            </span>
          </div>

          <div className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 italic">
                  No tenés órdenes todavía.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-8 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase">
                        Orden #{order.order_number}
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-1">
                        ${order.total_amount}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          order.payment_status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.payment_status?.replace("_", " ") || "pendiente"}
                      </span>

                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>

                  {/* Subir comprobante */}
                  {order.payment_method === "transfer" &&
                    order.payment_status !== "approved" &&
                    !order.payment_receipt_url && (
                      <div className="mt-4">
                        {uploadingOrderId !== order.id ? (
                          <button
                            onClick={() => handleUploadClick(order.id)}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-md shadow-gray-200"
                          >
                            <UploadCloud size={18} />
                            Subir comprobante
                          </button>
                        ) : (
                          <div className="p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, order.id)
                              }
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            />

                            {uploading && (
                              <div className="flex items-center gap-2 mt-4 text-red-500">
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                                <p className="text-xs font-bold">
                                  Subiendo comprobante...
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {order.payment_receipt_url && (
                    <div className="mt-4 flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100 text-green-700">
                      <CheckCircle size={20} />
                      <div>
                        <p className="text-xs font-black uppercase">
                          Enviado correctamente
                        </p>
                        <p className="text-[11px] font-medium opacity-80 text-green-600">
                          Estamos verificando tu pago.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* HISTORIAL DE PAGOS */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CreditCard size={20} className="text-gray-400" />
            Historial de Pagos
          </h2>

          {payments.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No hay pagos registrados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:border-red-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Orden {payment.order_number}
                      </p>
                      <p className="font-bold text-gray-800">
                        ${payment.amount}
                      </p>
                    </div>

                    <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-white border border-gray-100 text-gray-400 uppercase italic">
                      {payment.provider}
                    </span>
                  </div>

                  <p
                    className={`text-[10px] mt-2 font-bold uppercase ${
                      payment.status === "approved"
                        ? "text-green-500"
                        : "text-amber-500"
                    }`}
                  >
                    ● {payment.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  </div>
</div>
  );
}

 