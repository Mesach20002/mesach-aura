export type UserRole = "consumer" | "admin"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
}

export type ScanStatus = "pending" | "processed" | "failed"

export interface ScanSession {
  id: string
  userId: string
  imageUrl: string
  status: ScanStatus
  createdAt: string
}

export interface SkinAnalysisResult {
  id: string
  scanId: string
  textureScore: number
  poresScore: number
  pigmentationScore: number
  rednessScore: number
  wrinklesScore: number
  hydrationScore: number
  agingScore: number
  darkSpotsScore: number
  overallSkinScore: number
  analyzedAt: string
}

export type ConcernType =
  | "texture"
  | "pores"
  | "pigmentation"
  | "redness"
  | "wrinkles"
  | "hydration"
  | "aging"
  | "dark_spots"

export interface SkinConcern {
  id: string
  analysisId: string
  concernType: ConcernType
  severityScore: number
  confidenceScore: number
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  imageUrl: string
  targetConcerns: ConcernType[]
}

export interface Recommendation {
  id: string
  analysisId: string
  productId: string
  rank: number
  reason: string
}

export interface Report {
  id: string
  scanId: string
  pdfUrl: string
  generatedAt: string
  shared: boolean
}

export interface ReportDetail {
  id: string
  reportNumber: string
  generatedAt: string
  profile: string
  disclaimer: string
  findings: {
    label: string
    band: string
    detail: string
    clientMessage: string
  }[]
  recommendedProducts: {
    id: string
    name: string
  }[]
  exportNote: string
}

export interface ScanReportView {
  scan: ScanSession
  user: Pick<User, "id" | "fullName" | "email">
  analysis: SkinAnalysisResult
  concerns: SkinConcern[]
  recommendations: (Recommendation & { product: Product })[]
  report?: Report
}

export interface AdminAnalyticsSummary {
  totalUsers: number
  totalScans: number
  scansThisWeek: number
  reportDownloads: number
  avgOverallScore: number
  topConcerns: { concernType: ConcernType; count: number }[]
  topRecommendedProducts: { productId: string; name: string; count: number }[]
  recentScans: {
    scanId: string
    userFullName: string
    overallScore: number | null
    status: ScanStatus
    createdAt: string
  }[]
}
