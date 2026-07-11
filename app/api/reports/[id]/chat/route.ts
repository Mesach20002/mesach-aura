import { NextResponse } from "next/server"

import { canViewReport } from "@/lib/auth/permissions"
import { getCurrentUser } from "@/lib/auth/session"
import { getReport } from "@/lib/reports/service"
import { answerReportQuestion } from "@/lib/report-chat/adapter"
import type { ReportChatMessage } from "@/lib/report-chat/types"

export async function POST(
  request: Request,
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
  const body = await readJsonBody(request)
  const message = getMessage(body)

  if (!message) {
    return NextResponse.json(
      { error: "Report chat message is required." },
      { status: 400 }
    )
  }

  const report = await getReport(id)

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 })
  }

  if (!canViewReport(user, report.userId)) {
    return NextResponse.json({ error: "Report access is forbidden." }, { status: 403 })
  }

  try {
    const assistantMessage = await answerReportQuestion({
      report,
      message,
      history: getHistory(body),
    })

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    logReportChatError("Unable to answer report chat question.", error)

    return NextResponse.json(
      { error: "Unable to answer this report question right now." },
      { status: 503 }
    )
  }
}

function logReportChatError(message: string, error: unknown): void {
  if (process.env.NODE_ENV === "production") {
    console.error(message)
    return
  }

  console.error(message, error)
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function getMessage(value: unknown): string | null {
  if (!isRecord(value) || typeof value.message !== "string") {
    return null
  }

  const message = value.message.trim()

  if (message.length === 0 || message.length > 1000) {
    return null
  }

  return message
}

function getHistory(value: unknown): ReportChatMessage[] {
  if (!isRecord(value) || !Array.isArray(value.history)) {
    return []
  }

  return value.history.filter(isReportChatMessage).slice(-12)
}

function isReportChatMessage(value: unknown): value is ReportChatMessage {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === "string" &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    typeof value.createdAt === "string"
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
