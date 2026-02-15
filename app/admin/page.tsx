"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div >
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      <Link
        href="/admin/products/new"
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Crear Producto
      </Link>

      <div className="mt-6 space-y-4">
        {products.map((p: any) => (
          <div key={p.id} className="border p-4 rounded flex justify-between">
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p>${p.price}</p>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/products/${p.id}`}
                className="text-blue-600"
              >
                Editar
              </Link>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
