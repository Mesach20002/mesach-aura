import { betterAuth } from "better-auth"
import { kyselyAdapter } from "@better-auth/kysely-adapter"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { username } from "better-auth/plugins"

import { getDevAuthKysely, shouldUseDevSqliteAuth } from "@/lib/auth/dev-auth-db"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"

export const auth = betterAuth({
  appName: "Aurora SkinSense",
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL],
  database: shouldUseDevSqliteAuth()
    ? kyselyAdapter(getDevAuthKysely(), {
        type: "sqlite",
      })
    : isPrismaAvailable
      ? prismaAdapter(getPrismaClient(), {
          provider: "postgresql",
        })
      : undefined,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 60 * 60,
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN", "DERMATOLOGIST"],
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
      "/sign-in/username": {
        window: 60,
        max: 5,
      },
      "/sign-up/email": {
        window: 60 * 5,
        max: 5,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  defaultCookieAttributes: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
    nextCookies(),
  ],
})
