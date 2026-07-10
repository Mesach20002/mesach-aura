import type { SkinAssessment } from "@/lib/ai/types"
import type { ProductRecommendation } from "@/lib/recommendations/types"

export interface SkinReport {
  id: string
  userId?: string | null
  createdAt: string
  assessment: SkinAssessment
  recommendations: ProductRecommendation[]
  privacy: {
    imageStored: boolean
    imageRetentionConsent: boolean
  }
}
