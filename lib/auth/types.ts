export type UserRole = "USER" | "ADMIN" | "DERMATOLOGIST"

export interface AuthUser {
  id: string
  name: string | null
  email: string
  role: UserRole
  username?: string | null
  createdAt?: string | null
}

export class AuthRequiredError extends Error {
  constructor(message = "User session is required.") {
    super(message)
    this.name = "AuthRequiredError"
  }
}

export class AdminRequiredError extends Error {
  constructor(message = "Admin role is required.") {
    super(message)
    this.name = "AdminRequiredError"
  }
}
