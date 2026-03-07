import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { pool } from "@/db";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTtech")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Producto requerido" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // 1️⃣ Verificar producto y stock
    const productRes = await client.query(
      `SELECT quantity FROM products WHERE id = $1 FOR UPDATE`,
      [productId]
    );

    if (productRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Producto no existe" },
        { status: 404 }
      );
    }

    const stock = productRes.rows[0].quantity;

    // 2️⃣ Buscar o crear carrito
    let cartRes = await client.query(
      `SELECT id FROM cart WHERE user_id = $1`,
      [userId]
    );

    let cartId;

    if (cartRes.rows.length === 0) {
      const newCart = await client.query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING id`,
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
    }

    // 3️⃣ Ver si producto ya está en carrito
    const itemRes = await client.query(
      `SELECT id, quantity FROM cart_items 
       WHERE cart_id = $1 AND product_id = $2`,
      [cartId, productId]
    );

    if (itemRes.rows.length > 0) {
      const currentQuantity = itemRes.rows[0].quantity;

      if (currentQuantity + 1 > stock) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Stock insuficiente" },
          { status: 400 }
        );
      }

      await client.query(
        `UPDATE cart_items
         SET quantity = quantity + 1
         WHERE id = $1`,
        [itemRes.rows[0].id]
      );
    } else {
      if (stock < 1) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Sin stock disponible" },
          { status: 400 }
        );
      }

      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, 1)`,
        [cartId, productId]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);

    return NextResponse.json(
      { error: "Error carrito" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}