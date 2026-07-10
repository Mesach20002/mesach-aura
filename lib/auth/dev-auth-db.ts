import fs from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"
import { Kysely, SqliteDialect } from "kysely"

const dataDir = path.join(process.cwd(), "data")
const authDbPath = path.join(dataDir, "auth.db")

type BetterAuthSqliteDatabase = Record<string, unknown>

const globalForDevAuth = globalThis as unknown as {
  devAuthSqlite?: Database.Database
  devAuthKysely?: Kysely<BetterAuthSqliteDatabase>
}

export function shouldUseDevSqliteAuth(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_AUTH_DATABASE === "sqlite"
  )
}

export function getDevAuthDatabasePath(): string {
  return authDbPath
}

export function getDevAuthSqlite(): Database.Database {
  if (!globalForDevAuth.devAuthSqlite) {
    fs.mkdirSync(dataDir, { recursive: true })
    globalForDevAuth.devAuthSqlite = new Database(authDbPath)
    globalForDevAuth.devAuthSqlite.pragma("foreign_keys = ON")
    ensureDevAuthSchema(globalForDevAuth.devAuthSqlite)
  }

  return globalForDevAuth.devAuthSqlite
}

export function getDevAuthKysely(): Kysely<BetterAuthSqliteDatabase> {
  if (!globalForDevAuth.devAuthKysely) {
    globalForDevAuth.devAuthKysely = new Kysely<BetterAuthSqliteDatabase>({
      dialect: new SqliteDialect({
        database: getDevAuthSqlite(),
      }),
    })
  }

  return globalForDevAuth.devAuthKysely
}

function ensureDevAuthSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      username TEXT UNIQUE,
      displayUsername TEXT,
      role TEXT DEFAULT 'USER',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expiresAt INTEGER NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS session_userId_idx ON session(userId);

    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      accessToken TEXT,
      refreshToken TEXT,
      accessTokenExpiresAt INTEGER,
      refreshTokenExpiresAt INTEGER,
      scope TEXT,
      idToken TEXT,
      password TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS account_userId_idx ON account(userId);

    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `)
}
