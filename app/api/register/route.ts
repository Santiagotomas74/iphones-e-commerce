import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    console.log("Login API called");
    const { name, email, password, phone } = await req.json();
    
    const existingUser = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length > 0) {
        return NextResponse.json(
            { error: "Email ya registrado" },
            { status: 400 }
        );
    }

    const newPass = await bcrypt.hash(password, 10);
    const role = "user"; // Asignar rol por defecto
    const { rows } = await query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, newPass, phone, role]
  );
 



    

    return NextResponse.json(
        { message: "Usuario registrado exitosamente", user: rows[0] },
        { status: 201 }
    );
    
    } catch (error) {
        console.error("Error en el registro:", error);
        return NextResponse.json(
            { error: "Error en el registro" },
            { status: 500 }
        );
    }         
 }         
