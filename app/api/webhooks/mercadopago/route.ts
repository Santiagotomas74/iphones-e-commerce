import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Payment } from "mercadopago";
import { randomUUID } from "crypto";

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

    // 🔐 Validar token
    if (!process.env.MP_ACCESS_TOKEN) {
      console.error("MP_ACCESS_TOKEN no definido");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = new Payment(mpClient);

    // 1️⃣ Obtener información real del pago desde MP
    const paymentData = await payment.get({
      id: paymentId,
    });

    console.log("💰 Payment completo:", paymentData);

    const orderId = paymentData.external_reference; // UUID string
    const status = paymentData.status;
    const paidAmount = Number(paymentData.transaction_amount);
    const currency = paymentData.currency_id || "ARS";

    if (!orderId) {
      console.log("⚠️ external_reference vacío");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 2️⃣ Buscar orden
    const orderResult = await query(
      `SELECT id, total_amount, payment_status 
       FROM orders 
       WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      console.log("❌ Orden no encontrada:", orderId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const order = orderResult.rows[0];

    console.log("📦 Orden encontrada:", order);

    // 3️⃣ Validar monto
    if (Number(order.total_amount) !== paidAmount) {
      console.log("🚨 Monto no coincide", {
        db: order.total_amount,
        mp: paidAmount,
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 4️⃣ Idempotencia: si ya estaba approved no hacer nada
    if (order.payment_status === "approved") {
      console.log("⚠️ Orden ya aprobada anteriormente");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // 5️⃣ Si el pago fue aprobado
    if (status === "approved") {

      // 🔎 Verificar si ya existe registro en payments
      const existingPayment = await query(
        `SELECT id FROM payments WHERE provider_payment_id = $1`,
        [paymentId.toString()]
      );

      if (existingPayment.rows.length === 0) {
        await query(
          `
          INSERT INTO payments (
            id,
            order_id,
            provider,
            provider_payment_id,
            amount,
            currency,
            status,
            raw_response,
            created_at,
            updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
          `,
          [
            randomUUID(),
            orderId,
            "mercadopago",
            paymentId.toString(),
            paidAmount,
            currency,
            status,
            JSON.stringify(paymentData),
          ]
        );

        console.log("💾 Payment insertado correctamente");
      } else {
        console.log("⚠️ Payment ya existía, no se duplica");
      }

      // ✅ Actualizar orden
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

      console.log("✅ Orden marcada como paid");
    }

    // 6️⃣ Pending
    if (status === "pending") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'pending',
            updated_at = NOW()
        WHERE id = $1
        `,
        [orderId]
      );

      console.log("⏳ Orden pendiente");
    }

    // 7️⃣ Rejected / Cancelled
    if (status === "rejected" || status === "cancelled") {
      await query(
        `
        UPDATE orders
        SET payment_status = 'rejected',
            order_status = 'cancelled',
            updated_at = NOW()
        WHERE id = $1
        `,
        [orderId]
      );

      console.log("❌ Orden cancelada");
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("💥 Webhook error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
