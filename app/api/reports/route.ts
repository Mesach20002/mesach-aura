import { NextResponse } from "next/server"

import { listRecentReports } from "@/lib/reports/service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limitValue = searchParams.get("limit")
  const parsedLimit = limitValue ? Number.parseInt(limitValue, 10) : 10
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10

  return NextResponse.json({ reports: await listRecentReports(limit) })
}
