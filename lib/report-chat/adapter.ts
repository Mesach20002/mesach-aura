import type { SkinReport } from "@/lib/reports/types"
import { answerReportQuestionWithGemini } from "@/lib/report-chat/gemini-chat-adapter"
import { answerReportQuestionWithMock } from "@/lib/report-chat/mock-chat-adapter"
import type { ReportChatMessage } from "@/lib/report-chat/types"

interface AnswerReportQuestionInput {
  report: SkinReport
  message: string
  history: ReportChatMessage[]
}

export async function answerReportQuestion(
  input: AnswerReportQuestionInput
): Promise<ReportChatMessage> {
  const provider =
    process.env.REPORT_CHAT_PROVIDER === "gemini" ? "gemini" : "mock"
  const geminiConfigured =
    Boolean(process.env.GEMINI_API_KEY) &&
    process.env.GEMINI_API_KEY !== "your_api_key_here"

  console.log("Report chat provider:", provider)
  console.log({
    provider: process.env.REPORT_CHAT_PROVIDER,
    geminiConfigured,
  })

  if (provider === "gemini") {
    try {
      return await answerReportQuestionWithGemini(input)
    } catch (error) {
      console.warn(
        "Aurora report chat Gemini provider failed; using mock fallback.",
        error
      )

      return answerReportQuestionWithMock(input)
    }
  }

  return answerReportQuestionWithMock(input)
}
