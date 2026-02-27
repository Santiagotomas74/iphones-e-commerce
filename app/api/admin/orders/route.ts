import { NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      `
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.payment_receipt_url,
        u.email as user_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.payment_method = 'transfer'
      AND o.payment_status = 'receipt_uploaded'
      ORDER BY o.created_at DESC
      `
    );

    return NextResponse.json({ orders: result.rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}