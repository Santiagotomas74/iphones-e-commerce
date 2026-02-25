import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { email, product_id, payment_method } = await req.json();

    if (!email || !product_id || !payment_method) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    // 1️⃣ Buscar usuario
    const userResult = await query(
      `SELECT id FROM users WHERE email = $1`,
      [decodedEmail]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    

    const userId = userResult.rows[0].id;
// 🔎 Verificar que tenga dirección
const addressCheck = await query(
  `
  SELECT street, city, zip_code, province
  FROM users
  WHERE id = $1
  `,
  [userId]
);

const userAddress = addressCheck.rows[0];

if (
  !userAddress.street ||
  !userAddress.city ||
  !userAddress.zip_code ||
  !userAddress.province
) {
  return NextResponse.json(
    { error: "Debes completar tu dirección antes de comprar" },
    { status: 400 }
  );
}
    // 2️⃣ Buscar producto
    const productResult = await query(
      `SELECT id, name, price FROM products WHERE id = $1`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    const total = Number(product.price);

    const orderNumber = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;

    // 3️⃣ Crear orden
    const orderInsert = await query(
      `
      INSERT INTO orders 
      (order_number, user_id, total_amount, currency, payment_method, payment_status, order_status)
      VALUES ($1, $2, $3, $4, $5, 'pending', 'pending_payment')
      RETURNING id
      `,
      [orderNumber, userId, total, "ARS", payment_method]
    );

    const orderId = orderInsert.rows[0].id;

    // 4️⃣ Insertar order_item único
    await query(
      `
      INSERT INTO order_items
      (order_id, product_id, product_name, unit_price, quantity, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        orderId,
        product.id,
        product.name,
        Number(product.price),
        1,
        Number(product.price),
      ]
    );

    // 5️⃣ Transferencia
    if (payment_method === "transfer") {
      return NextResponse.json({
        order_id: orderId,
        order_number: orderNumber,
      });
    }

    // 6️⃣ Mercado Pago
    if (payment_method === "mercadopago") {
      const preference = new Preference(mpClient);

      const response = await preference.create({
        body: {
          items: [
            {
              id: product.id.toString(),
              title: product.name,
              unit_price: Number(product.price),
              quantity: 1,
              currency_id: "ARS",
            },
          ],
          external_reference: orderId.toString(),
          notification_url: `https://iphones-e-commerce.vercel.app/api/webhooks/mercadopago`,
          back_urls: {
            success: `https://iphones-e-commerce.vercel.app/checkout/success`,
            failure: `https://iphones-e-commerce.vercel.app/checkout/failure`,
            pending: `https://iphones-e-commerce.vercel.app/checkout/pending`,
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
    console.error("Error buy-now:", error?.response?.data || error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}