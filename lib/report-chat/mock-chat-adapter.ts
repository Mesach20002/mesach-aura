import type { SkinConcern } from "@/lib/ai/types"
import type { SkinReport } from "@/lib/reports/types"
import type { ReportChatMessage } from "@/lib/report-chat/types"

interface MockReportChatInput {
  report: SkinReport
  message: string
  history: ReportChatMessage[]
}

const concernLabels: Record<SkinConcern, string> = {
  hydration: "hydration",
  texture: "texture",
  pores: "pores",
  redness: "redness",
  pigmentation: "pigmentation",
  "fine-lines": "fine lines",
  dullness: "dullness",
  oiliness: "oiliness",
}

const concernExplanations: Record<SkinConcern, string> = {
  hydration:
    "the appearance of comfort, moisture balance, and how refreshed the skin surface looks",
  texture:
    "the appearance of smoothness, visible unevenness, and surface refinement",
  pores:
    "the appearance of visible pore prominence compared with the other report bands",
  redness:
    "the appearance of visible flush, uneven-looking tone, or surface color variation",
  pigmentation:
    "the appearance of tone variation and uneven-looking pigmentation",
  "fine-lines": "the appearance of delicate line visibility",
  dullness: "the appearance of radiance, freshness, and visible glow",
  oiliness: "the appearance of shine and surface balance in oil-prone areas",
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

export async function answerReportQuestionWithMock({
  report,
  message,
  history,
}: MockReportChatInput): Promise<ReportChatMessage> {
  const normalizedMessage = message.toLowerCase()

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: buildAnswer(report, normalizedMessage, history),
    createdAt: new Date().toISOString(),
  }
}

function buildAnswer(
  report: SkinReport,
  normalizedMessage: string,
  history: ReportChatMessage[]
): string {
  if (medicalQuestionTerms.some((term) => normalizedMessage.includes(term))) {
    return "Aurora SkinSense can explain cosmetic report insights only. For medical symptoms, diagnosis, or treatment decisions, please consult a qualified dermatologist or healthcare professional."
  }

  if (
    normalizedMessage.includes("skin type") ||
    normalizedMessage.includes("combination") ||
    normalizedMessage.includes("dry") ||
    normalizedMessage.includes("oily")
  ) {
    return buildSkinTypeAnswer(report)
  }

  const matchedConcern = getMatchedConcern(normalizedMessage)

  if (matchedConcern) {
    return buildConcernAnswer(report, matchedConcern)
  }

  const followUpConcern = getFollowUpConcern(normalizedMessage, history)

  if (followUpConcern) {
    return buildConcernAnswer(report, followUpConcern)
  }

  return buildSummaryAnswer(report)
}

function getMatchedConcern(message: string): SkinConcern | null {
  if (message.includes("fine line") || message.includes("fine-line")) {
    return "fine-lines"
  }

  const concerns = Object.keys(concernLabels) as SkinConcern[]

  return concerns.find((concern) => message.includes(concern)) ?? null
}

function getFollowUpConcern(
  message: string,
  history: ReportChatMessage[]
): SkinConcern | null {
  const looksLikeFollowUp =
    message.includes("that") ||
    message.includes("it") ||
    message.includes("this") ||
    message.includes("mean")

  if (!looksLikeFollowUp) {
    return null
  }

  for (const chatMessage of history.slice(-6).reverse()) {
    const concern = getMatchedConcern(chatMessage.content.toLowerCase())

    if (concern) {
      return concern
    }
  }

  return null
}

function buildConcernAnswer(report: SkinReport, concern: SkinConcern): string {
  const band = report.assessment.concerns[concern]
  const label = concernLabels[concern]
  const explanation = concernExplanations[concern]

  return `Your ${label} insight is marked ${formatBand(
    band
  )} because the cosmetic assessment returned a ${band} band for ${explanation}. This is appearance-based wellness guidance only, not a medical diagnosis. It simply helps you read the report's coarse low, moderate, and high bands in plain language.`
}

function buildSkinTypeAnswer(report: SkinReport): string {
  return `Your report describes your skin type as ${formatSkinType(
    report.assessment.skinType
  )}. In Aurora SkinSense, skin type is a cosmetic, appearance-based way to summarize the overall look of balance, dryness, oiliness, and sensitivity-looking cues in the report. It is wellness guidance only, not a medical diagnosis.`
}

function buildSummaryAnswer(report: SkinReport): string {
  const highConcerns = getConcernsByBand(report, "high")
  const moderateConcerns = getConcernsByBand(report, "moderate")

  if (highConcerns.length > 0) {
    return `The strongest cosmetic skin insight in this report is ${formatList(
      highConcerns
    )}, which appears in the high band. Moderate bands include ${formatList(
      moderateConcerns
    )}. These are coarse, appearance-based report bands for wellness guidance only, not a medical diagnosis.`
  }

  return `Your report summarizes ${formatSkinType(
    report.assessment.skinType
  )} skin with these cosmetic skin insights: ${report.assessment.summary} The bands are coarse low, moderate, and high signals for wellness guidance only, not a medical diagnosis.`
}

function getConcernsByBand(report: SkinReport, band: "high" | "moderate") {
  return (Object.keys(report.assessment.concerns) as SkinConcern[])
    .filter((concern) => report.assessment.concerns[concern] === band)
    .map((concern) => concernLabels[concern])
}

function formatBand(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatSkinType(value: string): string {
  return value.replaceAll("-", " ")
}

function formatList(items: string[]): string {
  if (items.length === 0) {
    return "none highlighted"
  }

  if (items.length === 1) {
    return items[0]
  }

  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
}
