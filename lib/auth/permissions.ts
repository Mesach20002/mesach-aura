import type { AuthUser } from "@/lib/auth/types"

export function canViewReport(
  user: AuthUser | null,
  reportUserId?: string | null
): boolean {
  if (user?.role === "ADMIN") return true

  if (!reportUserId) {
    // TODO(auth): Tighten guest report access after auth is fully connected.
    return true
  }

  return user?.id === reportUserId
}

export function canAccessAdmin(user: AuthUser | null): boolean {
  return user?.role === "ADMIN"
}
