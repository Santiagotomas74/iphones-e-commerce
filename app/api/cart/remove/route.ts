import { NextResponse } from "next/server";
import { query } from "@/db";

export async function DELETE(req: Request) {
  try {
    const { email, product_id } = await req.json();
    const decodedEmail = decodeURIComponent(email);
   

    if (!email || !product_id) {
      return NextResponse.json(
        { error: "Email y product_id requeridos" },
        { status: 400 }
      );
    }

    await query(
      `
      DELETE FROM cart_items
      USING cart, users
      WHERE cart_items.cart_id = cart.id
      AND cart.user_id = users.id
      AND users.email = $1
      AND cart_items.product_id = $2
      `,
      [decodedEmail, product_id]
    );

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
