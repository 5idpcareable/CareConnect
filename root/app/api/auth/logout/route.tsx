import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("careable_session")?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  const response = NextResponse.json({
    message: "Logged out successfully.",
  });

  response.cookies.delete("careable_session");

  return response;
}
