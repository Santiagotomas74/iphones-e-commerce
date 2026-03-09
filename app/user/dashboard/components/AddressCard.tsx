"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

interface Address {
  street: string;
  altura: string;
  zip_code: string;
  city: string;
  province: string;
  address_description: string;
}

interface Payment {
  id: number;
  order_number: string;
  amount: number;
  provider: string;
  status: string;
}

interface Props {
  address?: Address;
  payments?: Payment[];
  onAddressUpdated?: (newAddress: Address) => void;
}

export default function UserAddress({
  address,
  payments = [],
  onAddressUpdated,
}: Props) {
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
      let res = await fetch("/api/user/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      // 🔐 access token vencido
      if (res.status === 401) {
        console.log("Token vencido, intentando refresh...");

        const refresh = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (refresh.ok) {
          // 🔁 repetir request
          res = await fetch("/api/user/address", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
          });
        } else {
          window.location.href = "/login";
          return;
        }
      }

      if (!res.ok) {
        throw new Error("Error actualizando dirección");
      }

      const data = await res.json();

      onAddressUpdated?.(data.address);
      setEditing(false);
    } catch (err) {
      console.error("Error guardando dirección:", err);
    }
  };

  return (
    <div className="border p-6 rounded shadow text-gray-900">
      <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>

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
              <p>Descripción: {address.address_description}</p>
            </>
          ) : (
            <p>No tenés dirección cargada.</p>
          )}

          <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-gray-400" />
              Historial de Pagos
            </h2>

            {payments.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                No hay pagos registrados.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:border-red-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">
                          Orden #{payment.order_number}
                        </p>

                        <p className="font-bold text-gray-800 text-lg">
                          ${Number(payment.amount).toLocaleString()}
                        </p>
                      </div>

                      <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-white border border-gray-100 text-gray-400 uppercase italic">
                        {payment.provider}
                      </span>
                    </div>

                    <p
                      className={`text-[10px] mt-2 font-bold uppercase ${
                        payment.status === "approved"
                          ? "text-green-500"
                          : payment.status === "rejected"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      ● {payment.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
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