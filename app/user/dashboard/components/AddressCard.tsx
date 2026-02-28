"use client";

import { useState } from "react";

interface Address {
  street: string;
  altura: string;
  zip_code: string;
  city: string;
  province: string;
  address_description: string;
}

interface Props {
  address?: Address;
  onAddressUpdated?: (newAddress: Address) => void;
}

export default function UserAddress({ address, onAddressUpdated }: Props) {
  const [editing, setEditing] = useState(false);
    console.log("Address en UserAddress:", address);
  const [form, setForm] = useState<Address>({
    street: address?.street || "",
    altura: address?.altura || "",
    zip_code: address?.zip_code || "",
    city: address?.city || "",
    province: address?.province || "",
    address_description: address?.address_description || "",
  });

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error actualizando dirección");

      const data = await res.json();

      onAddressUpdated?.(data.address);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border p-6 rounded shadow text-gray-900">
      <h2 className="text-xl font-semibold mb-4">
        Dirección de Envío
      </h2>

      {!editing ? (
        <>
          {address ? (
            <>
              <p>
                Calle: {address.street} altura {address.altura}
              </p>
              <p>Código postal: {address.zip_code}</p>
              <p>
                Ciudad: {address.city} - Provincia {address.province}
              </p>
              <p>
                Descripción: {address.address_description}
              </p>
            </>
          ) : (
            <p>No tenés dirección cargada.</p>
          )}

        <button
  className="mt-6 w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-amber-200/50 active:scale-95 text-white text-bold shadow"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
  Editar Dirección
</button>
        </>
      ) : (
        <div className="space-y-3">
          <input
            className="w-full border p-2 text-black"
            placeholder="Calle"
            value={form.street}
            onChange={(e) =>
              setForm({ ...form, street: e.target.value })
            }
          />

          <input
            className="w-full border p-2 text-black"
            placeholder="Altura"
            value={form.altura}
            onChange={(e) =>
              setForm({ ...form, altura: e.target.value })
            }
          />

          <input
            className="w-full border p-2 text-black"
            placeholder="Código postal"
            value={form.zip_code}
            onChange={(e) =>
              setForm({ ...form, zip_code: e.target.value })
            }
          />

          <input
            className="w-full border p-2 text-black"
            placeholder="Ciudad"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />

          <input
            className="w-full border p-2 text-black"
            placeholder="Provincia"
            value={form.province}
            onChange={(e) =>
              setForm({ ...form, province: e.target.value })
            }
          />

          <textarea
            className="w-full border p-2 text-black"
            placeholder="Descripción adicional"
            value={form.address_description}
            onChange={(e) =>
              setForm({
                ...form,
                address_description: e.target.value,
              })
            }
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Guardar
            </button>

            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}