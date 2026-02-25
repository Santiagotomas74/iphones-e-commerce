import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { query } from "@/db";

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTech")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const body = await req.json();

    const existing = await query(
      `SELECT id FROM users WHERE id = $1`,
      [userId]
    );

    if (existing.rows.length > 0) {
      await query(
        `
        UPDATE users
        SET street=$1, altura=$2, zip_code=$3, city=$4, province=$5, address_description=$6
        WHERE id=$7
        `,
        [
          body.street,
          body.altura,
          body.zip_code,
          body.city,
          body.province,
          body.address_description,
          userId,
        ]
      );
    } else {
      await query(
        `
        INSERT INTO users
        (street, altura, zip_code, city, province, address_description, id)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          body.street,
          body.altura,
          body.zip_code,
          body.city,
          body.province,
          body.address_description,
          userId,
        ]
      );
    }

    return NextResponse.json({
      address: body,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error actualizando dirección" },
      { status: 500 }
    );
  }
}