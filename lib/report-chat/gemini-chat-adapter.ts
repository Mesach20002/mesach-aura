import "server-only"

import { GoogleGenAI } from "@google/genai"

import type { SkinConcern } from "@/lib/ai/types"
import type { SkinReport } from "@/lib/reports/types"
import { REPORT_CHAT_SYSTEM_PROMPT } from "@/lib/report-chat/prompts"
import type { ReportChatMessage } from "@/lib/report-chat/types"

interface GeminiReportChatInput {
  report: SkinReport
  message: string
  history: ReportChatMessage[]
}

const medicalSafetyMessage =
  "Aurora SkinSense can explain cosmetic report insights only. For medical symptoms, diagnosis, or treatment decisions, please consult a qualified dermatologist or healthcare professional."

const concernLabels: Record<SkinConcern, string> = {
  hydration: "hydration",
  texture: "texture",
  pores: "pores",
  redness: "redness",
  pigmentation: "pigmentation",
  "fine-lines": "fine-lines",
  dullness: "dullness",
  oiliness: "oiliness",
}

const medicalQuestionTerms = [
  "symptom",
  "rash",
  "pain",
  "infection",
  "allergy",
  "medicine",
  "prescription",
  "doctor",
  "dermatologist",
  "diagnosis",
  "diagnose",
  "treatment",
  "disease",
  "cure",
] as const

const placeholderApiKeys = new Set([
  "your_api_key_here",
  "your_key_here",
  "your_real_key",
  "your_real_key_here",
])

export async function answerReportQuestionWithGemini({
  report,
  message,
  history,
}: GeminiReportChatInput): Promise<ReportChatMessage> {
  if (isMedicalQuestion(message)) {
    return createAssistantMessage(medicalSafetyMessage)
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || placeholderApiKeys.has(apiKey)) {
    throw new Error("GEMINI_API_KEY is required for Gemini report chat.")
  }

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildUserPrompt(report, message, history),
    config: {
      systemInstruction: REPORT_CHAT_SYSTEM_PROMPT,
      temperature: 0.4,
      maxOutputTokens: 600,
    },
  })
  const content = response.text?.trim()

  if (!content) {
    throw new Error("Gemini returned an empty report chat response.")
  }

  return createAssistantMessage(content)
}

function buildUserPrompt(
  report: SkinReport,
  message: string,
  history: ReportChatMessage[]
): string {
  return [
    "Aurora SkinSense report context:",
    formatReportContext(report),
    "",
    "Recent chat history:",
    formatHistory(history),
    "",
    `User question: ${message}`,
    "",
    "Answer the user's question using only this report context and recent chat history.",
  ].join("\n")
}

function formatReportContext(report: SkinReport): string {
  const concerns = Object.entries(report.assessment.concerns)
    .map(
      ([concern, band]) =>
        `- ${concernLabels[concern as SkinConcern]} band: ${band}`
    )
    .join("\n")

  return [
    `- report ID: ${report.id}`,
    `- skin type: ${report.assessment.skinType}`,
    concerns,
    `- summary: ${report.assessment.summary}`,
    "- guidance:",
    ...report.assessment.guidance.map((item: any) => `  - ${item}`),
    `- disclaimer: ${report.assessment.disclaimer}`,
  ].join("\n")
}

function formatHistory(history: ReportChatMessage[]): string {
  const recentHistory = history
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .slice(-8)

  if (recentHistory.length === 0) {
    return "No previous chat turns."
  }

  return recentHistory
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")
}

function isMedicalQuestion(message: string): boolean {
  const normalizedMessage = message.toLowerCase()

  return medicalQuestionTerms.some((term) => normalizedMessage.includes(term))
}

function createAssistantMessage(content: string): ReportChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
  }
}
