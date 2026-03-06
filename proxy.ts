import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("tokenTtech")?.value;
  const refreshToken = req.cookies.get("refreshTokenTech")?.value;
  const { pathname } = req.nextUrl;

  // evitar login/register si ya está logueado
  if (
    accessToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // proteger rutas privadas
  if (pathname.startsWith("/user") || pathname.startsWith("/admin")) {

    if (!accessToken) {
      console.log("No access token, redirigiendo a login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as any;

      // validación de admin
      if (pathname.startsWith("/admin") && decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();

    } catch (error: any) {

      // access token expirado
      if (error.name === "TokenExpiredError") {

        if (!refreshToken) {
          return NextResponse.redirect(new URL("/login", req.url));
        }

        try {

          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
          ) as any;

          const newAccessToken = jwt.sign(
            {
              id: decodedRefresh.id,
              role: decodedRefresh.role,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
          );

          const response = NextResponse.next();

          response.cookies.set("tokenTtech", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
          });

          return response;

        } catch {
          return NextResponse.redirect(new URL("/login", req.url));
        }
      }

      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register",
  ],
};