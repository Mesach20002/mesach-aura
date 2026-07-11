// @ts-nocheck
import { resetDevAuth } from "../lib/auth/reset-dev-auth";

async function main() {
  console.log("Resetting development auth...");
  const result = await resetDevAuth();
  
  if (result.success) {
    console.log("✓ Development auth reset successfully!");
    console.log("Created test users:");
    console.log("  - admin@test.com (password: password123)");
    console.log("  - user@test.com (password: password123)");
    console.log("  - doctor@test.com (password: password123)");
  } else {
    console.error("✗ Failed to reset development auth:", result.error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
