import type { SkinReport } from "@/lib/reports/types"

export type AdminStatIconName =
  "scans" | "reports" | "recommendations" | "products" | "conversionIntent"

export interface AdminStat {
  label: string
  value: string
  helper: string
  trend: string
  iconName: AdminStatIconName
}

export type RecentScanStatus = "completed" | "pending" | "failed"

export interface RecentScan {
  id: string
  userName: string
  skinType: string
  mainConcern: string
  status: RecentScanStatus
  date: string
}

export interface ProductRecommendationMetric {
  id: string
  productName: string
  matchedConcern: string
  recommendationCount: number
  conversionIntent: string
  lastRecommended: string
}

export type SeverityBand = "low" | "moderate" | "high"

export interface ConcernBreakdown {
  id: string
  concern: string
  severityBand: SeverityBand
  reportCount: number
  suggestedAction: string
}

export interface AdminAnalytics {
  totalScans: number
  reportsGenerated: number
  productRecommendations: number
  conversionIntent: string
  recentReports: SkinReport[]
  topConcerns: Array<{
    concern: string
    count: number
  }>
  topRecommendedProducts: Array<{
    productName: string
    count: number
  }>
}
