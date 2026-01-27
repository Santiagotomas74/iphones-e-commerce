"use client";

import Link from "next/link";
import { NavbarProps } from "./Navbar.types";

export default function Navbar({ items }: NavbarProps) {
  return (
    <nav className="w-full h-16 border-b flex items-center px-6 justify-between">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        TechStore
      </Link>

      {/* Links */}
      <ul className="flex gap-6">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="hover:text-blue-600 transition"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Acciones */}
      <div className="flex gap-4">
        <Link href="/login">Iniciar Sesion</Link>
        <Link href="/cart">🛒</Link>
      </div>
    </nav>
  );
}
