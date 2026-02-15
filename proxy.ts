import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("tokenTech")?.value;
  const { pathname } = req.nextUrl;

  // 🔹 Si intenta entrar a /login estando logueado
  if (token && pathname.startsWith("/login") || pathname.startsWith("/register")  ) {
    try {
      
      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      // Token inválido → deja pasar al login
      return NextResponse.next();
    }
  }

  // 🔹 Protección de /admin
  if (pathname.startsWith("/admin")) {

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as any;

      const role = decoded.role?.toString().trim().toLowerCase();

      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();

    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
