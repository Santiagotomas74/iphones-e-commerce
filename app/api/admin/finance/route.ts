import { NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.payment_method,
        o.paid_at,
        u.email as user_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.payment_status = 'approved'
      ORDER BY o.paid_at DESC
    `);

    // Totales generales
    const totals = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
      WHERE payment_status = 'approved'
    `);

    // Totales por mes
    const monthly = await query(`
      SELECT 
        TO_CHAR(paid_at, 'YYYY-MM') as month,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE payment_status = 'approved'
      GROUP BY month
      ORDER BY month DESC
    `);

    return NextResponse.json({
      orders: result.rows,
      summary: totals.rows[0],
      monthly: monthly.rows
    });

  } catch (error) {
    console.error("Finance error:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}