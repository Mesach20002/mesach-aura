export type ProductCategory =
  | "cleanser"
  | "moisturizer"
  | "serum"
  | "toner"
  | "face-mist"
  | "exfoliator"
  | "lip-care"
  | "hair-care"
  | "beard-care"
  | "gift-set"
  | "hand-care"
  | "home-care"
  | "foot-care"
  | "wellness"

export type ProductSkinConcern =
  | "acne"
  | "aging"
  | "dryness"
  | "dullness"
  | "hydration"
  | "hyperpigmentation"
  | "oiliness"
  | "pores"
  | "redness"
  | "sensitivity"
  | "texture"

export type ProductSkinType =
  "all" | "normal" | "dry" | "oily" | "combination" | "sensitive-looking"

export type ProductGender = "all" | "women" | "men"

export type RoutineStep =
  | "cleanser"
  | "toner"
  | "treatment-serum"
  | "moisturizer"
  | "face-mist"
  | "exfoliator"
  | "lip-care"

export interface AuroraProduct {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  category: ProductCategory
  tags: string[]
  image: string | null
  productUrl: string
  ingredientsHighlight: string[]
  price: string | null
  skinConcerns: ProductSkinConcern[]
  skinTypes: ProductSkinType[]
  gender: ProductGender
  recommendationPriority: number
  benefits: string[]
  routineSteps: RoutineStep[]
  recommendationEligible: boolean
}
