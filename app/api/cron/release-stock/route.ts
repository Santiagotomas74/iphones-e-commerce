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

    const expiredOrders = await client.query(`
      SELECT o.id, oi.product_id
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.payment_status = 'pending'
      AND o.expires_at < NOW()
    `);

    for (const row of expiredOrders.rows) {
      await client.query(
        `UPDATE products SET stock = stock + 1 WHERE id = $1`,
        [row.product_id]
      );

      await client.query(
        `UPDATE orders
         SET payment_status = 'cancelled',
             order_status = 'cancelled'
         WHERE id = $1`,
        [row.id]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({ released: expiredOrders.rowCount });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  } finally {
    client.release();
  }
}