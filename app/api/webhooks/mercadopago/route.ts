import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { sendOrderConfirmationEmail } from "@/lib/mailer";
import { Payment, MerchantOrder } from "mercadopago";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔥 Webhook RAW:", JSON.stringify(body));

    let paymentId: string | null = null;

    // =============================
    // 🟢 Caso 1: Webhook tipo payment
    // =============================
    if (body?.type === "payment" && body?.data?.id) {
      paymentId = String(body.data.id);
    }

    // =============================
    // 🟢 Caso 2: Webhook tipo merchant_order
    // =============================
    if (body?.topic === "merchant_order" && body?.resource) {
      const merchantOrderId = body.resource.split("/").pop();

      if (merchantOrderId) {
        console.log("🧾 MerchantOrder ID:", merchantOrderId);

        const merchantOrderClient = new MerchantOrder(mpClient);

        const merchantOrderData = await merchantOrderClient.get({
          merchantOrderId: Number(merchantOrderId),
        });

        const firstPayment = merchantOrderData.payments?.[0];

        if (firstPayment?.id) {
          paymentId = String(firstPayment.id);
        }
      }
    }

    if (!paymentId) {
      console.log("⚠️ No se pudo obtener paymentId");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log("💳 Payment ID final:", paymentId);

    // =============================
    // 🔎 Obtener información real del pago
    // =============================
    const paymentClient = new Payment(mpClient);

    const paymentData = await paymentClient.get({
      id: paymentId,
    });

    console.log("💰 Payment completo:", paymentData);

    const orderId = paymentData.external_reference;
    const status = paymentData.status;
    const paidAmount = Number(paymentData.transaction_amount);
    const currency = paymentData.currency_id || "ARS";

    if (!orderId) {
      console.log("⚠️ external_reference vacío");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // =============================
    // 🔎 Buscar orden + email
    // =============================
    const orderResult = await query(
      `
      SELECT 
        o.id,
        o.total_amount,
        o.payment_status,
        u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      console.log("❌ Orden no encontrada:", orderId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const order = orderResult.rows[0];
    const userEmail = order.email;

    console.log("📦 Orden encontrada:", order);

    // =============================
    // 🔐 Validar monto
    // =============================
    if (Number(order.total_amount) !== paidAmount) {
      console.log("🚨 Monto no coincide", {
        db: order.total_amount,
        mp: paidAmount,
      });
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // =============================
    // 🛑 Idempotencia
    // =============================
    if (order.payment_status === "approved") {
      console.log("⚠️ Orden ya estaba aprobada");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // =============================
    // ✅ APPROVED
    // =============================
    if (status === "approved") {

      const existingPayment = await query(
        `SELECT id FROM payments WHERE provider_payment_id = $1`,
        [paymentId]
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
            paymentId,
            paidAmount,
            currency,
            status,
            JSON.stringify(paymentData),
          ]
        );

        console.log("💾 Payment guardado en tabla payments");

      } else {
        console.log("⚠️ Payment ya existía (idempotencia OK)");
      }

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

      console.log("✅ Orden marcada como dispatch");

      // =============================
      // 🧾 Obtener productos
      // =============================
      const productsResult = await query(
        `
        SELECT 
          p.name,
          oi.quantity,
          oi.unit_price,
          p.image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
        `,
        [orderId]
      );

      const products = productsResult.rows;

      console.log("🛒 Productos:", products);

      // =============================
      // 📧 Enviar email
      // =============================
      try {

        await sendOrderConfirmationEmail(
          userEmail,
          orderId,
          products,
          paidAmount
        );

        console.log("📧 Email de confirmación enviado");

      } catch (error) {

        console.error("❌ Error enviando email:", error);

      }

    }

    // =============================
    // ⏳ PENDING
    // =============================
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

      console.log("⏳ Orden marcada como pending");
    }

    // =============================
    // ❌ REJECTED
    // =============================
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

    return NextResponse.json(
      { received: true },
      { status: 200 }
    );
  }
}