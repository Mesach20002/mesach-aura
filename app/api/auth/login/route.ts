import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import {
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

type LoginRequestBody = {
  identifier?: unknown
  password?: unknown
  rememberMe?: unknown
  callbackURL?: unknown
}

type ExistingAuthIdentity = {
  exists: boolean
  kind: "email" | "username"
  value: string
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
  let body: LoginRequestBody

  try {
    body = (await request.json()) as LoginRequestBody
  } catch {
    return jsonError("We couldn't sign you in right now. Please try again.")
  }

  const identifier = getString(body.identifier)
  const password = typeof body.password === "string" ? body.password : ""
  const callbackURL = getSafeCallbackURL(body.callbackURL)
  const rememberMe = body.rememberMe === true

  if (!identifier) {
    return jsonError("Please enter your email address.")
  }

  if (!password) {
    return jsonError("Please enter your password.")
  }

  const identity = await findExistingAuthIdentity(identifier)

  if (!identity.exists) {
    return jsonError("No Aurora Account exists with that email address.", 404)
  }

  const signInUrl =
    identity.kind === "email"
      ? new URL("/api/auth/sign-in/email", request.url)
      : new URL("/api/auth/sign-in/username", request.url)
  const signInBody =
    identity.kind === "email"
      ? {
          email: identity.value,
          password,
          rememberMe,
          callbackURL,
        }
      : {
          username: identity.value,
          password,
          rememberMe,
          callbackURL,
        }
  const signInHeaders = new Headers(request.headers)
  signInHeaders.set("content-type", "application/json")
  const signInResponse = await auth.handler(
    new Request(signInUrl, {
      method: "POST",
      headers: signInHeaders,
      body: JSON.stringify(signInBody),
    })
  )

  if (!signInResponse.ok) {
    const response = jsonError(
      "The email/username or password you entered is incorrect.",
      signInResponse.status === 429 ? 429 : 401
    )

    signInResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value)
      }
    })

    return response
  }

  return signInResponse
}

async function findExistingAuthIdentity(
  rawIdentifier: string
): Promise<ExistingAuthIdentity> {
  const isEmail = rawIdentifier.includes("@")
  const value = isEmail ? rawIdentifier.toLowerCase() : rawIdentifier

  if (shouldUseDevSqliteAuth()) {
    const db = getDevAuthSqlite()
    const user = db
      .prepare(
        isEmail
          ? "SELECT id FROM user WHERE lower(email) = ? LIMIT 1"
          : "SELECT id FROM user WHERE username = ? LIMIT 1"
      )
      .get(value) as { id: string } | undefined

    return {
      exists: Boolean(user),
      kind: isEmail ? "email" : "username",
      value,
    }
  }

  if (isPrismaAvailable) {
    const prisma = getPrismaClient()
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: value } : { username: value },
      select: { id: true },
    })

    return {
      exists: Boolean(user),
      kind: isEmail ? "email" : "username",
      value,
    }
  }

  return {
    exists: false,
    kind: isEmail ? "email" : "username",
    value,
  }
}
