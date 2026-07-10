import { NextResponse } from "next/server"

import {
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

type CountRow = {
  count: bigint | number
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 })
  }

  const counts = await getAuthCounts()

  return NextResponse.json({
    provider: shouldUseDevSqliteAuth() ? "better-auth-sqlite" : "better-auth",
    ...counts,
    registrationConnected: true,
    loginConnected: true,
  })
}

async function getAuthCounts() {
  if (shouldUseDevSqliteAuth()) {
    const db = getDevAuthSqlite()

    return {
      userCount: getSqliteCount(db, "user"),
      sessionCount: getSqliteCount(db, "session"),
      accountCount: getSqliteCount(db, "account"),
      verificationCount: getSqliteCount(db, "verification"),
    }
  }

  if (!isPrismaAvailable) {
    return {
      userCount: 0,
      sessionCount: 0,
      accountCount: 0,
      verificationCount: 0,
    }
  }

  const prisma = getPrismaClient()
  const [userCount, sessionCount, accountCount, verificationCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.account.count(),
      prisma.verification.count(),
    ])

  return {
    userCount,
    sessionCount,
    accountCount,
    verificationCount,
  }
}

function getSqliteCount(db: ReturnType<typeof getDevAuthSqlite>, table: string) {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as CountRow

  return Number(row.count)
}
