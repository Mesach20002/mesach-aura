import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

type ResetDevelopmentAuthResult =
  { success: true } | { success: false; error: string }

const testUsers = [
  {
    email: "admin@test.com",
    username: "admin",
    name: "Admin User",
    role: UserRole.ADMIN,
  },
  {
    email: "user@test.com",
    username: "user",
    name: "Test User",
    role: UserRole.USER,
  },
  {
    email: "doctor@test.com",
    username: "doctor",
    name: "Doctor User",
    role: UserRole.DERMATOLOGIST,
  },
] as const

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export async function resetDevelopmentAuth(): Promise<ResetDevelopmentAuthResult> {
  if (process.env.NODE_ENV !== "development") {
    return {
      success: false,
      error: "Authentication reset is available only in development.",
    }
  }

  try {
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})

    for (const testUser of testUsers) {
      const password = await bcrypt.hash("password123", 10)
      const user = await prisma.user.create({
        data: {
          email: testUser.email,
          username: testUser.username,
          name: testUser.name,
          role: testUser.role,
          emailVerified: true,
          accounts: {
            create: {
              accountId: testUser.email,
              providerId: "credentials",
              password,
            },
          },
        },
        include: {
          accounts: true,
        },
      })

      console.log(`Created user: ${user.email} with ID: ${user.id}`)
    }

    console.log("Dev auth reset completed successfully!")
    return { success: true }
  } catch (error: unknown) {
    const message = getErrorMessage(error)
    console.error("Error resetting dev auth:", message)
    return { success: false, error: message }
  }
}

export async function resetDevAuth(): Promise<ResetDevelopmentAuthResult> {
  return resetDevelopmentAuth()
}
