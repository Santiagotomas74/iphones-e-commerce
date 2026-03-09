import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { query } from "@/db";

type TokenPayload = {
  id: number;
  role?: string;
};

export async function GET() {
  console.log("GET /api/user/me - Verificando token...");
    const cookieStore = cookies();
    const token = (await cookieStore).get("tokenTtech")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;


    const result = await query(
      `
      SELECT 
        u.name,
        u.lastname,
        COALESCE(SUM(ci.quantity),0) AS total_items
      FROM users u
      LEFT JOIN cart c ON c.user_id = u.id
      LEFT JOIN cart_items ci ON ci.cart_id = c.id
      WHERE u.id = $1
      GROUP BY u.name, u.lastname
      `,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      full_name: `${user.name} ${user.lastname}`,
      cart_items_count: Number(user.total_items),
    });

  } catch (error) {
    // TOKEN EXPIRADO
        if (error instanceof TokenExpiredError) {
          return NextResponse.json(
            { error: "TokenExpired" },
            { status: 401 }
          );
        }
    
        // TOKEN INVÁLIDO
        return NextResponse.json(
          { error: "InvalidToken" },
          { status: 401 }
        );
      }
}