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

    // ===============================
    // 1️⃣ TRANSFERENCIAS EXPIRADAS SIN COMPROBANTE
    // ===============================
    const expiredTransfers = await client.query(`
      SELECT 
        o.id AS order_id,
        oi.product_id,
        oi.quantity
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.payment_method = 'transfer'
        AND o.payment_status = 'pending'
        AND o.payment_receipt_url IS NULL
        AND o.expires_at IS NOT NULL
        AND o.expires_at < NOW()
    `);

    for (const row of expiredTransfers.rows) {
      await client.query(
        `UPDATE products
         SET quantity = quantity + $1
         WHERE id = $2`,
        [row.quantity, row.product_id]
      );
    }

    await client.query(`
      UPDATE orders
      SET payment_status = 'cancelled',
          order_status = 'cancelled'
      WHERE payment_method = 'transfer'
        AND payment_status = 'pending'
        AND payment_receipt_url IS NULL
        AND expires_at IS NOT NULL
        AND expires_at < NOW()
    `);

    // ===============================
    // 2️⃣ MERCADOPAGO EXPIRADOS EN PENDING
    // ===============================
    const expiredMP = await client.query(`
      SELECT 
        o.id AS order_id,
        oi.product_id,
        oi.quantity
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.payment_method = 'mercadopago'
        AND o.payment_status = 'pending'
        AND o.expires_at IS NOT NULL
        AND o.expires_at < NOW()
    `);

    for (const row of expiredMP.rows) {
      await client.query(
        `UPDATE products
         SET quantity = quantity + $1
         WHERE id = $2`,
        [row.quantity, row.product_id]
      );
    }

    await client.query(`
      UPDATE orders
      SET payment_status = 'cancelled',
          order_status = 'cancelled'
      WHERE payment_method = 'mercadopago'
        AND payment_status = 'pending'
        AND expires_at IS NOT NULL
        AND expires_at < NOW()
    `);

    await client.query("COMMIT");

    return NextResponse.json({
      released_transfer_items: expiredTransfers.rowCount,
      released_mp_items: expiredMP.rowCount,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cron release-stock error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  } finally {
    client.release();
  }
}