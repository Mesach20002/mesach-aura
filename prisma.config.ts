import { existsSync } from "node:fs"
import { defineConfig } from "prisma/config"

if (existsSync(".env")) {
  process.loadEnvFile()
}

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://USER:PASSWORD@localhost:5432/aurora_skinsense?schema=public"

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
})
