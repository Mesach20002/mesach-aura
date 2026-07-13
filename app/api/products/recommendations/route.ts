import { NextResponse } from "next/server"

import type { SeverityBand, SkinConcern, SkinType } from "@/lib/ai/types"
import { getProductRecommendations } from "@/lib/recommendations/engine"

const skinTypes: SkinType[] = [
  "normal",
  "dry",
  "oily",
  "combination",
  "sensitive-looking",
]

const skinConcerns: SkinConcern[] = [
  "hydration",
  "texture",
  "pores",
  "redness",
  "pigmentation",
  "fine-lines",
  "dullness",
  "oiliness",
]

const severityBands: SeverityBand[] = ["low", "moderate", "high"]

interface RecommendationRequestBody {
  skinType: SkinType
  concerns: Record<SkinConcern, SeverityBand>
  confidenceBands?: Partial<Record<SkinConcern, SeverityBand>>
  maxResults?: number
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)

  if (!isRecommendationRequestBody(body)) {
    return NextResponse.json(
      { error: "Invalid recommendation request." },
      { status: 400 }
    )
  }

  const recommendations = getProductRecommendations({
    skinType: body.skinType,
    concerns: Object.keys(body.concerns),
    severityBands: body.concerns,
    confidenceBands: body.confidenceBands,
    maxResults: body.maxResults,
  })

  return NextResponse.json({ recommendations })
}

function isRecommendationRequestBody(
  value: unknown
): value is RecommendationRequestBody {
  if (!value || typeof value !== "object") return false

  const candidate = value as Partial<RecommendationRequestBody>

  if (!candidate.skinType || !skinTypes.includes(candidate.skinType)) {
    return false
  }

  if (!candidate.concerns || typeof candidate.concerns !== "object") {
    return false
  }

  const concernEntries = Object.entries(candidate.concerns)

  if (concernEntries.length === 0) return false

  const concernsAreValid = concernEntries.every(
    ([concern, band]) =>
      skinConcerns.includes(concern as SkinConcern) &&
      severityBands.includes(band as SeverityBand)
  )

  if (!concernsAreValid) return false

  if (
    candidate.confidenceBands !== undefined &&
    (!candidate.confidenceBands ||
      typeof candidate.confidenceBands !== "object" ||
      !Object.entries(candidate.confidenceBands).every(
        ([concern, band]) =>
          skinConcerns.includes(concern as SkinConcern) &&
          severityBands.includes(band as SeverityBand)
      ))
  ) {
    return false
  }

  return (
    candidate.maxResults === undefined ||
    (Number.isInteger(candidate.maxResults) &&
      candidate.maxResults >= 3 &&
      candidate.maxResults <= 6)
  )
}
