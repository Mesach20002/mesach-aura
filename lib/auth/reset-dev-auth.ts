import fs from "node:fs"

import type Database from "better-sqlite3"

import {
  getDevAuthDatabasePath,
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

export type ResetDevAuthResult = {
  usersDeleted: number
  sessionsDeleted: number
  accountsDeleted: number
  verificationsDeleted: number
  failedLoginAttemptsDeleted: number
  reportsPreserved: boolean
  reportsUnlinked: number
  authStore: "sqlite" | "prisma" | "none"
}

const emptyResult: ResetDevAuthResult = {
  usersDeleted: 0,
  sessionsDeleted: 0,
  accountsDeleted: 0,
  verificationsDeleted: 0,
  failedLoginAttemptsDeleted: 0,
  reportsPreserved: true,
  reportsUnlinked: 0,
  authStore: "none",
}

type CountRow = {
  count: bigint | number
}

type IdRow = {
  id: string
}

export async function resetDevelopmentAuth(): Promise<ResetDevAuthResult> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Development auth reset is not available in production.")
  }

  if (shouldUseDevSqliteAuth() || fs.existsSync(getDevAuthDatabasePath())) {
    return resetSqliteDevelopmentAuth()
  }

  if (isPrismaAvailable) {
    return resetPrismaDevelopmentAuth()
  }

  return emptyResult
}

function resetSqliteDevelopmentAuth(): ResetDevAuthResult {
  const db = getDevAuthSqlite()
  const userIds = db.prepare("SELECT id FROM user").all() as IdRow[]
  const result: ResetDevAuthResult = {
    ...emptyResult,
    authStore: "sqlite",
    usersDeleted: getSqliteCount(db, "user"),
    sessionsDeleted: getSqliteCount(db, "session"),
    accountsDeleted: getSqliteCount(db, "account"),
    verificationsDeleted: getSqliteCount(db, "verification"),
  }

  db.transaction(() => {
    db.prepare("DELETE FROM verification").run()
    db.prepare("DELETE FROM session").run()
    db.prepare("DELETE FROM account").run()
    db.prepare("DELETE FROM user").run()
  })()

  result.reportsUnlinked = unlinkMockReports(userIds.map((row) => row.id))

  return result
}

async function resetPrismaDevelopmentAuth(): Promise<ResetDevAuthResult> {
  const prisma = getPrismaClient()
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  })
  const userIds = users.map((user) => user.id)

  const [
    sessionsDeleted,
    verificationsDeleted,
    accountsDeleted,
    reportsUnlinked,
  ] = await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.account.deleteMany(),
    prisma.skinReport.updateMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      data: {
        userId: null,
      },
    }),
    prisma.consentRecord.updateMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      data: {
        userId: null,
      },
    }),
    prisma.auditLog.updateMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      data: {
        userId: null,
      },
    }),
  ])

  const usersDeleted = await prisma.user.deleteMany({
    where: {
      id: {
        in: userIds,
      },
    },
  })

  return {
    ...emptyResult,
    authStore: "prisma",
    usersDeleted: usersDeleted.count,
    sessionsDeleted: sessionsDeleted.count,
    accountsDeleted: accountsDeleted.count,
    verificationsDeleted: verificationsDeleted.count,
    reportsUnlinked: reportsUnlinked.count,
  }
}

function getSqliteCount(db: Database.Database, table: string): number {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as
    | CountRow
    | undefined

  return Number(row?.count ?? 0)
}

function unlinkMockReports(userIds: string[]): number {
  if (userIds.length === 0) {
    return 0
  }

  const globalForMockReports = globalThis as unknown as {
    auroraMockReports?: Map<string, { userId?: string | null }>
  }
  const reports = globalForMockReports.auroraMockReports

  if (!reports) {
    return 0
  }

  let unlinked = 0
  const deletedUserIds = new Set(userIds)

  for (const report of reports.values()) {
    if (report.userId && deletedUserIds.has(report.userId)) {
      report.userId = null
      unlinked += 1
    }
  }

  return unlinked
}
