import { NextResponse } from "next/server"

import { resetDevelopmentAuth } from "@/lib/auth/reset-dev-auth"

export const runtime = "nodejs"

const authCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.dont_remember",
  "__Secure-better-auth.dont_remember",
  "aurora-dev-auth",
]

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 })
  }

  const result = await resetDevelopmentAuth()
  const response = NextResponse.json(result)

  for (const cookieName of authCookieNames) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 0,
    })
  }

  return response
}
