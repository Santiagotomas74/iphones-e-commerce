import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Payment } from "mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook recibido:", body);

    // 1️⃣ Solo procesamos pagos
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      console.error("MP_ACCESS_TOKEN no definido");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = new Payment(mpClient);

    // 2️⃣ Obtener info real del pago
    const paymentData = await payment.get({
      id: body.data.id,
    });

    console.log("Pago real:", paymentData);

    const orderId = paymentData.external_reference;
    const status = paymentData.status;
    const paidAmount = Number(paymentData.transaction_amount);

    if (!orderId) {
      console.warn("Pago sin external_reference");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 3️⃣ Buscar orden en DB
    const orderResult = await query(
      `SELECT id, total_amount, payment_status 
       FROM orders 
       WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      console.warn("Orden no encontrada:", orderId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const order = orderResult.rows[0];

    // 4️⃣ Verificar monto (seguridad importante)
    if (Number(order.total_amount) !== paidAmount) {
      console.error("Monto no coincide:", {
        db: order.total_amount,
        mp: paidAmount,
      });

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 5️⃣ Idempotencia: si ya está approved no hacemos nada
    if (order.payment_status === "approved") {
      console.log("Orden ya estaba aprobada:", orderId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 6️⃣ Actualizar según estado
    if (status === "approved") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'approved',
            order_status = 'paid',
            paid_at = NOW()
        WHERE id = $1
        `,
        [orderId]
      );

      console.log("✅ Orden pagada:", orderId);
    }

    if (status === "pending") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'pending'
        WHERE id = $1
        `,
        [orderId]
      );

      console.log("⏳ Orden pendiente:", orderId);
    }

    if (status === "rejected" || status === "cancelled") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'rejected',
            order_status = 'cancelled'
        WHERE id = $1
        `,
        [orderId]
      );

      console.log("❌ Orden cancelada:", orderId);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook error:", error?.cause || error);

    // IMPORTANTE: devolver 200 para evitar reintentos infinitos
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
