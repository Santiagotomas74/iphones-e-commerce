"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, ShoppingBag, LogOut } from "lucide-react";
import CartSidebar from "./CartSidebar";
import type { NavbarProps } from "./Navbar.types";

export default function Navbar({ items }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check sesión REAL contra el backend
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include", // IMPORTANTE
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setIsLoggedIn(true);
        setUserName(data.user.name);
      } catch {
        setIsLoggedIn(false);
        setUserName(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    setUserName(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null; // evita flicker feo

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="relative w-full h-20 flex items-center px-6 md:px-10 text-gray-900">

          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden">
              <Menu size={22} />
            </button>

            <Link href="/" className="text-3xl text-black tracking-wide">
              TechStore
            </Link>
          </div>

          <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-lg">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-black transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-6">

            {!isLoggedIn && (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-sm hover:text-black transition"
              >
                <User size={25} />
                <span>Iniciar sesión</span>
              </Link>
            )}

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/user/dashboard"
                  className="flex items-center gap-2 text-sm hover:text-black transition"
                >
                  <User size={25} />
                  {userName && <span>{userName}</span>}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <LogOut size={22} />
                  <span>Salir</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2"
            >
              <ShoppingBag size={27} />
            </button>

          </div>
        </div>
      </nav>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}