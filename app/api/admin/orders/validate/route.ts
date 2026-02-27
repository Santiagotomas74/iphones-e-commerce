import { NextResponse } from "next/server";
import { query } from "@/db";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    console.log("Validando orden:", orderId);

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId requerido" },
        { status: 400 }
      );
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

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Error validando orden" },
      { status: 500 }
    );
  }
}