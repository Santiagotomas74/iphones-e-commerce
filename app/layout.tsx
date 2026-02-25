import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import type { NavItem } from "./components/navbar/Navbar.types";
import TopBanner from "./components/Banner/TopBanner";
import Footer from "./components/footer/Footer";

const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Administracion", href: "/admin" },
  { label: "Consolas", href: "/consolas" },
];

export const metadata: Metadata = {
  title: "TechStore",
  description: "E-commerce Tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
         <TopBanner />
        <Navbar items={navItems} />
        {children}
          <Footer />
      </body>
    </html>
  );
}
