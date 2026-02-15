import { query } from "@/db";
import { notFound } from "next/navigation";
import ProductGallery from "./ProductGallery";

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
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const images = [
    product.image_1,
    product.image_2,
    product.image_3,
  ].filter(Boolean);

  return (
    <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      <ProductGallery images={images} />

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

        <p className="mt-6 text-gray-600">
          {product.description}
        </p>
      </div>
    </main>
  );
}
