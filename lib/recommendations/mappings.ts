import type { ProductSkinConcern } from "@/lib/products/types"

export const concernProductPriority: Record<
  ProductSkinConcern,
  readonly string[]
> = {
  acne: [
    "lavender-foaming-face-wash",
    "niacinamide-neem-toner",
    "charcoal-detox-soap",
  ],
  dryness: [
    "radiant-plump-moisturizer-with-glutathione",
    "lavender-soothing-lotion",
    "gold-serum",
  ],
  hyperpigmentation: [
    "radiant-plump-serum",
    "gold-serum",
    "botanical-repair-mist",
  ],
  sensitivity: [
    "lavender-soothing-lotion",
    "botanical-repair-mist",
    "radiant-rose-face-mist",
  ],
  dullness: [
    "gold-serum",
    "radiant-plump-moisturizer-with-glutathione",
    "radiant-rose-face-mist",
  ],
  aging: [
    "gold-serum",
    "radiant-plump-serum",
    "radiant-plump-moisturizer-with-glutathione",
  ],
  hydration: [
    "radiant-plump-moisturizer-with-glutathione",
    "botanical-repair-mist",
    "radiant-rose-face-mist",
  ],
  oiliness: [
    "niacinamide-neem-toner",
    "lavender-foaming-face-wash",
    "charcoal-detox-soap",
  ],
  pores: [
    "niacinamide-neem-toner",
    "lavender-foaming-face-wash",
    "charcoal-detox-soap",
  ],
  redness: [
    "botanical-repair-mist",
    "lavender-soothing-lotion",
    "radiant-rose-face-mist",
  ],
  texture: [
    "detox-sandal-scrub",
    "lavender-foaming-face-wash",
    "radiant-plump-moisturizer-with-glutathione",
  ],
}

const concernAliases: Array<{
  concern: ProductSkinConcern
  terms: readonly string[]
}> = [
  { concern: "acne", terms: ["acne", "breakout", "blemish"] },
  {
    concern: "aging",
    terms: ["aging", "fine line", "fine-line", "wrinkle", "firmness"],
  },
  {
    concern: "dryness",
    terms: ["dryness", "dry skin", "dry patch", "cracked"],
  },
  { concern: "dullness", terms: ["dullness", "dull skin", "radiance"] },
  { concern: "hydration", terms: ["hydration", "dehydration", "dehydrated"] },
  {
    concern: "hyperpigmentation",
    terms: [
      "pigmentation",
      "hyperpigmentation",
      "uneven tone",
      "dark spot",
      "discoloration",
    ],
  },
  {
    concern: "oiliness",
    terms: ["oiliness", "oily skin", "excess oil", "sebum"],
  },
  { concern: "pores", terms: ["pores", "pore", "congestion", "clogged"] },
  { concern: "redness", terms: ["redness", "blotchiness"] },
  { concern: "sensitivity", terms: ["sensitive", "sensitivity", "irritation"] },
  {
    concern: "texture",
    terms: ["texture", "roughness", "rough skin", "buildup"],
  },
]

export function mapConcernTerm(value: string): ProductSkinConcern[] {
  const normalized = value.trim().toLowerCase()

  return concernAliases
    .filter(({ terms }) => terms.some((term) => normalized.includes(term)))
    .map(({ concern }) => concern)
}
