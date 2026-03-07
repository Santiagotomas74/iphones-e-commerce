import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "@/db";

type TokenPayload = {
  id: number;
  role?: string;
};

export async function GET() {
  console.log("GET /api/user/me - Verificando token...");
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTtech")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    const result = await query(
      `
      SELECT 
        u.name,
        u.lastname,
        COALESCE(SUM(ci.quantity),0) AS total_items
      FROM users u
      LEFT JOIN cart c ON c.user_id = u.id
      LEFT JOIN cart_items ci ON ci.cart_id = c.id
      WHERE u.id = $1
      GROUP BY u.name, u.lastname
      `,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      full_name: `${user.name} ${user.lastname}`,
      cart_items_count: Number(user.total_items),
    });

  } catch (error) {
    console.error("Error en /api/user/me:", error);

    return NextResponse.json(
      { error: "Token inválido o error interno" },
      { status: 401 }
    );
  }
}