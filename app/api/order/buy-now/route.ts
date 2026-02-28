import { NextResponse } from "next/server";
import { pool } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const {
      email,
      product_id,
      quantity = 1,
      payment_method,
      delivery_type,
      shipping_cost = 0,
      address,
    } = await req.json();

    // 🔎 Validaciones básicas
    if (!email || !product_id || !payment_method || !delivery_type) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Cantidad inválida" },
        { status: 400 }
      );
    }

    if (delivery_type === "shipping" && !address) {
      return NextResponse.json(
        { error: "Dirección requerida para envío" },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    await client.query("BEGIN");

    // 🔹 1️⃣ Buscar usuario
    const userResult = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [decodedEmail]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;

    // 🔹 2️⃣ Descontar stock de forma atómica según quantity
    const stockUpdate = await client.query(
      `
      UPDATE products
      SET quantity = quantity - $2
      WHERE id = $1 
      AND quantity >= $2
      RETURNING id, name, price
      `,
      [product_id, quantity]
    );

    if (stockUpdate.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      );
    }

    const product = stockUpdate.rows[0];
    const productPrice = Number(product.price);

    // 🔹 3️⃣ Calcular totales correctamente
    const totalProduct = productPrice * quantity;

    const total =
      totalProduct +
      (delivery_type === "shipping" ? Number(shipping_cost) : 0);

    const orderNumber = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // 🔹 4️⃣ Crear orden
    const orderInsert = await client.query(
      `
      INSERT INTO orders 
      (order_number, user_id, total_amount, currency, payment_method, payment_status, order_status, delivery_type, shipping_cost, expires_at)
      VALUES ($1, $2, $3, $4, $5, 'pending', 'pending_payment', $6, $7, $8)
      RETURNING id
      `,
      [
        orderNumber,
        userId,
        total,
        "ARS",
        payment_method,
        delivery_type,
        delivery_type === "shipping" ? shipping_cost : 0,
        expiresAt,
      ]
    );

    const orderId = orderInsert.rows[0].id;

    // 🔹 5️⃣ Insertar order_item correcto
    await client.query(
      `
      INSERT INTO order_items
      (order_id, product_id, product_name, unit_price, quantity, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        orderId,
        product.id,
        product.name,
        productPrice,
        quantity,
        totalProduct,
      ]
    );

    // 🔹 6️⃣ Guardar dirección si corresponde
    if (delivery_type === "shipping") {
      await client.query(
        `
        INSERT INTO order_addresses
        (order_id, full_name, phone, street, street_number, apartment,
         city, province, postal_code, additional_info)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `,
        [
          orderId,
          address.full_name,
          address.phone,
          address.street,
          address.street_number,
          address.apartment || null,
          address.city,
          address.province,
          address.postal_code,
          address.additional_info || null,
        ]
      );
    }

    await client.query("COMMIT");

    // 🔹 7️⃣ Transferencia
    if (payment_method === "transfer") {
      return NextResponse.json({
        order_id: orderId,
        order_number: orderNumber,
      });
    }

    // 🔹 8️⃣ MercadoPago correcto
    if (payment_method === "mercadopago") {
      const preference = new Preference(mpClient);

      const response = await preference.create({
        body: {
          items: [
            {
              id: product.id.toString(),
              title: product.name,
              unit_price: productPrice,
              quantity: quantity,
              currency_id: "ARS",
            },
          ],
          external_reference: orderId.toString(),
          notification_url:
            "https://iphones-e-commerce.vercel.app/api/webhooks/mercadopago",
          back_urls: {
            success:
              "https://iphones-e-commerce.vercel.app/checkout/success",
            failure:
              "https://iphones-e-commerce.vercel.app/checkout/failure",
            pending:
              "https://iphones-e-commerce.vercel.app/checkout/pending",
          },
          auto_return: "approved",
        },
      });

      return NextResponse.json({
        init_point: response.init_point,
      });
    }

    return NextResponse.json(
      { error: "Método de pago inválido" },
      { status: 400 }
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error buy-now:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}