import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import {
  getDevAuthSqlite,
  shouldUseDevSqliteAuth,
} from "@/lib/auth/dev-auth-db";
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client";

type SqliteAuthUser = {
  id: string;
  email: string;
  username: string | null;
  name: string;
  role: string | null;
  emailVerified: number;
  createdAt: string | number;
  updatedAt: string | number;
  authAccountCount: number;
  activeSessionCount: number;
  hasPasswordHash: number;
};

function getSqliteAuthUser(identifier: string): SqliteAuthUser | undefined {
  const db = getDevAuthSqlite();
  const user = db
    .prepare(
      `
    SELECT
      user.id,
      user.email,
      user.username,
      user.name,
      user.role,
      user.emailVerified,
      user.createdAt,
      user.updatedAt,
      COUNT(DISTINCT account.id) AS authAccountCount,
      COUNT(DISTINCT session.id) AS activeSessionCount,
      COUNT(CASE WHEN account.password IS NOT NULL THEN 1 END) AS hasPasswordHash
    FROM user
    LEFT JOIN account ON account.userId = user.id
    LEFT JOIN session ON session.userId = user.id
    WHERE lower(user.email) = ? OR user.username = ?
    GROUP BY user.id
    LIMIT 1
    `
    )
    .get(identifier.toLowerCase(), identifier) as SqliteAuthUser | undefined;

  return user;
}

export async function GET(request: Request) {
  try {
    const session = await auth.api
      .getSession({
        headers: await headers(),
      })
      .catch(() => null);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = new URL(request.url);
    const identifier = searchParams.searchParams.get("identifier")?.trim();

    if (!identifier) {
      return NextResponse.json(
        { error: "Identifier is required" },
        { status: 400 }
      );
    }

    // Check if using SQLite auth
    if (shouldUseDevSqliteAuth()) {
      const user = getSqliteAuthUser(identifier);

      if (!user) {
        return NextResponse.json({ connected: true, exists: false });
      }

      return NextResponse.json({
        connected: true,
        exists: true,
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        hasPasswordHash: user.hasPasswordHash > 0,
        passwordHashField: "Account.password",
        authAccountCount: user.authAccountCount,
        activeSessionCount: user.activeSessionCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    // Use Prisma for production
    const prisma = getPrismaClient();
    const isAvailable = await isPrismaAvailable();

    if (!isAvailable) {
      return NextResponse.json(
        {
          connected: false,
          exists: false,
          error: {
            message: "Database not available",
            code: "DB_UNAVAILABLE",
          },
        },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        OR: [{ email: identifier.toLowerCase() }, { username: identifier }],
      },
      include: {
        accounts: {
          select: {
            providerId: true,
            password: true,
          },
        },
        reports: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            accounts: true,
            reports: true,
            sessions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ connected: true, exists: false });
    }

    return NextResponse.json({
      connected: true,
      exists: true,
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      hasPasswordHash: user.accounts.some(
        (account: { password: string | null }) => Boolean(account.password)
      ),
      passwordHashField: "Account.password",
      authAccountCount: user._count.accounts,
      activeSessionCount: user._count.sessions,
      reportCount: user._count.reports,
      recentReports: user.reports.map(
        (report: { id: string; userId: string; createdAt: Date }) => ({
          id: report.id,
          userId: report.userId,
          createdAt: report.createdAt.toISOString(),
        })
      ),
      authProviders: user.accounts.map(
        (account: { providerId: string; password: string | null }) => ({
          providerId: account.providerId,
          hasPasswordHash: Boolean(account.password),
        })
      ),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "UNKNOWN";

    return NextResponse.json(
      {
        connected: false,
        exists: false,
        error: {
          message:
            code === "P1000"
              ? "Database authentication failed."
              : "Unable to query the database.",
          code: code,
        },
      },
      { status: 503 }
    );
  }
