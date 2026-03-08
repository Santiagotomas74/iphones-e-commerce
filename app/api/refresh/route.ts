import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type RefreshPayload = {
  id: number;
  role: string;
};

export async function POST() {
  console.log("Intentando refrescar token...");

  try {
    // 👇 ahora cookies es async
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshTokenTech")?.value;
    console.log("Refresh token recibido:", refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      );
    }

    // 🔐 verificar refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as RefreshPayload;

    // 🆕 crear nuevo access token
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    // 🍪 guardar cookie
    cookieStore.set("tokenTtech", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 3,// ,
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