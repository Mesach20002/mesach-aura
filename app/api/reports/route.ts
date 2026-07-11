import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth/session"
import { listRecentReports } from "@/lib/reports/service"

export async function GET(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const limitValue = searchParams.get("limit")
  const parsedLimit = limitValue ? Number.parseInt(limitValue, 10) : 10
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10
  const reports = await listRecentReports(limit)
  const visibleReports =
    user.role === "ADMIN"
      ? reports
      : reports.filter((report) => report.userId === user.id)

  return NextResponse.json({ reports: visibleReports })
}
