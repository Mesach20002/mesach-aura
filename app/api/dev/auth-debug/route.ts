import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"
import {
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

type AuthDebugRecord = {
  userExists: boolean
  authAccountExists: boolean
  passwordHashPresent: boolean
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

  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null)

  const record = identifier
    ? await getAuthDebugRecord(identifier)
    : {
        userExists: false,
        authAccountExists: false,
        passwordHashPresent: false,
      }

  return NextResponse.json({
    session,
    record,
    backend,
    identifier,
  })
}

async function getAuthDebugRecord(identifier: string): Promise<AuthDebugRecord> {
  if (shouldUseDevSqliteAuth()) {
    return getSqliteAuthDebugRecord(identifier)
  }

  if (isPrismaAvailable) {
    return getPrismaAuthDebugRecord(identifier)
  }

  return {
    userExists: false,
    authAccountExists: false,
    passwordHashPresent: false,
  }
}

async function getSqliteAuthDebugRecord(identifier: string): Promise<AuthDebugRecord> {
  try {
    const db = getDevAuthSqlite()
    
    const userResult = db.prepare(
      `SELECT id FROM user WHERE email = ? OR username = ? LIMIT 1`
    ).get(identifier, identifier) as { id: string } | undefined

    if (!userResult) {
      return {
        userExists: false,
        authAccountExists: false,
        passwordHashPresent: false,
      }
    }

    const accountResult = db.prepare(
      `SELECT password FROM account WHERE userId = ? LIMIT 1`
    ).get(userResult.id) as { password: string | null } | undefined

    return {
      userExists: true,
      authAccountExists: !!accountResult,
      passwordHashPresent: !!accountResult?.password,
    }
  } catch {
    return {
      userExists: false,
      authAccountExists: false,
      passwordHashPresent: false,
    }
  }
}

async function getPrismaAuthDebugRecord(identifier: string): Promise<AuthDebugRecord> {
  try {
    const prisma = getPrismaClient()
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
      include: {
        accounts: {
          select: {
            password: true,
          },
        },
      },
    })

    if (!user) {
      return {
        userExists: false,
        authAccountExists: false,
        passwordHashPresent: false,
      }
    }

    const hasPasswordAccount = user.accounts.some(
      (account: { password: string | null }) => Boolean(account.password)
    )

    return {
      userExists: true,
      authAccountExists: user.accounts.length > 0,
      passwordHashPresent: hasPasswordAccount,
    }
  } catch {
    return {
      userExists: false,
      authAccountExists: false,
      passwordHashPresent: false,
    }
  }
}
