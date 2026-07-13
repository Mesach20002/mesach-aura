// Compatibility exports for existing report records. New product code should
// import directly from the authoritative product catalogue.
export {
  auroraProductCatalog as auroraProducts,
  getAuroraProductById,
  recommendationEligibleProducts,
} from "@/lib/products/catalog"
export type { AuroraProduct } from "@/lib/products/types"
