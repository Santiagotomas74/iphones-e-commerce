"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { Menu, X, User, ShoppingBag  } from "lucide-react";
import CartSidebar from "./CartSidebar";
import type { NavbarProps } from "./Navbar.types";


export default function Navbar({ items }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


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



 useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <>
      <nav className={`
    sticky top-0 z-50 w-full
    transition-all duration-300
    ${
      scrolled
        ? "bg-white/70 backdrop-blur-md shadow-sm"
        : "bg-white"
    }
  `}
>
      <div className="w-full h-16 flex items-center justify-between px-6 text-gray-900">
        <button  
         onClick={() => setIsMenuOpen(true)}
         className="md:hidden"
         > 
         <Menu size={22}/>
        </button>

        <Link href="/" className="text-2xl font-bold text-black tracking-wide absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 ">
          TechStore
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-700 font-medium tracking-wide">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-blue-black transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>


        <div className="flex items-center gap-6 text-gray-100 ">
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-black transition "
          >
            <User size={20} />
            <span>Iniciar sesión</span>
          </Link> 
            <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center text-gray-700 hover:text-black transition"
          >
            <ShoppingBag size={22} />

            {/* Badge */}
            <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs font-medium px-2 py-[2px] rounded-full">
              20
            </span>
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-black transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-black transition  "
            >
              
            </Link>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="hover:text-black transition"
          >
            
          </button>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b text-black">
          <span className="font-semibold text-black">TechStore</span>
          <button onClick={() => setIsMenuOpen(false)}
           className=" md:hidden text-gray-900 hover:text-black transition"
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
        <div className="border-t p-6 flex items-center gap-3 text-gray-700 ">
  <User size={20} />
  <Link
    href="/login"
    onClick={() => setIsMenuOpen(false)}
    className="hover:text-black transition "
  >
    Iniciar sesión
  </Link>
</div>

        </div>
     
      <CartSidebar 
      
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
