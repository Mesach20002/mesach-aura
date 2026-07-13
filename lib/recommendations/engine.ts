import { recommendationEligibleProducts } from "@/lib/products/catalog"
import type {
  AuroraProduct,
  ProductSkinConcern,
  ProductSkinType,
  RoutineStep,
} from "@/lib/products/types"
import {
  concernProductPriority,
  mapConcernTerm,
} from "@/lib/recommendations/mappings"
import type {
  ProductRecommendation,
  ProductRoutine,
  RecommendationInput,
  RoutinePeriod,
  SeverityBand,
} from "@/lib/recommendations/types"
import type { WeatherProductTag } from "@/lib/weather/types"

const severityWeight: Record<SeverityBand, number> = {
  high: 30,
  moderate: 20,
  low: 10,
}

const confidenceWeight: Record<SeverityBand, number> = {
  high: 9,
  moderate: 6,
  low: 3,
}

const bandOrder: Record<SeverityBand, number> = {
  high: 3,
  moderate: 2,
  low: 1,
}

interface MappedConcern {
  concern: ProductSkinConcern
  severity: SeverityBand
  confidence: SeverityBand
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function maxBand(bands: SeverityBand[]): SeverityBand {
  return (
    bands.sort((first, second) => bandOrder[second] - bandOrder[first])[0] ??
    "low"
  )
}

function mapInputConcerns(input: RecommendationInput): MappedConcern[] {
  const mapped = new Map<ProductSkinConcern, MappedConcern>()

  for (const rawConcern of input.concerns) {
    const normalized = normalize(rawConcern)
    const severity =
      input.severityBands[rawConcern] ??
      input.severityBands[normalized] ??
      "low"
    const confidence =
      input.confidenceBands?.[rawConcern] ??
      input.confidenceBands?.[normalized] ??
      "moderate"

    for (const concern of mapConcernTerm(rawConcern)) {
      const current = mapped.get(concern)

      mapped.set(concern, {
        concern,
        severity: current ? maxBand([current.severity, severity]) : severity,
        confidence: current
          ? maxBand([current.confidence, confidence])
          : confidence,
      })
    }
  }

  return Array.from(mapped.values())
}

function normalizeSkinType(value: string): ProductSkinType {
  const normalized = normalize(value).replace(/\s+skin$/, "")

  if (normalized.includes("sensitive")) return "sensitive-looking"
  if (normalized === "dry") return "dry"
  if (normalized === "oily") return "oily"
  if (normalized === "combination") return "combination"
  if (normalized === "normal") return "normal"

  return "all"
}

function isSkinTypeCompatible(
  product: AuroraProduct,
  skinType: ProductSkinType
): boolean {
  return (
    product.skinTypes.includes("all") || product.skinTypes.includes(skinType)
  )
}

function getMappingBoost(
  productId: string,
  matchedConcerns: ProductSkinConcern[]
): number {
  return matchedConcerns.reduce((total, concern) => {
    const position = concernProductPriority[concern].indexOf(productId)
    return total + (position === -1 ? 0 : 12 - position * 3)
  }, 0)
}

function getPriorityBand(
  matches: MappedConcern[],
  skinTypeCompatible: boolean
): ProductRecommendation["priorityBand"] {
  if (matches.length === 0) return skinTypeCompatible ? "skin type" : "low"
  return maxBand(matches.map((match) => match.severity))
}

function buildReason(
  product: AuroraProduct,
  matches: MappedConcern[],
  skinType: ProductSkinType,
  climateTags: WeatherProductTag[]
): string {
  const climateReason = climateTags.length
    ? ` Current climate conditions also favor ${climateTags
        .map((tag) => tag.replaceAll("-", " "))
        .join(", ")}.`
    : ""

  if (matches.length === 0) {
    return `Selected because ${product.name} is compatible with your ${skinType} skin profile and supports a balanced cosmetic routine.${climateReason}`
  }

  const sortedMatches = [...matches].sort(
    (first, second) => bandOrder[second.severity] - bandOrder[first.severity]
  )
  const concernSummary = sortedMatches
    .slice(0, 3)
    .map(({ concern, severity }) => `${severity} ${concern}`)
    .join(", ")

  return `Recommended because your scan found ${concernSummary}. ${product.name} was selected because it ${product.benefits[0].toLowerCase()} while fitting your ${skinType} skin profile.${climateReason}`
}

export function getProductRecommendations(
  input: RecommendationInput
): ProductRecommendation[] {
  const maxResults = Math.min(6, Math.max(3, input.maxResults ?? 4))
  const concerns = mapInputConcerns(input)
  const skinType = normalizeSkinType(input.skinType)

  return recommendationEligibleProducts
    .map((product) => {
      const matches = concerns.filter(({ concern }) =>
        product.skinConcerns.includes(concern)
      )
      const matchedConcerns = matches.map(({ concern }) => concern)
      const skinTypeCompatible = isSkinTypeCompatible(product, skinType)
      const matchedClimateTags = (input.climateTags ?? []).filter((tag) =>
        productMatchesWeatherTag(product, tag)
      )
      const concernScore = matches.reduce(
        (total, match) => total + severityWeight[match.severity],
        0
      )
      const aiConfidenceScore = matches.reduce(
        (total, match) => total + confidenceWeight[match.confidence],
        0
      )
      const score =
        concernScore * 1000 +
        (skinTypeCompatible ? 100 : 0) +
        matchedClimateTags.length * 40 +
        aiConfidenceScore * 10 +
        getMappingBoost(product.id, matchedConcerns) +
        product.recommendationPriority / 100

      return {
        score,
        concernScore,
        climateScore: matchedClimateTags.length,
        skinTypeCompatible,
        aiConfidenceScore,
        recommendation: {
          product,
          matchedConcerns,
          reason: buildReason(product, matches, skinType, matchedClimateTags),
          priorityBand: getPriorityBand(matches, skinTypeCompatible),
          confidenceBand: maxBand(matches.map((match) => match.confidence)),
          score: Math.round(score),
        } satisfies ProductRecommendation,
      }
    })
    .filter((item) => item.concernScore > 0 || item.skinTypeCompatible)
    .sort((first, second) => {
      if (second.concernScore !== first.concernScore) {
        return second.concernScore - first.concernScore
      }
      if (second.skinTypeCompatible !== first.skinTypeCompatible) {
        return (
          Number(second.skinTypeCompatible) - Number(first.skinTypeCompatible)
        )
      }
      if (second.climateScore !== first.climateScore) {
        return second.climateScore - first.climateScore
      }
      if (second.aiConfidenceScore !== first.aiConfidenceScore) {
        return second.aiConfidenceScore - first.aiConfidenceScore
      }
      if (
        second.recommendation.product.recommendationPriority !==
        first.recommendation.product.recommendationPriority
      ) {
        return (
          second.recommendation.product.recommendationPriority -
          first.recommendation.product.recommendationPriority
        )
      }
      return first.recommendation.product.name.localeCompare(
        second.recommendation.product.name
      )
    })
    .slice(0, maxResults)
    .map(({ recommendation }) => recommendation)
}

function productMatchesWeatherTag(
  product: AuroraProduct,
  tag: WeatherProductTag
): boolean {
  const searchableText = [
    ...product.tags,
    ...product.ingredientsHighlight,
    ...product.benefits,
    product.shortDescription,
  ]
    .join(" ")
    .toLowerCase()

  if (tag === "sunscreen" || tag === "sunscreen-support") {
    return /\bspf\b|sunscreen|sun protection/.test(searchableText)
  }

  if (tag === "hydration") {
    return (
      product.skinConcerns.includes("hydration") ||
      /hydrat|hyaluronic|moistur/.test(searchableText)
    )
  }

  if (tag === "barrier-support" || tag === "richer-moisturizer") {
    return (
      product.category === "moisturizer" &&
      /shea butter|repair|comfort|soften|moistur|cream/.test(searchableText)
    )
  }

  if (tag === "gentle-cleanser" || tag === "gentle-cleansing") {
    return (
      product.category === "cleanser" &&
      !/charcoal|scrub|exfoliat/.test(searchableText)
    )
  }

  if (tag === "gel-cleanser") {
    return product.category === "cleanser" && /gel/.test(searchableText)
  }

  if (tag === "antioxidant") {
    return /vitamin c|niacinamide|turmeric|antioxidant/.test(searchableText)
  }

  if (tag === "lightweight-moisturizer" || tag === "lightweight-routine") {
    return /lightweight|non-greasy|non-sticky|lotion|mist/.test(searchableText)
  }

  if (tag === "non-comedogenic") {
    return /non-comedogenic/.test(searchableText)
  }

  return /protect|barrier|antioxidant|spf/.test(searchableText)
}

const routineStepPeriods: Record<RoutineStep, RoutinePeriod[]> = {
  cleanser: ["morning", "night"],
  toner: ["morning"],
  "treatment-serum": ["morning", "night"],
  moisturizer: ["morning", "night"],
  "face-mist": ["weekly"],
  exfoliator: ["weekly"],
  "lip-care": ["night"],
}

export function buildProductRoutine(
  recommendations: ProductRecommendation[]
): ProductRoutine {
  const routine: ProductRoutine = { morning: [], night: [], weekly: [] }

  for (const recommendation of recommendations) {
    for (const step of recommendation.product.routineSteps) {
      for (const period of routineStepPeriods[step]) {
        const alreadyHasStep = routine[period].some(
          (item) => item.step === step
        )

        if (!alreadyHasStep) {
          routine[period].push({ step, product: recommendation.product })
        }
      }
    }
  }

  return routine
}
