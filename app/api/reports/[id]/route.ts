import { NextResponse } from "next/server"

import { canViewReport } from "@/lib/auth/permissions"
import { getCurrentUser } from "@/lib/auth/session"
import { getReport } from "@/lib/reports/service"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 }
    )
  }

  const { id } = await params
  const report = await getReport(id)

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 })
  }

  if (!canViewReport(user, report.userId)) {
    return NextResponse.json({ error: "Report access is forbidden." }, { status: 403 })
  }

  return NextResponse.json(report)
}
