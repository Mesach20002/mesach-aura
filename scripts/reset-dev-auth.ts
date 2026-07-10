import { resetDevelopmentAuth } from "../lib/auth/reset-dev-auth"

const result = await resetDevelopmentAuth()

console.log("Aurora development auth reset complete.")
console.log({
  authStore: result.authStore,
  usersDeleted: result.usersDeleted,
  sessionsDeleted: result.sessionsDeleted,
  accountsDeleted: result.accountsDeleted,
  verificationsDeleted: result.verificationsDeleted,
  failedLoginAttemptsDeleted: result.failedLoginAttemptsDeleted,
  reportsPreserved: result.reportsPreserved,
  reportsUnlinked: result.reportsUnlinked,
})
