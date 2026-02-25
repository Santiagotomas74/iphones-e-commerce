"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Package, DollarSign } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este producto?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header adaptable */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">Gestiona tu catálogo</p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          <span>Crear Producto</span>
        </Link>
      </div>

      {/* Contenedor Principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 animate-pulse text-sm">Cargando catálogo...</div>
        ) : products.length > 0 ? (
          <>
            {/* VISTA MÓVIL (Cards) - Se oculta en pantallas medianas (md) */}
            <div className="block md:hidden divide-y divide-gray-100">
              {products.map((p: any) => (
                <div key={p.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Package size={20} />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900 leading-tight">{p.name}</h2>
                        <span className="text-indigo-600 font-bold flex items-center text-sm">
                          <DollarSign size={14} /> {p.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Acciones en móviles: Botones de ancho completo */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium border border-gray-200"
                    >
                      <Pencil size={16} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium border border-red-100"
                    >
                      <Trash2 size={16} /> Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VISTA DESKTOP (Tabla) - Se oculta en móviles */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">${p.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${p.id}`} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                            <Pencil size={18} />
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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
          <div className="p-16 text-center text-gray-400">No hay productos.</div>
        )}
      </div>
    </div>
  );
}