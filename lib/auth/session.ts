import {
  AdminRequiredError,
  AuthRequiredError,
  type AuthUser,
  type UserRole,
} from "@/lib/auth/types"
import { auth } from "@/lib/auth/auth"
import { shouldUseDevSqliteAuth } from "@/lib/auth/dev-auth-db"
import {
  DEV_AUTH_SESSION_COOKIE,
  devAuthUser,
  isDevAuthBypassEnabled,
} from "@/lib/auth/dev-session"
import { isPrismaAvailable } from "@/lib/db/client"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

type BetterAuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>

type BetterAuthUser = BetterAuthSession["user"] & {
  role?: unknown
  username?: unknown
  createdAt?: unknown
}

function parseUserRole(value: unknown): UserRole {
  if (value === "ADMIN" || value === "DERMATOLOGIST" || value === "USER") {
    return value
  }

  return "USER"
}

function mapAuthUser(user: BetterAuthUser): AuthUser {
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    role: parseUserRole(user.role),
    username: typeof user.username === "string" ? user.username : null,
    createdAt: formatAuthDate(user.createdAt),
  }
}

function formatAuthDate(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return typeof value === "string" ? value : null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (isDevAuthBypassEnabled()) {
    const cookieStore = await cookies()
    const devSession = cookieStore.get(DEV_AUTH_SESSION_COOKIE)

    if (devSession?.value === "enabled") {
      return devAuthUser
    }
  }

  if (!isPrismaAvailable && !shouldUseDevSqliteAuth()) {
    return null
  }

  let session: BetterAuthSession | null = null

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Invalid or expired Aurora session.", error)
    }

    return null
  }

  return session ? mapAuthUser(session.user as BetterAuthUser) : null
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard")
  }

  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new AuthRequiredError()
  }

  if (user.role !== "ADMIN") {
    throw new AdminRequiredError()
  }

  return user
}
