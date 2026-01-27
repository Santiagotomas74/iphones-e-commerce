import { NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  const { rows } = await query(`
    SELECT id, name, price, memory, color, quantity, description, image_1, image_2, image_3
    FROM products
  `);

  return NextResponse.json(rows);
}
