"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Image as ImageIcon, 
  Save, 
  ArrowLeft, 
  UploadCloud, 
  Trash2, 
  Smartphone, 
  Hash, 
  Palette, 
  DollarSign 
} from "lucide-react";

type ImageField = "image_1" | "image_2" | "image_3";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    memory: "",
    color: "",
    quantity: 0,
    description: "",
    price: 0,
    image_1: "",
    image_2: "",
    image_3: "",
  });

  
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary no configurado");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Error subiendo imagen");
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: ImageField) => {
    if (!e.target.files) return;
    try {
      setLoading(true);
      const url = await uploadToCloudinary(e.target.files[0]);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error(err);
      alert("Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

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
          quantity: data.quantity || 0,
          description: data.description || "",
          price: data.price || 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const renderImageInput = (field: ImageField, label: string) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        <ImageIcon size={18} />
        <label className="font-semibold text-sm uppercase tracking-wider">{label}</label>
      </div>

      <div className="space-y-3">
        {form[field] ? (
          <div className="relative group w-full h-40 rounded-lg overflow-hidden border bg-white">
            <img src={form[field]} alt="preview" className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => setForm({...form, [field]: ""})}
                className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
              <p className="text-sm text-gray-500">Click para subir</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, field)} 
            />
          </label>
        )}
        
        <input
          className="w-full text-xs border border-gray-200 p-2 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="O pega la URL de la imagen aquí"
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        />
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => router.push("/admin")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft size={20} className="mr-1" /> Volver al panel
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Editar Producto</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card: Información General */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Información Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Smartphone size={16} /> Nombre del Dispositivo
                </label>
                <input
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border outline-none transition-all"
                  placeholder="Ej: iPhone 15 Pro Max"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Hash size={16} /> Memoria
                  </label>
                  <input
                    className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 border outline-none transition-all"
                    placeholder="256GB"
                    value={form.memory}
                    onChange={(e) => setForm({ ...form, memory: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Palette size={16} /> Color
                  </label>
                  <input
                    className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 border outline-none transition-all"
                    placeholder="Titanio Azul"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Hash size={16} /> Stock Disponible
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Math.max(0, Number(e.target.value)) })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign size={16} /> Precio (USD)
                </label>
               <input
  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 border outline-none transition-all font-bold text-blue-600"
  type="number"
  min={0}
  step="0.01"
  value={form.price}
  onChange={(e) =>
    setForm({
      ...form,
      price: Math.max(0, Number(e.target.value))
    })
  }
/>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700">Descripción Detallada</label>
                <textarea
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 border outline-none transition-all min-h-[120px]"
                  placeholder="Escribe las características del producto..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Card: Galería de Imágenes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Multimedia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {renderImageInput("image_1", "Imagen Principal")}
              {renderImageInput("image_2", "Vista Lateral")}
              {renderImageInput("image_3", "Detalles")}
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : <><Save size={20} /> Guardar Cambios</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}