"use client";

import { usePathname } from "next/navigation";
import Footer from "../footer/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/register"];
  const isAuthPage = hiddenRoutes.includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");

  if (isAuthPage || isAdminPage) return null;

  return <Footer />;
}