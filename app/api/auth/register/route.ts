import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import {
  DEV_AUTH_SESSION_COOKIE,
  isDevAuthBypassEnabled,
} from "@/lib/auth/dev-session"
import { shouldUseDevSqliteAuth } from "@/lib/auth/dev-auth-db"
import { isPrismaAvailable } from "@/lib/db/client"

type RegisterRequestBody = {
  name?: unknown
  username?: unknown
  email?: unknown
  password?: unknown
  callbackURL?: unknown
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function getSafeCallbackURL(value: unknown): string {
  const callbackURL = getString(value)

  if (!callbackURL || !callbackURL.startsWith("/") || callbackURL.startsWith("//")) {
    return "/dashboard"
  }

  return callbackURL
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  let body: RegisterRequestBody

  try {
    body = (await request.json()) as RegisterRequestBody
  } catch {
    return jsonError("Please submit valid registration details.")
  }

  const name = getString(body.name)
  const username = getString(body.username)
  const email = getString(body.email).toLowerCase()
  const password = typeof body.password === "string" ? body.password : ""
  const callbackURL = getSafeCallbackURL(body.callbackURL)

  if (!name || !email || !password) {
    return jsonError("Please enter your name, email, and password.")
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError("Please enter a valid email address.")
  }

  if (password.length < 8) {
    return jsonError("Password must be at least 8 characters long.")
  }

  if (username && !/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
    return jsonError(
      "Username must be 3 to 30 characters and use only letters, numbers, dots, dashes, or underscores."
    )
  }

  if (!isPrismaAvailable && !shouldUseDevSqliteAuth()) {
    if (!isDevAuthBypassEnabled()) {
      return jsonError(
        "Account creation backend is not connected yet. Configure DATABASE_URL or enable DEV_AUTH_BYPASS=true only in local development.",
        503
      )
    }

    const response = NextResponse.json({
      ok: true,
      devSession: true,
      redirectTo: callbackURL,
    })

    response.cookies.set(DEV_AUTH_SESSION_COOKIE, "enabled", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    })

    return response
  }

  const signUpBody: Record<string, string> = {
    name,
    email,
    password,
    callbackURL,
  }

  if (username) {
    signUpBody.username = username
  }

  const signUpRequest = new Request(new URL("/api/auth/sign-up/email", request.url), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(signUpBody),
  })

  return auth.handler(signUpRequest)
}
