export type SeverityBand = "low" | "moderate" | "high"

export type SkinType =
  | "normal"
  | "dry"
  | "oily"
  | "combination"
  | "sensitive-looking"

export type SkinConcern =
  | "hydration"
  | "texture"
  | "pores"
  | "redness"
  | "pigmentation"
  | "fine-lines"
  | "dullness"
  | "oiliness"

export interface SkinAssessment {
  skinType: SkinType
  concerns: Record<SkinConcern, SeverityBand>
  summary: string
  guidance: string[]
  disclaimer: string
}
