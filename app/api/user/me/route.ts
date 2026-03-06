import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "@/db";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTtech")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 1️⃣ Traer nombre completo
    const userResult = await query(
      `SELECT name, lastname FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const fullName = `${userResult.rows[0].name} ${userResult.rows[0].lastname}`;
    

    // 2️⃣ Contar cantidad total de items en carrito
    const cartCountResult = await query(
      `
      SELECT COALESCE(SUM(ci.quantity), 0) AS total_items
      FROM cart c
      LEFT JOIN cart_items ci ON ci.cart_id = c.id
      WHERE c.user_id = $1
      `,
      [decoded.id]
    );

    const cartItemsCount = Number(cartCountResult.rows[0].total_items);

    return NextResponse.json({
      full_name: fullName,
      cart_items_count: cartItemsCount,
    });

  } catch (error) {
    console.error("Error en /api/me:", error);

    return NextResponse.json(
      { error: "Token inválido o error interno" },
      { status: 401 }
    );
  }
}