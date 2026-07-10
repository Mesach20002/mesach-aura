import type {
  AdminStat,
  ConcernBreakdown,
  ProductRecommendationMetric,
  RecentScan,
} from "@/lib/admin/types"
import { auroraProducts } from "@/lib/recommendations/products"

const productById = new Map(
  auroraProducts.map((product) => [product.id, product.name])
)

export const adminStats: AdminStat[] = [
  {
    label: "Total Scans",
    value: "8,420",
    helper: "Cosmetic assessments submitted",
    trend: "+12% this week",
    iconName: "scans",
  },
  {
    label: "Reports Generated",
    value: "7,890",
    helper: "Shareable wellness reports",
    trend: "+9% this week",
    iconName: "reports",
  },
  {
    label: "Product Recommendations",
    value: "18,340",
    helper: "Aurora product matches shown",
    trend: "+15% this week",
    iconName: "recommendations",
  },
  {
    label: "Conversion Intent",
    value: "High",
    helper: "Based on saved recommendations",
    trend: "Stable this week",
    iconName: "conversionIntent",
  },
]

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

export const productRecommendations: ProductRecommendationMetric[] = [
  {
    id: "radiant-plump-moisturizer-with-glutathione",
    productName:
      productById.get("radiant-plump-moisturizer-with-glutathione") ??
      "Radiant Plump Moisturizer with Glutathione",
    matchedConcern: "Uneven tone",
    recommendationCount: 3240,
    conversionIntent: "High",
    lastRecommended: "Jul 7, 2026",
  },
  {
    id: "niacinamide-neem-toner",
    productName:
      productById.get("niacinamide-neem-toner") ?? "Niacinamide & NEEM Toner",
    matchedConcern: "Clogged pores",
    recommendationCount: 2810,
    conversionIntent: "Moderate",
    lastRecommended: "Jul 7, 2026",
  },
  {
    id: "botanical-repair-mist",
    productName:
      productById.get("botanical-repair-mist") ?? "Botanical Repair Mist",
    matchedConcern: "Dryness",
    recommendationCount: 2565,
    conversionIntent: "High",
    lastRecommended: "Jul 6, 2026",
  },
  {
    id: "radiant-rose-face-mist",
    productName:
      productById.get("radiant-rose-face-mist") ?? "Radiant Rose Face Mist",
    matchedConcern: "Dullness",
    recommendationCount: 2198,
    conversionIntent: "Moderate",
    lastRecommended: "Jul 6, 2026",
  },
]

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
