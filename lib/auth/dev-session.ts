import type { AuthUser } from "@/lib/auth/types"

export const DEV_AUTH_SESSION_COOKIE = "aurora_dev_session"

export function isDevAuthBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_AUTH_BYPASS === "true"
  )
}

export const devAuthUser: AuthUser = {
  id: "dev-user",
  name: "Aurora Development User",
  email: "dev@aurora.local",
  username: "dev",
  role: "USER",
  createdAt: new Date(0).toISOString(),
}
