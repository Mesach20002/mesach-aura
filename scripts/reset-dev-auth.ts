import { resetDevAuth } from "../lib/auth/reset-dev-auth"

async function main(): Promise<void> {
  console.log("Resetting development auth...")
  const result = await resetDevAuth()

  if (!result.success) {
    throw new Error(result.error)
  }

  console.log("✓ Development auth reset successfully!")
  console.log("Created test users:")
  console.log("  - admin@test.com (password: password123)")
  console.log("  - user@test.com (password: password123)")
  console.log("  - doctor@test.com (password: password123)")
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error("Failed to reset development authentication data:", message)
  process.exitCode = 1
})
