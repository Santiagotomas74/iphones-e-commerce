import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const { email, productId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    // ⚠️ MUY IMPORTANTE: decodificar email
    const decodedEmail = decodeURIComponent(email);

    // 1️⃣ Buscar ID del usuario por email
    const userRes = await query(
      `SELECT id FROM users WHERE email = $1`,
      [decodedEmail]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userId = userRes.rows[0].id;

    // 2️⃣ Buscar carrito del usuario
    const cartRes = await query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [userId]
    );

    let cartId;

    if (cartRes.rows.length === 0) {
      const newCart = await query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING id`,
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
    }

    // 3️⃣ Ver si producto ya existe en carrito
    const itemRes = await query(
      `SELECT * FROM cart_items 
       WHERE cart_id = $1 AND product_id = $2`,
      [cartId, productId]
    );

    if (itemRes.rows.length > 0) {
      await query(
        `UPDATE cart_items
         SET quantity = quantity + 1
         WHERE id = $1`,
        [itemRes.rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, 1)`,
        [cartId, productId]
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error carrito" },
      { status: 500 }
    );
  }
}
