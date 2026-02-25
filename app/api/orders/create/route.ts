import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { email, payment_method } = await req.json();
    console.log("datos recibidos:", { email, payment_method})

    if (!email || !payment_method) {
      return NextResponse.json(
        { error: "Email y método de pago requeridos" },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    // 🔎 Validación crítica de entorno
    if (!process.env.MP_ACCESS_TOKEN) {
      console.error("MP_ACCESS_TOKEN no definido");
      return NextResponse.json(
        { error: "Error configuración Mercado Pago" },
        { status: 500 }
      );
    }

    if (!process.env.BASE_URL) {
      console.log("BASE_URL real:", JSON.stringify(process.env.BASE_URL));

      console.error("BASE_URL no definido");
      return NextResponse.json(
        { error: "Error configuración BASE_URL" },
        { status: 500 }
      );
    }

    // 1️⃣ Obtener user_id
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

    // 2️⃣ Obtener productos del carrito
    const cartResult = await query(
      `
      SELECT 
        products.id AS product_id,
        products.name,
        products.price,
        cart_items.quantity
      FROM cart
      INNER JOIN cart_items 
        ON cart_items.cart_id = cart.id
      INNER JOIN products 
        ON products.id = cart_items.product_id
      WHERE cart.user_id = $1
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Carrito vacío" },
        { status: 400 }
      );
    }

    const cartItems = cartResult.rows;

    // 3️⃣ Calcular total backend
    const total = cartItems.reduce(
      (acc: number, item: any) =>
        acc + Number(item.price) * Number(item.quantity),
      0
    );

    // 4️⃣ Generar order_number
    const orderNumber = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;

    // 5️⃣ Crear orden
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

    // 6️⃣ Insertar order_items
    for (const item of cartItems) {
      await query(
        `
        INSERT INTO order_items
        (order_id, product_id, product_name, unit_price, quantity, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          orderId,
          item.product_id,
          item.name,
          Number(item.price),
          Number(item.quantity),
          Number(item.price) * Number(item.quantity),
        ]
      );
    }

    // 7️⃣ Transferencia directa
    if (payment_method === "transfer") {
      return NextResponse.json({
        order_id: orderId,
        order_number: orderNumber,
      });
    }

    // 8️⃣ Mercado Pago
    if (payment_method === "mercadopago") {
      const preference = new Preference(mpClient);

      const response = await preference.create({
        body: {
          items: cartItems.map((item: any) => ({
            id: item.product_id.toString(),
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: "ARS",
          })),
          external_reference: orderId.toString(), // 🔥 FIX IMPORTANTE
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
    console.error("Error creando orden:", error?.cause || error);
    console.error("MP RESPONSE:", error?.response?.data);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
