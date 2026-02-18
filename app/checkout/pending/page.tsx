import Link from "next/link";

interface Props {
  searchParams: {
    external_reference?: string;
  };
}

export default function PendingPage({ searchParams }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          ⏳ Pago pendiente
        </h1>

        <p className="text-gray-700 mb-2">
          Tu pago está siendo procesado.
        </p>

        {searchParams.external_reference && (
          <p className="text-sm text-gray-500 mb-4">
            Orden: #{searchParams.external_reference}
          </p>
        )}

        <Link
          href="/"
          className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
