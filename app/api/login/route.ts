import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Buscar usuario
    const { rows } = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // 2️⃣ Verificar password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 3️⃣ Crear ACCESS TOKEN (corto)
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // 4️⃣ Crear REFRESH TOKEN (largo)
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    // 📧 Email visible para frontend
    response.cookies.set("emailTech", user.email, {
      httpOnly: false,
      path: "/",
    });

    // 🔐 Access Token
    response.cookies.set("tokenTtech", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutos
    });

    // 🔄 Refresh Token
    response.cookies.set("refreshTokenTech", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error en login" },
      { status: 500 }
    );
  }
}