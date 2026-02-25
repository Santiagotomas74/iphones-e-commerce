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
    <div className="border p-6 rounded shadow">
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
            onClick={() => {
              if (address) setForm(address);
              setEditing(true);
            }}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
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