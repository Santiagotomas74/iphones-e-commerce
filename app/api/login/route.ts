import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    console.log("Login API called");
    const { email, password } = await req.json();

    // 1. buscar usuario
    const { rows } = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // 2. comparar password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }
   console.log(isValid ? "Password válido" : "Password inválido");
    // 3. generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2d" }
    );

    // 4. guardarlo en cookie segura
     const response = NextResponse.json({
      success: true,
      role: user.role,
    });

     response.cookies.set("emailTech", user.email, {
      httpOnly: false,
  });

    response.cookies.set("tokenTech", token, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en login" },
      { status: 500 }
    );
  }
}
