import { cookies } from "next/headers";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tokenTtech")?.value;

  if (!token) {
    return Response.json(
      { error: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    return Response.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      },
    });

  } catch (error) {

    // TOKEN EXPIRADO
    if (error instanceof TokenExpiredError) {
      return Response.json(
        { error: "TokenExpired" },
        { status: 401 }
      );
    }

    // TOKEN INVÁLIDO
    return Response.json(
      { error: "InvalidToken" },
      { status: 401 }
    );
  }
}