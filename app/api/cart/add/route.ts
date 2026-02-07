import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();

    // 1. buscar carrito del usuario
    const cartRes = await query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [userId]
    );

    let cartId;

    if (cartRes.rows.length === 0) {
      // crear carrito
      const newCart = await query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
    }

    // 2. ver si el producto ya está
    const itemRes = await query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartId, productId]
    );

    if (itemRes.rows.length > 0) {
      // sumar cantidad
      await query(
        `UPDATE cart_items
         SET quantity = quantity + 1
         WHERE id = $1`,
        [itemRes.rows[0].id]
      );
    } else {
      // insertar item
      await query(
        `INSERT INTO cart_items (cart_id, product_id)
         VALUES ($1, $2)`,
        [cartId, productId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error carrito" }, { status: 500 });
  }
}
