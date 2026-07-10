import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"
import {
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

type SqliteAuthDebugRow = {
  userExists: number
  authAccountExists: number
  passwordHashPresent: number
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const identifier = searchParams.get("identifier")?.trim() ?? ""
  const backend = shouldUseDevSqliteAuth()
    ? "better-auth-sqlite"
    : isPrismaAvailable
      ? "better-auth-prisma"
      : "unconfigured"
  const session = await auth.api
    .getSession({
      headers: await headers(),
    })
    .catch(() => null)
  const record = identifier
    ? await getAuthDebugRecord(identifier)
    : {
        userExists: false,
        authAccountExists: false,
        passwordHashPresent: false,
      }

  return NextResponse.json({
    registrationBackend: backend,
    loginBackend: backend,
    userExists: record.userExists,
    authAccountExists: record.authAccountExists,
    sessionCreated: Boolean(session),
    passwordHashPresent: record.passwordHashPresent,
  })
}

async function getAuthDebugRecord(identifier: string) {
  const isEmail = identifier.includes("@")
  const value = isEmail ? identifier.toLowerCase() : identifier

  if (shouldUseDevSqliteAuth()) {
    const db = getDevAuthSqlite()
    const row = db
      .prepare(
        `
          SELECT
            COUNT(DISTINCT user.id) AS userExists,
            COUNT(account.id) AS authAccountExists,
            COUNT(CASE WHEN account.password IS NOT NULL THEN 1 END) AS passwordHashPresent
          FROM user
          LEFT JOIN account ON account.userId = user.id
          WHERE ${isEmail ? "lower(user.email) = ?" : "user.username = ?"}
        `
      )
      .get(value) as SqliteAuthDebugRow

    return {
      userExists: row.userExists > 0,
      authAccountExists: row.authAccountExists > 0,
      passwordHashPresent: row.passwordHashPresent > 0,
    }
  }

  if (isPrismaAvailable) {
    const prisma = getPrismaClient()
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: value } : { username: value },
      select: {
        accounts: {
          select: {
            password: true,
          },
        },
      },
    })

    return {
      userExists: Boolean(user),
      authAccountExists: Boolean(user?.accounts.length),
      passwordHashPresent:
        user?.accounts.some((account) => Boolean(account.password)) ?? false,
    }
  }

  return {
    userExists: false,
    authAccountExists: false,
    passwordHashPresent: false,
  }
}
