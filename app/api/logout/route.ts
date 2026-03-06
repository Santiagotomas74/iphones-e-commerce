import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  (await cookieStore).set("tokenTtech", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  (await cookieStore).set("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return NextResponse.json({
    message: "Logout successful",
  });
}