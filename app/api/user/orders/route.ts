import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/db";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTech")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const result = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.order_status,
        o.delivery_type,
        o.created_at,

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

      LEFT JOIN order_addresses a ON a.order_id = o.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id

      WHERE o.user_id = $1
      AND o.payment_status = 'paid'

      GROUP BY 
        o.id,
        a.street,
        a.city,
        a.postal_code,
        a.full_name,
        a.phone,
        a.street_number,
        a.apartment,
        a.province,
        a.additional_info

      ORDER BY o.created_at DESC
    `, [decoded.id]);

    return NextResponse.json({
      orders: result.rows
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}