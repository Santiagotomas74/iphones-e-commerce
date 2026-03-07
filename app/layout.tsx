import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import type { NavbarProps } from "./components/navbar/Navbar.types";
import TopBanner from "./components/Banner/TopBanner";
import Footer from "./components/footer/Footer";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { query } from "@/db"; // ajustá según tu path real
import ConditionalFooter from "./components/Conditional/ConditionalFooter";

const navItems: NavbarProps["items"] = [
  { label: "Inicio", href: "/" },
  { label: "Administracion", href: "/admin" },
  { label: "Consolas", href: "/consolas" },
];

export const metadata: Metadata = {
  title: "TechStore",
  description: "E-commerce Tech",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("tokenTtech")?.value;

  let user = null;
  let cartCount = 0;

  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as any;
      console.log("Token decodifidfsdfsdfsdfsfsdfsfsddfs"); // Verificar el contenido del token

      user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };

      // 🛒 Traer carrito del usuario
      const { rows } = await query(
  `
  SELECT COALESCE(SUM(ci.quantity), 0) AS total_items
  FROM cart c
  LEFT JOIN cart_items ci ON ci.cart_id = c.id
  WHERE c.user_id = $1
  `,
  [user.id]
);

cartCount = Number(rows[0].total_items);
      console.log("Cart count en RootLayout:", cartCount); // Verificar el valor de cartCount
    } catch (error) {
      user = null;
      cartCount = 0;
    }
  } else {
    user = null;
    cartCount = 0;
 
  }
 

  return (
    <html lang="es">
      <body>
        <TopBanner />
        <Navbar items={navItems} user={user} cartCount={cartCount} />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}