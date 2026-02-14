"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "./CartSidebar";
import type { NavbarProps } from "./Navbar.types";

export default function Navbar({ items }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Leer cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return null;
  };

  // 🔹 Verificar login al cargar
  useEffect(() => {
    const token = getCookie("tokenTech");
    const email = getCookie("emailTech");
    console.log("Token encontrado:", token);
    console.log("Email encontrado:", email);
    setIsLoggedIn(!!token);
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    // borrar cookies
    document.cookie = "emailTech=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "tokenTech=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLoggedIn(false);
    window.location.href = "/"; // redirigir a login
  };

  return (
    <>
      <nav className="w-full h-16 border-b flex items-center px-6 justify-between">
        <Link href="/" className="text-xl font-bold">
          TechStore
        </Link>

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

        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hover:text-blue-600 transition"
            >
              Iniciar Sesión
            </Link>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="hover:text-blue-600 transition"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </nav>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
