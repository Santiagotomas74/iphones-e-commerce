import { NextResponse } from "next/server";
import { query } from "@/db";
import { mpClient } from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const {
      email,
      payment_method,
      delivery_type,
      shipping_cost = 0,
      address,
    } = await req.json();

    if (!email || !payment_method || !delivery_type) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

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

    // 2️⃣ Obtener carrito
    const cartResult = await query(
      `
      SELECT 
        products.id AS product_id,
        products.name,
        products.price,
        cart_items.quantity
      FROM cart
      INNER JOIN cart_items ON cart_items.cart_id = cart.id
      INNER JOIN products ON products.id = cart_items.product_id
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

    // 3️⃣ Validación de dirección si es shipping
    if (delivery_type === "shipping") {
      if (
        !address ||
        !address.full_name ||
        !address.street ||
        !address.street_number ||
        !address.city ||
        !address.province ||
        !address.postal_code
      ) {
        return NextResponse.json(
          { error: "Dirección incompleta" },
          { status: 400 }
        );
      }
    }

    // 4️⃣ Calcular total backend
    const productsTotal = cartItems.reduce(
      (acc: number, item: any) =>
        acc + Number(item.price) * Number(item.quantity),
      0
    );

    const finalShipping =
      delivery_type === "shipping" ? Number(shipping_cost) : 0;

    const total = productsTotal + finalShipping;

    // 5️⃣ Generar número orden
    const orderNumber = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;

    // 6️⃣ Insertar orden
    const orderInsert = await query(
      `
      INSERT INTO orders 
      (order_number, user_id, total_amount, currency, payment_method, 
       payment_status, order_status, delivery_type, shipping_cost)
      VALUES ($1, $2, $3, 'ARS', $4, 'pending', 'pending_payment', $5, $6)
      RETURNING id
      `,
      [
        orderNumber,
        userId,
        total,
        payment_method,
        delivery_type,
        finalShipping,
      ]
    );

    const orderId = orderInsert.rows[0].id;

    // 7️⃣ Insertar order_items
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

    // 8️⃣ Guardar dirección si aplica
    if (delivery_type === "shipping") {
      await query(
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

    // 9️⃣ Transferencia
    if (payment_method === "transfer") {
      return NextResponse.json({
        order_id: orderId,
        order_number: orderNumber,
      });
    }

    // 🔟 Mercado Pago
    if (payment_method === "mercadopago") {
      const preference = new Preference(mpClient);

      const response = await preference.create({
        body: {
          items: [
            ...cartItems.map((item: any) => ({
              id: item.product_id.toString(),
              title: item.name,
              unit_price: Number(item.price),
              quantity: Number(item.quantity),
              currency_id: "ARS",
            })),
            ...(delivery_type === "shipping"
              ? [
                  {
                    id: "shipping",
                    title: "Costo de envío",
                    unit_price: finalShipping,
                    quantity: 1,
                    currency_id: "ARS",
                  },
                ]
              : []),
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
    console.error("Error creando orden:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}