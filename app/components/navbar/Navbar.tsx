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

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return null;
  };

  
  useEffect(() => {
    const token = getCookie("tokenTech");
    if (token) {
      setIsLoggedIn(true);
   
      setUserName("Juanfer  Quintero");
    } else {
      setUserName("Juanfer Quintero"); 
    }
  }, []);

  const handleLogout = () => {
    // Borra cookies (ajustar domain/path si LLEGA A SERRR NECESArio )
    document.cookie =
      "emailTech=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "tokenTech=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLoggedIn(false);
    setUserName("Maxi");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
           <div className="flex items-center gap-4"> 
            <Link
              href="/"
              className="text-2xl font-bold text-black tracking-wide"
            >
              TechStore
            </Link>
            </div>
          </div>

          {/* CENTER (desktop menu) */}
          <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-sm text-gray-700 font-medium tracking-wide">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-6">

            {!isLoggedIn && (
              <div className="hidden md:flex flex-col items-end gap-1">
                <span className="text-sm text-gray-500">
                  {/* Hola, {userName} */}
                </span>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition"
                >
                  <User size={20} />
                  <span>Iniciar sesión</span>
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-4">
                {/* Icono + nombre para dashboard */}
                <Link
                  href="/user/dashboard"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition"
                >
                  <User size={20} />
                  {userName && <span>{userName}</span>}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 transition-all duration-200 active:scale-90 group"
                >
                  <div className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <LogOut size={20} />
                  </div>
                  <span>Salir</span>
                </button>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center text-gray-700 hover:text-black transition p-2 rounded-full "
            >
              <ShoppingBag size={22} />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-medium px-2 py-[2px] rounded-full">
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

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className=" relative flex items-center justify-between p-4 border-b text-black ">
          <span className="font-semibold ">TechStore</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-900 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="flex flex-col gap-4 p-6 text-gray-700">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 hover:text-black"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile login/logout */}
        <div className="border-t p-6 flex flex-col gap-3 text-gray-700">
          {!isLoggedIn && (
            <>
              <span className="text-sm text-gray-500">Hola, {userName}</span>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-black transition"
              >
                Iniciar sesión
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition"
              >
                <User size={18} />
                {userName && <span>{userName}</span>}
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="items-center gap-2 text-sm font-medium text-red-600 flex"
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