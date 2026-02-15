import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  const { rows } = await query(`
    SELECT id, name, price, memory, color, quantity, description, image_1, image_2, image_3
    FROM products
  `);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { name, memory, color, quantity, description, price, image_1, image_2, image_3 } = await req.json();

  const { rows } = await query(
    `INSERT INTO products (name, memory, color, quantity, description, price, image_1, image_2, image_3)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [name, memory, color, quantity, description, price, image_1, image_2, image_3]
  );

  return NextResponse.json(rows[0]);
}