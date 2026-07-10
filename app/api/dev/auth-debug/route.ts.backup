import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth/auth"
import {
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

// Define types
type AuthDebugRecord = {
  userExists: boolean
  authAccountExists: boolean
  passwordHashPresent: boolean
}

type SqliteAuthDebugRow = {
  userExists: number
  authAccountExists: number
  passwordHashPresent: number
}

type Account = {
  password?: string | null
  // Add other account properties if needed
}

type User = {
  accounts: Account[]
  // Add other user properties if needed
}

export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const identifier = searchParams.get("identifier")?.trim() ?? ""
  
  // Determine backend
  const backend = shouldUseDevSqliteAuth()
    ? "better-auth-sqlite"
    : isPrismaAvailable
    ? "better-auth-prisma"
    : "unconfigured"

  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null)

  // Get auth debug record
  const record = identifier
    ? await getAuthDebugRecord(identifier)
    : {
        userExists: false,
        authAccountExists: false,
        passwordHashPresent: false,
      }

  // Return response
  return NextResponse.json({
    session,
    record,
    backend,
    identifier,
    isDevelopment: process.env.NODE_ENV === "development",
  })
}

// Helper function to get auth debug record
async function getAuthDebugRecord(identifier: string): Promise<AuthDebugRecord> {
  // Check if using SQLite backend
  if (shouldUseDevSqliteAuth()) {
    return getSqliteAuthDebugRecord(identifier)
  }

  // Check if Prisma is available
  if (isPrismaAvailable) {
    return getPrismaAuthDebugRecord(identifier)
  }

  // Fallback: no backend available
  return {
    userExists: false,
    authAccountExists: false,
    passwordHashPresent: false,
  }
}

// Get SQLite auth debug record
async function getSqliteAuthDebugRecord(identifier: string): Promise<AuthDebugRecord> {
  try {
    const db = getDevAuthSqlite()
    
    // Query for user
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

    // Query for account
    const accountResult = db.prepare(
      `SELECT password FROM account WHERE userId = ? LIMIT 1`
    ).get(userResult.id) as { password: string | null } | undefined

    return {
      userExists: true,
      authAccountExists: !!accountResult,
      passwordHashPresent: !!accountResult?.password,
    }
  } catch (error) {
    console.error("Error getting SQLite auth debug record:", error)
    return {
      userExists: false,
      authAccountExists: false,
      passwordHashPresent: false,
    }
  }
}

// Get Prisma auth debug record
async function getPrismaAuthDebugRecord(identifier: string): Promise<AuthDebugRecord> {
  try {
    const prisma = getPrismaClient()
    
    // Find user
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

    // Check if user has accounts with password
    const hasPasswordAccount = user.accounts.some(
      (account: Account) => Boolean(account.password)
    )

    return {
      userExists: true,
      authAccountExists: user.accounts.length > 0,
      passwordHashPresent: hasPasswordAccount,
    }
  } catch (error) {
    console.error("Error getting Prisma auth debug record:", error)
    return {
      userExists: false,
      authAccountExists: false,
      passwordHashPresent: false,
    }
  }
}
