import { NextResponse } from "next/server"

import { AdminRequiredError, AuthRequiredError } from "@/lib/auth/types"
import { requireAdmin } from "@/lib/auth/session"
import { getAdminAnalytics } from "@/lib/admin/analytics-service"

export async function GET() {
  try {
    await requireAdmin()
    const analytics = await getAdminAnalytics()

    return NextResponse.json(analytics)
  } catch (error) {
    if (error instanceof AuthRequiredError) {
      return NextResponse.json(
        { error: "Authentication is required." },
        { status: 401 }
      )
    }

    if (error instanceof AdminRequiredError) {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 403 }
      )
    }

    console.error("Failed to load analytics summary", error)

    return NextResponse.json(
      { error: "Failed to load analytics summary" },
      { status: 500 }
    )
  }
}
