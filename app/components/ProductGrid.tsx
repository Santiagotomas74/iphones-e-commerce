"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

export default function ProductGrid({ products }: any) {

  const [filters, setFilters] = useState<any>({});

  const filteredProducts = products.filter((p: any) => {

    if (filters.status && p.status !== filters.status) return false;
    if (filters.memory && p.memory !== filters.memory) return false;

    return true;
  });

  return (
    <>
      <ProductFilters onFilterChange={setFilters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {filteredProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}