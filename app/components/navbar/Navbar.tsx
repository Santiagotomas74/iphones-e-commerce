"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, ShoppingBag, LogOut } from "lucide-react";
import CartSidebar from "./CartSidebar";
import type { NavbarProps } from "./Navbar.types";


export default function Navbar({ items, cartCount }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const cartItemsCount = cartCount; // Usamos el cartCount pasado desde RootLayout
  console.log("Cart count en Navbar:", cartCount); // Verificar el valor de cartCount

 useEffect(() => {
  const checkSession = async () => {
    try {
      let res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });

      // Si falló, ver si fue por token expirado
      if (!res.ok) {
        const data = await res.json().catch(() => null);

        if (res.status === 401 && data?.error === "TokenExpired") {
          // 🔄 intentar refrescar token
          const refreshRes = await fetch("/api/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) throw new Error("Refresh failed");

          // 🔁 volver a intentar obtener usuario
          res = await fetch("/api/me", {
            method: "GET",
            credentials: "include",
          });
        } else {
          throw new Error("Not authenticated");
        }
      }

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
  
 // 🔐 información del user con cartCount
useEffect(() => {
  const checkSessionNav = async () => {
    try {
      let res = await fetch("/api/user/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        

        // 🔄 token expirado → refrescar
        if (res.status === 401 && data?.error === "TokenExpired") {
          console.log("Token expirado, intentando refrescar...");
          const refreshRes = await fetch("/api/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) throw new Error();

          // 🔁 volver a pedir sesión
          res = await fetch("/api/user/me", {
            method: "GET",
            credentials: "include",
          });
        } else {
          throw new Error();
        }
      }

      const data = await res.json();

      console.log("Usuario autenticado:", data);

      setUserName(data.full_name);

    } catch {
      setUserName(null);
    } finally {
      setLoading(false);
    }
  };

  checkSessionNav();
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
    <li key={item.href} className="group relative">
      <Link
        href={item.href}
        className="relative text-gray-700 transition-colors duration-300 group-hover:text-black h-full flex items-center"
      >
        {item.label}
        <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
      </Link>
    </li>
  ))}
</ul>

          {/* RIGHT */}
         <div className="ml-auto flex items-center gap-6">

  {!isLoggedIn && (
    <Link
      href="/login"
      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl
                 text-gray-700 transition-all duration-300
                 hover:text-black hover:bg-gray-100 hover:-translate-y-[2px]"
    >
      <User size={23} className="transition-transform duration-300 group-hover:scale-105" />
      <span className="font-medium">Iniciar sesión</span>
    </Link>
  )}

  {isLoggedIn && (
    <div className="hidden md:flex items-center gap-4">

      <Link
        href="/user/dashboard"
        className="flex items-center gap-2 px-4 py-2 rounded-xl
                   text-gray-700 transition-all duration-300
                   hover:text-black hover:bg-gray-100 hover:-translate-y-[2px]"
      >
        <User size={23} />
        <span className="font-medium">{userName}</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl
                   text-red-500 transition-all duration-300
                   hover:bg-red-50 hover:text-red-600 hover:-translate-y-[2px]"
      >
        <LogOut size={20} />
        <span className="font-medium">Salir</span>
      </button>

    </div>
  )}

  {/* Cart */}
  <button
    onClick={() => setIsCartOpen(true)}
    className="relative p-2 rounded-xl transition-all duration-300
               hover:bg-gray-100 hover:-translate-y-[2px]"
  >
    <ShoppingBag size={26} className="transition-transform duration-300 hover:scale-110" />

    {cartItemsCount > 0 && (
      <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px]
                       flex items-center justify-center
                       bg-blue-600 text-white text-xs font-semibold
                       px-1.5 rounded-full shadow-md
                       transition-all duration-300">
        {cartItemsCount}
      </span>
    )}
  </button>

</div>
        </div>
        
      </nav>

      {/* Overlay mobile */}
      {isMenuOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden
               transition-opacity duration-400"
    onClick={() => setIsMenuOpen(false)}
  />
)}

      {/* SIDEBAR MOBILE */}
      <div
  className={`fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-xl
              shadow-2xl z-50 transform transition-all duration-300 ease-out md:hidden
              ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
>
        <div className="flex items-center justify-between p-5 border-b">
  <span className="text-lg font-semibold tracking-wide text-black">
    TechStore
  </span>
  <button
    onClick={() => setIsMenuOpen(false)}
    className="p-2 rounded-lg transition-all duration-300 text-gray-600 hover:bg-blue-400 hover:text-white"
  >
    <X size={20} />
  </button>
</div>



        <ul className="flex flex-col gap-2 p-6">
  {items.map((item) => (
    <li key={item.href} className="group relative">
      <Link
        href={item.href}
        onClick={() => setIsMenuOpen(false)}
        className="block py-3 px-4 rounded-xl
                   text-gray-700 font-medium
                   transition-all duration-300
                   hover:bg-gray-100 hover:text-black"
      >
        {item.label}
      </Link>

      <span className="absolute left-0 top-1/2 -translate-y-1/2
                       h-0 w-1 bg-black rounded-r
                       transition-all duration-300
                       group-hover:h-10"></span>
    </li>
  ))}
</ul>

        {/* Login / Logout mobile */}
        <div className="border-t p-6 flex flex-col gap-3">

  {!isLoggedIn && (
    <Link
      href="/login"
      onClick={() => setIsMenuOpen(false)}
      className="py-3 px-4 rounded-xl font-medium text-gray-900
                 transition-all duration-300
                 hover:bg-gray-100 hover:text-black"
    >
      Iniciar sesión
    </Link>
  )}

  {isLoggedIn && (
    <>
      <Link
        href="/user/dashboard"
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center gap-2 py-3 px-4 rounded-xl
                   text-gray-700 font-medium
                   transition-all duration-300
                   hover:bg-gray-100 hover:text-black"
      >
        <User size={18} />
        <span>{userName}</span>
      </Link>

      <button
        onClick={() => {
          handleLogout();
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 py-3 px-4 rounded-xl
                   text-red-500 font-medium
                   transition-all duration-300
                   hover:bg-red-50 hover:text-red-600"
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
        count={cartItemsCount}
        onClose={() => setIsCartOpen(false)}
      />
   
    </>
  );
}