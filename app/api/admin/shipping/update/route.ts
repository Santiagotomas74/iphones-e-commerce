import { NextResponse } from "next/server";
import { query } from "@/db";

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    await query(
      `
      UPDATE orders
      SET order_status = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [status, orderId]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando estado" },
      { status: 500 }
    );
  }
}