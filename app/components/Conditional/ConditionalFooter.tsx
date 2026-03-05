"use client";
import { usePathname } from "next/navigation";
import Footer from "../footer/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return null;
  return <Footer />;
}