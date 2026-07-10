import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const placeholderDatabaseUrl =
  "postgresql://USER:PASSWORD@localhost:5432/aurora_skinsense?schema=public"

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl || databaseUrl === placeholderDatabaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Set it to a real PostgreSQL connection string before checking users."
    )
  }

  return databaseUrl
}

function getIdentifier(): string {
  const identifier = process.argv[2]?.trim()

  if (!identifier) {
    throw new Error(
      'Usage: npx tsx scripts/check-auth-user.ts "user@example.com"'
    )
  }

  return identifier
}

async function main() {
  const identifier = getIdentifier()
  const adapter = new PrismaPg(getDatabaseUrl())
  const prisma = new PrismaClient({ adapter })

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { username: identifier }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      accounts: {
        select: {
          id: true,
          providerId: true,
          password: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          reports: true,
          sessions: true,
          accounts: true,
        },
      },
    },
  })

  if (!user) {
    console.log(JSON.stringify({ exists: false }, null, 2))
    await prisma.$disconnect()
    return
  }

  const passwordAccountCount = user.accounts.filter(
    (account) => Boolean(account.password)
  ).length

  console.log(
    JSON.stringify(
      {
        exists: true,
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        hasPasswordHash: passwordAccountCount > 0,
        passwordHashField: "Account.password",
        authAccountCount: user._count.accounts,
        passwordAccountCount,
        activeSessionCount: user._count.sessions,
        reportCount: user._count.reports,
        authProviders: user.accounts.map((account) => ({
          id: account.id,
          providerId: account.providerId,
          hasPasswordHash: Boolean(account.password),
          createdAt: account.createdAt.toISOString(),
        })),
      },
      null,
      2
    )
  )

  await prisma.$disconnect()
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unable to check user.")
  process.exit(1)
})
