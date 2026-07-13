import type { SkinAssessment } from "@/lib/ai/types"
import type { ProductRecommendation } from "@/lib/recommendations/types"
import type { ClimateReportContext } from "@/lib/weather/types"

export interface SkinReport {
  id: string
  userId?: string | null
  createdAt: string
  assessment: SkinAssessment
  recommendations: ProductRecommendation[]
  climate: ClimateReportContext | null
  privacy: {
    imageStored: boolean
    imageRetentionConsent: boolean
  }
}
