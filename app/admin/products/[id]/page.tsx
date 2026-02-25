"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ImageField = "image_1" | "image_2" | "image_3";

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

  // 🔥 Upload a Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary no configurado");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Error subiendo imagen");

    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField
  ) => {
    if (!e.target.files) return;

    try {
      setLoading(true);
      const url = await uploadToCloudinary(e.target.files[0]);

      setForm((prev) => ({
        ...prev,
        [field]: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");

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

  const renderImageInput = (field: ImageField, label: string) => (
    <div className="space-y-2 border p-3 rounded">
      <label className="font-medium">{label}</label>

      <input
        className="w-full border p-2"
        placeholder="Pegar URL manual"
        value={form[field]}
        onChange={(e) =>
          setForm({ ...form, [field]: e.target.value })
        }
      />

      <input
        type="file"
        accept="image/*"
        disabled={!!form[field]} // 🔒 bloquea si hay URL
        onChange={(e) => handleImageUpload(e, field)}
      />

      {form[field] && (
        <img
          src={form[field]}
          alt="preview"
          className="w-32 mt-2 rounded"
        />
      )}
    </div>
  );

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
    <div className="max-w-2xl mx-auto py-10 bg-black p-6 rounded shadow bg-white">
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

        {renderImageInput("image_1", "Imagen 1")}
        {renderImageInput("image_2", "Imagen 2")}
        {renderImageInput("image_3", "Imagen 3")}

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