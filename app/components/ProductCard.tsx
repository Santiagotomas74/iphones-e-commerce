type Product = {
  id: string;
  name: string;
  memory: string;
  color: string;
  price: number;
  quantity: number;
  description: string;
  image_1: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <img
        src={product.image_1}
        alt={product.name}
        className="w-full h-56 object-contain mb-4"
      />

      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-500">
        {product.memory} · {product.color}
      </p>

      <p className="mt-2 text-sm">{product.description}</p>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xl font-bold">
          ${product.price.toLocaleString("es-AR")}
        </span>

        <span className="text-sm text-gray-600">
          Stock: {product.quantity}
        </span>
      </div>
    </div>
  );
}
