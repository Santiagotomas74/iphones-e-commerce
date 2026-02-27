"use client";

import { useEffect, useState } from "react";

export default function AdminFinance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      const res = await fetch("/api/admin/finance");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10">Cargando ingresos...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Panel de Ingresos</h1>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Órdenes</p>
          <p className="text-2xl font-bold">
            {data.summary.total_orders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Ingresos Totales</p>
          <p className="text-2xl font-bold">
            ${Number(data.summary.total_revenue).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Historial mensual */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Ingresos por Mes
        </h2>

        {data.monthly.map((m: any, index: number) => (
          <div
            key={index}
            className="flex justify-between border-b py-2"
          >
            <span>{m.month}</span>
            <span>
              ${Number(m.revenue).toLocaleString()} ({m.orders} órdenes)
            </span>
          </div>
        ))}
      </div>

      {/* Historial de pagos */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Historial de Pagos Aprobados
        </h2>

        {data.orders.map((order: any) => (
          <div
            key={order.id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <p className="font-semibold">
                {order.order_number}
              </p>
              <p className="text-sm text-gray-500">
                {order.user_email}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ${Number(order.total_amount).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.paid_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}