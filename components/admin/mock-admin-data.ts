import type {
  AdminStat,
  AdminAnalytics,
  ConcernBreakdown,
  ProductRecommendationMetric,
  RecentScan,
} from "@/lib/admin/types"
import {
  auroraProductCatalog,
  getAuroraProductById,
} from "@/lib/products/catalog"

function getProductName(id: string): string {
  const product = getAuroraProductById(id)

  if (!product) {
    throw new Error(`Unknown Aurora Organics product: ${id}`)
  }

  return product.name
}

export function getAdminStats(analytics: AdminAnalytics): AdminStat[] {
  return [
    {
      label: "Aurora Products",
      value: auroraProductCatalog.length.toLocaleString(),
      helper: "Products in the official catalogue",
      trend: "Catalogue source of truth",
      iconName: "products",
    },
    {
      label: "Total Scans",
      value: analytics.totalScans.toLocaleString(),
      helper: "Cosmetic assessments submitted",
      trend: "Saved report activity",
      iconName: "scans",
    },
    {
      label: "Reports Generated",
      value: analytics.reportsGenerated.toLocaleString(),
      helper: "Shareable wellness reports",
      trend: "Saved report activity",
      iconName: "reports",
    },
    {
      label: "Product Recommendations",
      value: analytics.productRecommendations.toLocaleString(),
      helper: "Official Aurora product matches shown",
      trend: "Across saved reports",
      iconName: "recommendations",
    },
    {
      label: "Recommendation Success",
      value: analytics.conversionIntent,
      helper: "Requires product click or purchase events",
      trend: "No invented conversion data",
      iconName: "conversionIntent",
    },
  ]
}

export const recentScans: RecentScan[] = [
  {
    id: "scan-1001",
    userName: "Amara N.",
    skinType: "Combination",
    mainConcern: "Uneven tone",
    status: "completed",
    date: "Jul 7, 2026",
  },
  {
    id: "scan-1002",
    userName: "Leo M.",
    skinType: "Oily",
    mainConcern: "Clogged pores",
    status: "pending",
    date: "Jul 7, 2026",
  },
  {
    id: "scan-1003",
    userName: "Nia K.",
    skinType: "Dry",
    mainConcern: "Dullness",
    status: "completed",
    date: "Jul 6, 2026",
  },
  {
    id: "scan-1004",
    userName: "Maya S.",
    skinType: "Sensitive",
    mainConcern: "Visible redness",
    status: "failed",
    date: "Jul 6, 2026",
  },
  {
    id: "scan-1005",
    userName: "Jon P.",
    skinType: "Normal",
    mainConcern: "Texture",
    status: "completed",
    date: "Jul 5, 2026",
  },
]

export function getProductRecommendationMetrics(
  analytics: AdminAnalytics
): ProductRecommendationMetric[] {
  return analytics.topRecommendedProducts.flatMap((metric) => {
    const product = auroraProductCatalog.find(
      (item) => item.name === metric.productName
    )

    if (!product) return []

    return [
      {
        id: product.id,
        productName: getProductName(product.id),
        matchedConcern: "Across saved reports",
        recommendationCount: metric.count,
        conversionIntent: analytics.conversionIntent,
        lastRecommended: "Recent report activity",
      },
    ]
  })
}

export const concernsBreakdown: ConcernBreakdown[] = [
  {
    id: "concern-uneven-tone",
    concern: "Uneven tone",
    severityBand: "moderate",
    reportCount: 2140,
    suggestedAction: "Review brightening recommendation mix",
  },
  {
    id: "concern-dryness",
    concern: "Dryness",
    severityBand: "high",
    reportCount: 1885,
    suggestedAction: "Promote hydration-focused product guidance",
  },
  {
    id: "concern-texture",
    concern: "Texture",
    severityBand: "moderate",
    reportCount: 1568,
    suggestedAction: "Audit routine-building report copy",
  },
  {
    id: "concern-visible-redness",
    concern: "Visible redness",
    severityBand: "low",
    reportCount: 920,
    suggestedAction: "Keep recommendations gentle and wellness-oriented",
  },
]
