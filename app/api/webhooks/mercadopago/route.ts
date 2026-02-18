import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Payment } from "mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔥 Webhook RAW:", JSON.stringify(body));

    // 🔎 Detectar paymentId correctamente
    const paymentId =
      body?.data?.id ||
      body?.resource?.split("/")?.pop() ||
      body?.id;

    if (!paymentId) {
      console.log("⚠️ No hay paymentId en webhook");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log("💳 Payment ID detectado:", paymentId);

    const payment = new Payment(mpClient);

    const paymentData = await payment.get({
      id: paymentId,
    });

    console.log("💰 Payment completo:", paymentData);

    const orderId = paymentData.external_reference;
    const status = paymentData.status;
    const paidAmount = Number(paymentData.transaction_amount);

    if (!orderId) {
      console.log("⚠️ external_reference vacío");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const orderIdNumber = Number(orderId);

    // 🔎 Buscar orden
    const orderResult = await query(
      `SELECT id, total_amount, payment_status 
       FROM orders 
       WHERE id = $1`,
      [orderIdNumber]
    );

    if (orderResult.rows.length === 0) {
      console.log("❌ Orden no encontrada:", orderIdNumber);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const order = orderResult.rows[0];

    console.log("📦 Orden encontrada:", order);

    // 🔐 Validar monto
    if (Number(order.total_amount) !== paidAmount) {
      console.log("🚨 Monto no coincide", {
        db: order.total_amount,
        mp: paidAmount,
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 🛑 Idempotencia
    if (order.payment_status === "approved") {
      console.log("⚠️ Orden ya aprobada");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // ✅ Estados
    if (status === "approved") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'approved',
            order_status = 'paid',
            paid_at = NOW()
        WHERE id = $1
        `,
        [orderIdNumber]
      );

      console.log("✅ Orden actualizada a paid");
    }

    if (status === "pending") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'pending'
        WHERE id = $1
        `,
        [orderIdNumber]
      );

      console.log("⏳ Orden marcada pending");
    }

    if (status === "rejected" || status === "cancelled") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'rejected',
            order_status = 'cancelled'
        WHERE id = $1
        `,
        [orderIdNumber]
      );

      console.log("❌ Orden cancelada");
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("💥 Webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
