import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "@/db";

export async function GET() {
  try {
    // 🔐 1️⃣ Obtener token desde cookie
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTech")?.value;
    console.log("Token recibido:", token);

    if (!token) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // 🔐 2️⃣ Verificar JWT
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // 👤 3️⃣ Obtener datos del usuario
    const userResult = await query(
      `
      SELECT id, name, email, phone
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
/*
    // 📍 4️⃣ Obtener dirección
    const addressResult = await query(
      `
      SELECT street, city, state, zip_code
      FROM addresses
      WHERE user_id = $1
      LIMIT 1
      `,
      [userId]
    );

    const address =
      addressResult.rows.length > 0
        ? addressResult.rows[0]
        : null;
*/
    // 📦 5️⃣ Obtener órdenes
    const ordersResult = await query(
      `
      SELECT id, order_number, total_amount, payment_status, order_status, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const orders = ordersResult.rows;

    // 💳 6️⃣ Obtener pagos
    const paymentsResult = await query(
      `
      SELECT p.id, p.amount, p.status, p.created_at, o.order_number
      FROM payments p
      INNER JOIN orders o ON o.id = p.order_id
      WHERE o.user_id = $1
      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    const payments = paymentsResult.rows;

    return NextResponse.json({
      user: {
        ...user,
      //  address,
      },
      orders,
      payments,
    });

  } catch (error) {
    console.error("Error dashboard:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}