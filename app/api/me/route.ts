import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("tokenTech");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  // validar JWT acá
  return Response.json({
    user: {
      name: "Juanfer"
    }
  });
}