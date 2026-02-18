import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          ❌ Pago rechazado
        </h1>

        <p className="text-gray-700 mb-6">
          Hubo un problema con tu pago. Podés intentar nuevamente.
        </p>

        <Link
          href="/cart"
          className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Volver al carrito
        </Link>
      </div>
    </div>
  );
}
