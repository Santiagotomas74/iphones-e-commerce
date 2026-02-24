"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ImageField = "image_1" | "image_2" | "image_3";

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

 // 🔥 Upload a Cloudinary usando variables de entorno
const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary no está configurado correctamente");
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

  if (!res.ok) {
    throw new Error("Error subiendo imagen a Cloudinary");
  }

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

      const file = e.target.files[0];
      const url = await uploadToCloudinary(file);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const renderImageInput = (field: ImageField, label: string) => (
    <div className="space-y-2 border p-3 rounded">
      <label className="font-medium">{label}</label>

      {/* URL manual */}
      <input
        name={field}
        placeholder="Pegar URL manual"
        value={form[field]}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* File upload */}
      <input
        type="file"
        accept="image/*"
        disabled={!!form[field]} // 🔒 bloquea si hay URL
        onChange={(e) => handleImageUpload(e, field)}
      />

      {/* Preview */}
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

    if (!form.image_1) {
      alert("Debes cargar al menos la Imagen 1");
      return;
    }

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
    <div className="max-w-3xl mx-auto bg-black p-6 rounded shadow">
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

        {/* 🔥 Imágenes */}
        {renderImageInput("image_1", "Imagen 1 (obligatoria)")}
        {renderImageInput("image_2", "Imagen 2")}
        {renderImageInput("image_3", "Imagen 3")}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Procesando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}