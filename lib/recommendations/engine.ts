import { auroraProducts } from "@/lib/recommendations/products"
import type {
  AuroraProduct,
  ProductRecommendation,
  RecommendationInput,
  SeverityBand,
} from "@/lib/recommendations/types"

const severityWeight: Record<SeverityBand, number> = {
  high: 30,
  moderate: 20,
  low: 10,
}

const priorityOrder: Record<ProductRecommendation["priorityBand"], number> = {
  high: 0,
  moderate: 1,
  low: 2,
  "skin type": 3,
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function getSkinTypeConcern(skinType: string): string {
  return `${normalize(skinType)} skin`
}

function getPriorityBand(
  matchedConcerns: string[],
  severityBands: RecommendationInput["severityBands"],
  matchedSkinType: boolean
): ProductRecommendation["priorityBand"] {
  if (matchedConcerns.some((concern) => severityBands[concern] === "high")) {
    return "high"
  }

  if (matchedConcerns.some((concern) => severityBands[concern] === "moderate")) {
    return "moderate"
  }

  if (matchedConcerns.some((concern) => severityBands[concern] === "low")) {
    return "low"
  }

  return matchedSkinType ? "skin type" : "low"
}

function getRecommendationReason(
  product: AuroraProduct,
  matchedConcerns: string[]
): string {
  if (matchedConcerns.length === 0) {
    return product.recommendationReason
  }

  return `${product.recommendationReason} Recommended based on reported skin concerns: ${matchedConcerns.join(", ")}.`
}

export function getProductRecommendations(
  input: RecommendationInput
): ProductRecommendation[] {
  const maxResults = input.maxResults ?? 4
  const concerns = input.concerns.map(normalize)
  const severityBands = Object.fromEntries(
    Object.entries(input.severityBands).map(([concern, band]) => [
      normalize(concern),
      band,
    ])
  ) as Partial<Record<string, SeverityBand>>
  const skinTypeConcern = getSkinTypeConcern(input.skinType)

  return auroraProducts
    .filter(
      (product) => input.includeNonFaceProducts || product.defaultFaceScanEligible
    )
    .map((product) => {
      const suitableConcerns = product.suitableConcerns.map(normalize)
      const matchedConcerns = concerns.filter((concern) =>
        suitableConcerns.includes(concern)
      )
      const matchedSkinType = suitableConcerns.includes(skinTypeConcern)

      const concernScore = matchedConcerns.reduce((total, concern) => {
        const severity = severityBands[concern]
        return total + (severity ? severityWeight[severity] : 8)
      }, 0)
      const skinTypeScore = matchedSkinType ? 6 : 0
      const score = concernScore + skinTypeScore

      return {
        score,
        recommendation: {
          product,
          matchedConcerns,
          reason: getRecommendationReason(product, matchedConcerns),
          priorityBand: getPriorityBand(
            matchedConcerns,
            severityBands,
            matchedSkinType
          ),
        },
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score

      const priorityDifference =
        priorityOrder[a.recommendation.priorityBand] -
        priorityOrder[b.recommendation.priorityBand]

      if (priorityDifference !== 0) return priorityDifference

      return a.recommendation.product.name.localeCompare(
        b.recommendation.product.name
      )
    })
    .slice(0, maxResults)
    .map((item) => item.recommendation)
}
