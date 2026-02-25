import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "@/db";

export async function GET() {
  try {
    const cookieStore = cookies();

    const token = (await cookieStore).get("tokenTech")?.value;
    const email = (await cookieStore).get("emailTech")?.value;

    if (!token || !email) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // 🔐 Validar JWT
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    // 🔎 Buscar datos de dirección
    const userResult = await query(
      `
      SELECT street, city, zip_code, province
      FROM users
      WHERE email = $1
      `,
      [decodedEmail]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    const hasAddress =
      user.street &&
      user.city &&
      user.zip_code &&
      user.province;

    return NextResponse.json({
      hasAddress: Boolean(hasAddress),
    });

  } catch (error) {
    console.error("Error has-address:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}