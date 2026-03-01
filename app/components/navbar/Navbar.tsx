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

  // 🔐 Chequeo real de sesión
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
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
    //await fetch("/api/logout", {
    //  method: "POST",
    //  credentials: "include",
    //});

    setIsLoggedIn(false);
    setUserName(null);
    document.cookie = "emailTech=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; 
    document.cookie = "tokenTech=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; 
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="relative w-full h-20 flex items-center px-6 md:px-10 text-gray-900">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden"
            >
              <Menu size={22} />
            </button>

            <Link
              href="/"
              className="text-3xl text-black tracking-wide"
            >
              TechStore
            </Link>
          </div>

          {/* CENTER DESKTOP */}
          <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-lg">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-black transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-6">

            {!isLoggedIn && (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2"
              >
                <User size={25} />
                <span>Iniciar sesión</span>
              </Link>
            )}

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/user/dashboard"
                  className="flex items-center gap-2"
                >
                  <User size={25} />
                  <span>{userName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut size={22} />
                  <span>Salir</span>
                </button>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2"
            >
              <ShoppingBag size={27} />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-[2px] rounded-full">
                20
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* SIDEBAR MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-black">TechStore</span>
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-4 p-6">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-black text-black"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login / Logout mobile */}
        <div className="border-t p-6 flex flex-col gap-4">

          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-black "
            >
              Iniciar sesión
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link
                href="/user/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-black gap-2"
              >
                <User size={18} />
                <span>{userName}</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-600"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </>
          )}
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}