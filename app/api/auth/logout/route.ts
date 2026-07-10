import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"

export async function POST(request: Request) {
  const signOutUrl = new URL("/api/auth/sign-out", request.url)
  const signOutResponse = await auth.handler(
    new Request(signOutUrl, {
      method: "POST",
      headers: request.headers,
    })
  )
  const redirectResponse = NextResponse.redirect(new URL("/", request.url), {
    status: 303,
  })

  signOutResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      redirectResponse.headers.append(key, value)
    }
  })

  return redirectResponse
}
