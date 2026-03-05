import { NextResponse } from "next/server";
import { query } from "@/db";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId requerido" },
        { status: 400 }
      );
    }

    // aprobar pago
    await query(
      `
      UPDATE orders
      SET payment_status = 'approved',
          order_status = 'dispatch',
          paid_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      `,
      [orderId]
    );

    // obtener email del usuario
    const { rows: userRows } = await query(
      `
      SELECT users.email
      FROM orders
      JOIN users ON users.id = orders.user_id
      WHERE orders.id = $1
      `,
      [orderId]
    );

    const email = userRows[0]?.email;

    // obtener productos del pedido
    const { rows: productsRows } = await query(
      `
      SELECT 
        products.name,
        order_items.quantity,
        order_items.unit_price,
        products.image_1 AS image
      FROM order_items
      JOIN products ON products.id = order_items.product_id
      WHERE order_items.order_id = $1
      `,
      [orderId]
    );

    // calcular total
    const total = productsRows.reduce(
      (sum, p) => sum + Number(p.unit_price) * Number(p.quantity),
      0
    );


    if (email) {
      await sendOrderConfirmationEmail(
        email,
        orderId,
        productsRows,
        total
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error validando orden" },
      { status: 500 }
    );
  }
}