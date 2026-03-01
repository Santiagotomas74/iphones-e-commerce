import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import type { NavItem } from "./components/navbar/Navbar.types";
import TopBanner from "./components/Banner/TopBanner";
import Footer from "./components/footer/Footer";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Administracion", href: "/admin" },
  { label: "Consolas", href: "/user/dashboard" },
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

  // 🔐 Leer cookie desde el servidor
  const cookieStore = cookies();
  const token = (await cookieStore).get("tokenTech")?.value;

  let user = null;

  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as any;

      user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };
    } catch {
      user = null;
    }
  }

  return (
    <html lang="es">
      <body>
        <TopBanner />
        <Navbar items={navItems} user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}