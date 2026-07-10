import type { SkinConcern } from "@/lib/ai/types"
import type { AdminAnalytics } from "@/lib/admin/types"
import { listRecentReports } from "@/lib/reports/service"

const concernLabels: Record<SkinConcern, string> = {
  hydration: "Hydration",
  texture: "Texture",
  pores: "Pores",
  redness: "Redness",
  pigmentation: "Pigmentation",
  "fine-lines": "Fine lines",
  dullness: "Dullness",
  oiliness: "Oiliness",
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  // This service is routed through report service/repository so admin metrics
  // can read from Prisma when DATABASE_URL is configured, with mock fallback.
  const recentReports = await listRecentReports()
  const concernCounts = new Map<SkinConcern, number>()
  const productCounts = new Map<string, number>()

  for (const report of recentReports) {
    for (const concern of Object.keys(report.assessment.concerns) as SkinConcern[]) {
      concernCounts.set(concern, (concernCounts.get(concern) ?? 0) + 1)
    }

    for (const recommendation of report.recommendations) {
      const productName = recommendation.product.name
      productCounts.set(productName, (productCounts.get(productName) ?? 0) + 1)
    }
  }

  return {
    totalScans: recentReports.length,
    reportsGenerated: recentReports.length,
    productRecommendations: recentReports.reduce(
      (total, report) => total + report.recommendations.length,
      0
    ),
    conversionIntent: recentReports.length > 0 ? "Early signal" : "No signal yet",
    recentReports,
    topConcerns: Array.from(concernCounts.entries())
      .map(([concern, count]) => ({ concern: concernLabels[concern], count }))
      .sort((first, second) => second.count - first.count),
    topRecommendedProducts: Array.from(productCounts.entries())
      .map(([productName, count]) => ({ productName, count }))
      .sort((first, second) => second.count - first.count),
  }
}
