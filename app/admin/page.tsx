"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  DollarSign,
  Boxes,
  ClipboardList,
  Truck,
  BarChart3,
  Loader2,
} from "lucide-react";

import Ordenes from "./orders/Orders";
import Shipping from "./shipping/Shipping";
import AdminFinance from "./finance/Finance";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState("products");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (section === "products") {
      fetchProducts();
    }
  }, [section]);

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "¿Eliminar producto?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await fetch(`/api/products/${id}`, { method: "DELETE" });

    await Swal.fire({
      title: "Producto eliminado",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    fetchProducts();
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "No se pudo eliminar el producto",
      icon: "error",
    });
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-2">

          <button
            onClick={() => setSection("products")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              section === "products"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Boxes size={18} />
            Productos
          </button>

          <button
            onClick={() => setSection("orders")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              section === "orders"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ClipboardList size={18} />
            Órdenes
          </button>

          <button
            onClick={() => setSection("shipping")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              section === "shipping"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Truck size={18} />
            Despachos
          </button>

          <button
            onClick={() => setSection("finance")}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              section === "finance"
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BarChart3 size={18} />
            Ingresos
          </button>

        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-4 md:p-8">

        {/* PRODUCTOS */}
        {section === "products" && (
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Productos
                </h1>
                <p className="text-sm text-gray-500">
                  Gestiona tu catálogo
                </p>
              </div>

              <Link
                href="/admin/products/new"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95"
              >
                <Plus size={20} />
                Crear Producto
              </Link>
            </div>

            {/* Contenedor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {loading ? (
    
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-medium animate-pulse">
        Cargando catálogo...
      </p>
    </div>
              
              ) : products.length > 0 ? (
                <>

                  {/* MOBILE */}
                  <div className="block md:hidden divide-y divide-gray-100">
                    {products.map((p: any) => (
                      <div key={p.id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                              <Package size={20} />
                            </div>

                            <div>
                              <h2 className="font-semibold text-gray-900">
                                {p.name}
                              </h2>

                              <span className="text-indigo-600 font-bold flex items-center text-sm">
                                <DollarSign size={14} /> {p.price}
                              </span>

                              <span className="text-xs text-gray-500">
                                Stock: {p.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-200"
                          >
                            <Pencil size={16} />
                            Editar
                          </Link>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium border border-red-100"
                          >
                            <Trash2 size={16} />
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden md:block">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Producto
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Precio
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                            Stock
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                            Acciones
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {products.map((p: any) => (
                          <tr
                            key={p.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                  <Package size={16} />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {p.name}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-gray-600 font-medium">
                              ${p.price}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  p.quantity > 5
                                    ? "bg-green-100 text-green-700"
                                    : p.quantity > 0
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {p.quantity}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/admin/products/${p.id}`}
                                  className="p-2 text-gray-400 hover:text-indigo-600"
                                >
                                  <Pencil size={18} />
                                </Link>

                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-16 text-center text-gray-400">
                  No hay productos.
                </div>
              )}

            </div>
          </div>
        )}

        {/* OTRAS SECCIONES */}
        {section === "orders" && <Ordenes />}
        {section === "shipping" && <Shipping />}
        {section === "finance" && <AdminFinance />}

      </main>
    </div>
  );
}