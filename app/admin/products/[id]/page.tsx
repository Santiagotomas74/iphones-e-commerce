"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    memory: "",
    color: "",
    quantity: "",
    description: "",
    price: "",
    image_1: "",
    image_2: "",
    image_3: "",
  });

  // 🔹 Cargar producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Cargando producto con ID:", id);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
        throw new Error("Producto no encontrado");
        }
        const data = await res.json();

        setForm({
          name: data.name || "",
          memory: data.memory || "",
          color: data.color || "",
          quantity: data.quantity?.toString() || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          image_1: data.image_1 || "",
          image_2: data.image_2 || "",
          image_3: data.image_3 || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error cargando producto:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 🔹 Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      }),
    });

    router.push("/admin");
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full border p-2"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Memoria"
          value={form.memory}
          onChange={(e) => setForm({ ...form, memory: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Cantidad"
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <textarea
          className="w-full border p-2"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Precio"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Imagen 1"
          value={form.image_1}
          onChange={(e) => setForm({ ...form, image_1: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Imagen 2"
          value={form.image_2}
          onChange={(e) => setForm({ ...form, image_2: e.target.value })}
        />

        <input
          className="w-full border p-2"
          placeholder="Imagen 3"
          value={form.image_3}
          onChange={(e) => setForm({ ...form, image_3: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
