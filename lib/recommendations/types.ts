import type {
  AuroraProduct,
  ProductSkinConcern,
  RoutineStep,
} from "@/lib/products/types"
import type { WeatherProductTag } from "@/lib/weather/types"

export type SeverityBand = "low" | "moderate" | "high"

export interface RecommendationInput {
  skinType: string
  concerns: string[]
  severityBands: Partial<Record<string, SeverityBand>>
  confidenceBands?: Partial<Record<string, SeverityBand>>
  climateTags?: WeatherProductTag[]
  maxResults?: number
}

export interface ProductRecommendation {
  product: AuroraProduct
  matchedConcerns: ProductSkinConcern[]
  reason: string
  priorityBand: SeverityBand | "skin type"
  confidenceBand: SeverityBand
  score: number
}

export type RoutinePeriod = "morning" | "night" | "weekly"

export interface RoutineItem {
  step: RoutineStep
  product: AuroraProduct
}

export type ProductRoutine = Record<RoutinePeriod, RoutineItem[]>

export type { AuroraProduct, ProductSkinConcern }
