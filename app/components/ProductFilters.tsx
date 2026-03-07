"use client";

import { useState } from "react";

type Props = {
  onFilterChange: (filters: any) => void;
};

export default function ProductFilters({ onFilterChange }: Props) {

  const [status, setStatus] = useState<string | null>(null);
  const [memory, setMemory] = useState<string | null>(null);

  const toggleFilter = (type: string, value: string) => {

    if (type === "status") {
      const newValue = status === value ? null : value;
      setStatus(newValue);
      onFilterChange({ status: newValue, memory });
    }

    if (type === "memory") {
      const newValue = memory === value ? null : value;
      setMemory(newValue);
      onFilterChange({ status, memory: newValue });
    }
  };

  return (
    <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100">

      <div className="max-w-7xl mx-auto py-6 flex flex-wrap gap-4 justify-center">

        {/* STATUS */}
        <FilterChip
          active={status === "Nuevo"}
          onClick={() => toggleFilter("status", "Nuevo")}
        >
          Nuevo
        </FilterChip>

        <FilterChip
          active={status === "Reacondicionado"}
          onClick={() => toggleFilter("status", "Reacondicionado")}
        >
          Reacondicionado
        </FilterChip>

        {/* MEMORY */}
        <FilterChip
          active={memory === "64GB"}
          onClick={() => toggleFilter("memory", "64GB")}
        >
          64GB
        </FilterChip>

        <FilterChip
          active={memory === "128GB"}
          onClick={() => toggleFilter("memory", "128GB")}
        >
          128GB
        </FilterChip>

        <FilterChip
          active={memory === "256GB"}
          onClick={() => toggleFilter("memory", "256GB")}
        >
          256GB
        </FilterChip>

      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
      ${
        active
          ? "bg-black text-white shadow-md scale-105"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}