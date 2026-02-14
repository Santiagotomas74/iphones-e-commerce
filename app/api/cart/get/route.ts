import { NextResponse } from "next/server";
import { query } from "@/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    

    const decodedEmail = decodeURIComponent(email);
    console.log("Email recibido en API:", decodedEmail);


    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    const result = await query(
      `
      SELECT 
        products.id AS product_id,
        products.name,
        products.memory,
        products.color,
        products.price,
        products.name,
        products.image_1,
        cart_items.quantity
      FROM users
      INNER JOIN cart 
        ON cart.user_id = users.id
      INNER JOIN cart_items 
        ON cart_items.cart_id = cart.id
      INNER JOIN products 
        ON products.id = cart_items.product_id
      WHERE users.email = $1
      `,
      [decodedEmail]
    );
    console.log("Resultado de la consulta:", result.rows);
    return NextResponse.json({
      items: result.rows,
    });

  } catch (error) {
    console.error("Error obteniendo carrito:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
