import { NextResponse } from "next/server";
import { pool } from "@/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔎 Buscar órdenes expiradas con sus cantidades reales
    const expiredOrders = await client.query(`
      SELECT 
        o.id AS order_id,
        oi.product_id,
        oi.quantity
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.payment_status = 'pending'
      AND o.expires_at IS NOT NULL
      AND o.expires_at < NOW()
    `);

    for (const row of expiredOrders.rows) {
      // 🔼 Liberar exactamente la cantidad reservada
      await client.query(
        `UPDATE products
         SET stock = stock + $1
         WHERE id = $2`,
        [row.quantity, row.product_id]
      );
    }

    // 🚫 Cancelar las órdenes expiradas (solo una vez)
    await client.query(`
      UPDATE orders
      SET payment_status = 'cancelled',
          order_status = 'cancelled'
      WHERE payment_status = 'pending'
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
    `);

    await client.query("COMMIT");

    return NextResponse.json({
      released_items: expiredOrders.rowCount,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cron release-stock error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    client.release();
  }
}