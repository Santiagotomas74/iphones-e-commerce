import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type RefreshPayload = {
  id: number;
  role: string;
};

export async function POST() {
  try {
    const cookieStore = cookies();

    const refreshToken = (await cookieStore).get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      );
    }

    // 🔐 Verificar refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as RefreshPayload;

    // 🆕 Crear nuevo access token
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // 🍪 Guardar nueva cookie
    (await cookieStore).set("tokenTtech", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutos
    });

    return NextResponse.json({
      message: "Token refrescado",
    });

  } catch (error) {
    console.error("Refresh token inválido:", error);

    return NextResponse.json(
      { error: "Refresh token inválido" },
      { status: 401 }
    );
  }
}