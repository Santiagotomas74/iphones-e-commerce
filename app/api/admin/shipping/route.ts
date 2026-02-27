import { NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.order_status,
        o.delivery_type,
        o.created_at,
        u.email as user_email,

        -- Dirección (puede ser null si es retiro)
        json_build_object(
          'full_name', a.full_name,
          'phone', a.phone,
          'street', a.street,
          'number', a.street_number,
          'apartment', a.apartment,
          'city', a.city,
          'province', a.province,
          'postal_code', a.postal_code,
          'additional_info', a.additional_info
        ) AS address,

        -- Productos
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', p.id,
              'product_name', p.name,
              'product_memory', p.memory,
              'product_color', p.color,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS items

      FROM orders o

      JOIN users u ON u.id = o.user_id

      LEFT JOIN order_addresses a ON a.order_id = o.id

      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id

      WHERE o.payment_status = 'approved'

      GROUP BY 
        o.id,
        u.email,
        a.full_name,
        a.phone,
        a.street,
        a.street_number,
        a.apartment,
        a.city,
        a.province,
        a.postal_code,
        a.additional_info

      ORDER BY o.created_at ASC
    `);

    return NextResponse.json({
      orders: result.rows,
    });

  } catch (error) {
    console.error("Error admin shipping:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}