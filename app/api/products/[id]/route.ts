import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";

// 🔹 GET producto por ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    console.log("ID recibido en GET:", id);

    const { rows } = await query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error("Error en GET product:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const {
    name,
    memory,
    color,
    quantity,
    description,
    price,
    image_1,
    image_2,
    image_3,
  } = await req.json();
  console.log("Datos recibidos en PUT:", {
    name,
    memory,
    color,
    quantity,
    description,
    price,
    image_1,
    image_2,
    image_3,
  });
  

  const { rows } = await query(
    `UPDATE products
     SET name=$1, memory=$2, color=$3, quantity=$4, description=$5, price=$6, image_1=$7, image_2=$8, image_3=$9
     WHERE id=$10
     RETURNING *`,
    [
      name,
      memory,
      color,
      quantity,
      description,
      price,
      image_1,
      image_2,
      image_3,
      id,
    ]
  );

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await query(`DELETE FROM products WHERE id=$1`, [id]);

  return NextResponse.json({ success: true });
}
