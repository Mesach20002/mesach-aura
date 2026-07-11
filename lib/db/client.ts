import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

import { shouldUseDevSqliteAuth } from "@/lib/auth/dev-auth-db"

const placeholderDatabaseUrl =
  "postgresql://USER:PASSWORD@localhost:5432/aurora_skinsense?schema=public"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

function shouldUseMockMode(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    (process.env.DEV_AUTH_BYPASS === "true" || shouldUseDevSqliteAuth())
  )
}

export function getDatabaseUrl(): string | null {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl || databaseUrl === placeholderDatabaseUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL must be configured for production.")
    }

    return null
  }

  if (shouldUseMockMode()) {
    return null
  }

  return databaseUrl
}

export const isPrismaAvailable = Boolean(getDatabaseUrl())

export function getPrismaClient(): PrismaClient {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured for Prisma.")
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(databaseUrl)

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : [],
    })
  }

  return globalForPrisma.prisma
}
