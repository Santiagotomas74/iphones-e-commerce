import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { pool } from "@/db";

export async function PUT(req: Request) {
  const client = await pool.connect();

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTtech")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const body = await req.json();
    const { product_id, quantity } = body;

    // 🔎 Validaciones básicas
    if (!product_id || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Cantidad inválida" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // 1️⃣ Verificar que el producto existe y obtener stock
    const productResult = await client.query(
      `SELECT quantity FROM products WHERE id = $1`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Producto no existe" },
        { status: 404 }
      );
    }

    const stock = productResult.rows[0].quantity;

    if (quantity > stock) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      );
    }

    // 2️⃣ Verificar que el carrito pertenece al usuario
    const cartResult = await client.query(
      `SELECT id FROM cart WHERE user_id = $1`,
      [decoded.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Carrito no encontrado" },
        { status: 404 }
      );
    }

    const cartId = cartResult.rows[0].id;

    // 3️⃣ Actualizar solo si el item pertenece a ese carrito
    const updateResult = await client.query(
      `
      UPDATE cart_items
      SET quantity = $1
      WHERE cart_id = $2
      AND product_id = $3
      RETURNING *
      `,
      [quantity, cartId, product_id]
    );

    if (updateResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Item no encontrado en carrito" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      updated_item: updateResult.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en cart/update:", error);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}