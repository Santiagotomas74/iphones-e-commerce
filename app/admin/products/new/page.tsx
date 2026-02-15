"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProduct() {
  const router = useRouter();

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

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      if (!res.ok) {
        alert("Error al crear producto");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="memory"
            placeholder="Memoria (ej: 128GB)"
            value={form.memory}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="quantity"
            type="number"
            placeholder="Cantidad disponible"
            value={form.quantity}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />

        <div className="space-y-2">
          <input
            name="image_1"
            placeholder="URL Imagen 1"
            value={form.image_1}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="image_2"
            placeholder="URL Imagen 2"
            value={form.image_2}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="image_3"
            placeholder="URL Imagen 3"
            value={form.image_3}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
