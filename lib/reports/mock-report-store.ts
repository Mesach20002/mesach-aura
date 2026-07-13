import type { SeverityBand, SkinAssessment, SkinConcern } from "@/lib/ai/types"
import { getProductRecommendations } from "@/lib/recommendations/engine"
import type { SkinReport } from "@/lib/reports/types"
import type { ClimateReportContext } from "@/lib/weather/types"

const globalForMockReports = globalThis as unknown as {
  auroraMockReports?: Map<string, SkinReport>
}

// This mock store is for Phase 1 only. Keep it on globalThis so route handlers
// and server-rendered report pages read the same records during local runtime.
const reports =
  globalForMockReports.auroraMockReports ?? new Map<string, SkinReport>()

globalForMockReports.auroraMockReports = reports

const recommendationConcernMap: Record<SkinConcern, string[]> = {
  hydration: ["hydration", "dryness"],
  texture: ["uneven texture", "rough texture"],
  pores: ["pores", "enlarged pores", "clogged pores"],
  redness: ["redness", "irritation appearance"],
  pigmentation: ["pigmentation appearance", "uneven tone"],
  "fine-lines": ["fine lines", "aging appearance"],
  dullness: ["dullness"],
  oiliness: ["oiliness"],
}

export function createSkinReport(
  assessment: SkinAssessment,
  userId?: string,
  climate?: ClimateReportContext
): SkinReport {
  const concerns = Object.keys(assessment.concerns) as SkinConcern[]
  const recommendationConcerns = concerns.flatMap(
    (concern) => recommendationConcernMap[concern]
  )
  const severityBands = Object.fromEntries(
    concerns.flatMap((concern) =>
      recommendationConcernMap[concern].map((mappedConcern) => [
        mappedConcern,
        assessment.concerns[concern],
      ])
    )
  ) as Partial<Record<string, SeverityBand>>

  const report: SkinReport = {
    id: crypto.randomUUID(),
    userId: userId ?? null,
    createdAt: new Date().toISOString(),
    assessment,
    recommendations: getProductRecommendations({
      skinType: assessment.skinType,
      concerns: recommendationConcerns,
      severityBands,
      climateTags: getClimateTags(climate),
      maxResults: 4,
    }),
    privacy: {
      imageStored: false,
      imageRetentionConsent: false,
    },
    climate: climate ?? null,
  }

  reports.set(report.id, report)

  return report
}

function getClimateTags(
  climate: ClimateReportContext | undefined
): ClimateReportContext["recommendations"][number]["recommendedProductTags"] {
  return Array.from(
    new Set(
      climate?.recommendations.flatMap(
        (recommendation) => recommendation.recommendedProductTags
      ) ?? []
    )
  )
}

export function getSkinReportById(id: string): SkinReport | null {
  return reports.get(id) ?? null
}

export function deleteSkinReportById(id: string): void {
  reports.delete(id)
}

export function getRecentSkinReports(limit = 10): SkinReport[] {
  return Array.from(reports.values())
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
    )
    .slice(0, limit)
}
