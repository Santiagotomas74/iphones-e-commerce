import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("tokenTech")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as any;

    return Response.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      },
    });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
}