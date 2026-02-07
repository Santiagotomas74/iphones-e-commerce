import { query } from "@/db";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  const { rows } = await query(
    `SELECT * FROM products WHERE id = $1`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ← MUY IMPORTANTE

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      <div>
        <img
          src={product.image_1}
          className="w-full object-contain"
        />

        <div className="flex gap-3 mt-4">
          <img src={product.image_1} className="w-20 border rounded" />
          <img src={product.image_2} className="w-20 border rounded" />
          <img src={product.image_3} className="w-20 border rounded" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-gray-500 mt-2">
          {product.memory} • {product.color}
        </p>

        <p className="text-4xl font-bold mt-6">
          ${product.price.toLocaleString()}
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl">
          Agregar al carrito
        </button>

        <p className="mt-6 text-gray-600">{product.description}</p>
      </div>
    </main>
  );
}
