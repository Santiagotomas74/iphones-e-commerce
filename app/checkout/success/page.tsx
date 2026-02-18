import Link from "next/link";

interface Props {
  searchParams: {
    payment_id?: string;
    status?: string;
    external_reference?: string;
  };
}

export default function SuccessPage({ searchParams }: Props) {
  const { payment_id, external_reference } = searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Pago aprobado
        </h1>

        <p className="text-gray-700 mb-2">
          Tu compra fue realizada con éxito.
        </p>

        {external_reference && (
          <p className="text-sm text-gray-500 mb-1">
            Orden: #{external_reference}
          </p>
        )}

        {payment_id && (
          <p className="text-sm text-gray-500 mb-4">
            Pago ID: {payment_id}
          </p>
        )}

        <Link
          href="/"
          className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
