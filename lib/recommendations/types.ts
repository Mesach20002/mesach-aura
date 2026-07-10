export type SeverityBand = "low" | "moderate" | "high"

export type ProductCategory =
  | "face-care"
  | "body-care"
  | "lip-care"
  | "hair-care"
  | "beard-care"
  | "gift-set"
  | "home-care"
  | "hand-care"
  | "foot-care"
  | "soap"
  | "wellness"

export interface AuroraProduct {
  id: string
  name: string
  description: string | null
  shortDescription: string | null
  price: string | null
  regularPrice: string | null
  categories: ProductCategory[]
  tags: string[]
  ingredientsHighlight: string[]
  imageUrl?: string
  productUrl: string
  suitableConcerns: string[]
  unsuitableConcerns?: string[]
  recommendationReason: string
  defaultFaceScanEligible: boolean
}

export interface RecommendationInput {
  skinType: string
  concerns: string[]
  severityBands: Partial<Record<string, SeverityBand>>
  maxResults?: number
  includeNonFaceProducts?: boolean
}

export interface ProductRecommendation {
  product: AuroraProduct
  matchedConcerns: string[]
  reason: string
  priorityBand: SeverityBand | "skin type"
}
