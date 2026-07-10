import type { AuroraProduct } from "@/lib/recommendations/types"

const sourceDescription =
  "Exact product description was not included in the provided Aurora product source."

const sourceShortDescription =
  "Aurora Organics catalog item from the provided product list."

// TODO: For production, download approved Aurora product images into
// public/images/products/ and replace remote image URLs with local paths for
// better performance and reliability.
function createProduct(
  product: Omit<
    AuroraProduct,
    | "description"
    | "shortDescription"
    | "price"
    | "regularPrice"
    | "imageUrl"
    | "productUrl"
  > & {
    description?: string | null
    shortDescription?: string | null
    price?: string | null
    regularPrice?: string | null
    imageUrl?: string
    productUrl?: string
  }
): AuroraProduct {
  return {
    description: sourceDescription,
    shortDescription: sourceShortDescription,
    price: null,
    regularPrice: null,
    imageUrl: "",
    productUrl: "",
    ...product,
  }
}

export const auroraProducts: AuroraProduct[] = [
  createProduct({
    id: "botanical-repair-mist",
    name: "Botanical Repair Mist",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/08/Botanical-Repair-serum.jpg",
    productUrl: "https://www.auroraorganics.co/product/botanical-repair-mist/",
    categories: ["face-care", "wellness"],
    tags: ["mist", "hydration", "barrier support"],
    ingredientsHighlight: ["botanical blend"],
    suitableConcerns: [
      "redness",
      "dryness",
      "irritation appearance",
      "hydration",
      "barrier support",
    ],
    recommendationReason:
      "Recommended based on reported skin concerns where a gentle mist may support the appearance of calmer, more hydrated skin.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "charcoal-detox-soap",
    name: "Charcoal Detox Soap",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/charcaol-soap-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/charcoal-detox-soap/",
    categories: ["face-care", "soap"],
    tags: ["charcoal", "detox", "pores"],
    ingredientsHighlight: ["charcoal"],
    suitableConcerns: [
      "oiliness",
      "clogged pores",
      "uneven texture",
      "congestion appearance",
    ],
    recommendationReason:
      "Suitable for cosmetic wellness guidance when skin insights point to oiliness, buildup, or visible pore congestion.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "detox-sandal-scrub",
    name: "Detox Sandal Scrub",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/detox-sandal-scrub-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/detox-sandal-scrub/",
    categories: ["face-care", "body-care"],
    tags: ["scrub", "sandal", "texture"],
    ingredientsHighlight: ["sandal"],
    suitableConcerns: [
      "dullness",
      "uneven texture",
      "rough texture",
      "buildup",
    ],
    unsuitableConcerns: ["irritation appearance", "redness"],
    recommendationReason:
      "May support the appearance of smoother, fresher-looking skin when dullness or rough texture are the main cosmetic concerns.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "gold-serum",
    name: "Gold Serum",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/gold-serum-1-2.jpg",
    productUrl: "https://www.auroraorganics.co/product/gold-serum/",
    categories: ["face-care"],
    tags: ["serum", "glow", "firmness"],
    ingredientsHighlight: ["gold"],
    suitableConcerns: [
      "fine lines",
      "dullness",
      "firmness",
      "aging appearance",
    ],
    recommendationReason:
      "Recommended based on skin insights related to dullness, firmness, and visible aging appearance.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "intensive-skin-repair-sandal-lotion",
    name: "Intensive Skin Repair Sandal Lotion",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/07/Sandal-Repairing-Lotion.jpg",
    productUrl: "https://www.auroraorganics.co/product/sandal-moisturiser/",
    categories: ["body-care", "wellness"],
    tags: ["lotion", "sandal", "tone"],
    ingredientsHighlight: ["sandal"],
    suitableConcerns: [
      "dryness",
      "dark spots appearance",
      "sun-exposure appearance",
      "uneven tone",
    ],
    recommendationReason:
      "May support the appearance of more comfortable, even-looking skin when dryness and tone concerns are reported.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "lavender-foaming-face-wash",
    name: "Lavender Foaming Face Wash",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/07/Lavender-foaming.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/lavender-foaming-soothing-anti-acne-cleanser/",
    categories: ["face-care"],
    tags: ["lavender", "face wash", "pores"],
    ingredientsHighlight: ["lavender"],
    suitableConcerns: [
      "oiliness",
      "acne-prone appearance",
      "enlarged pores",
      "irritation appearance",
    ],
    recommendationReason:
      "Suitable for cosmetic wellness guidance when the report highlights oily-looking skin, pores, or irritation appearance.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "lavender-soothing-lotion",
    name: "Lavender Soothing Lotion",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/07/Soothing-Lavender-Lotion-1.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/lavender-soothing-lotion/",
    categories: ["body-care", "wellness"],
    tags: ["lavender", "soothing", "tone"],
    ingredientsHighlight: ["lavender"],
    suitableConcerns: [
      "redness",
      "dryness",
      "blotchiness",
      "hyperpigmentation appearance",
      "irritation appearance",
    ],
    recommendationReason:
      "Recommended based on reported skin concerns where a soothing cosmetic routine may support more comfortable-looking skin.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "niacinamide-neem-toner",
    name: "Niacinamide & NEEM Toner",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/07/SALICYLIC-ACID-NEEM-Toner-1.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/salicylic-acid-neem-toner/",
    categories: ["face-care"],
    tags: ["niacinamide", "neem", "toner"],
    ingredientsHighlight: ["niacinamide", "neem"],
    suitableConcerns: [
      "dark spots appearance",
      "uneven tone",
      "oiliness",
      "pores",
      "pigmentation appearance",
    ],
    recommendationReason:
      "May support the appearance of more balanced tone and clearer-looking pores based on reported skin concerns.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "plump-lip-balm",
    name: "Plump Lip Balm",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/lipbalm.jpg",
    productUrl: "https://www.auroraorganics.co/product/light-lip-balm/",
    categories: ["lip-care"],
    tags: ["lip balm", "hydration"],
    ingredientsHighlight: ["lip care blend"],
    suitableConcerns: ["dry lips", "lip dullness", "lip texture"],
    recommendationReason:
      "Suitable for cosmetic wellness guidance when the report context includes lip dryness or lip texture concerns.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "radiant-plump-lip-mask",
    name: "Radiant Plump Lip Mask",
    productUrl: "https://www.auroraorganics.co/product/radiant-plump-lip-mask/",
    categories: ["lip-care"],
    tags: ["lip mask", "hydration"],
    ingredientsHighlight: ["lip care blend"],
    suitableConcerns: ["dry lips", "lip fine lines", "lip hydration"],
    recommendationReason:
      "May support the appearance of smoother, more hydrated-looking lips when lip concerns are included.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "radiant-plump-moisturizer-with-glutathione",
    name: "Radiant Plump Moisturizer with Glutathione",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/20240125_024924-scaled.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/radiant-plump-moisturizer/",
    categories: ["face-care"],
    tags: ["moisturizer", "glutathione", "glow"],
    ingredientsHighlight: ["glutathione"],
    suitableConcerns: [
      "dullness",
      "uneven tone",
      "pigmentation appearance",
      "dryness",
    ],
    recommendationReason:
      "Recommended based on skin insights where hydration, dullness, and uneven-looking tone are prominent.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "radiant-plump-serum",
    name: "Radiant Plump Serum",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/radiant-pump-soap-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/radiant-plump-serum/",
    categories: ["face-care"],
    tags: ["serum", "radiance", "tone"],
    ingredientsHighlight: ["radiance blend"],
    suitableConcerns: [
      "dullness",
      "dark spots appearance",
      "dryness",
      "uneven tone",
    ],
    recommendationReason:
      "May support the appearance of brighter, more comfortable-looking skin when dullness or uneven tone are reported.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "radiant-plump-soap",
    name: "Radiant Plump Soap",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/radiant-soap-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/radiant-plump-soap/",
    categories: ["face-care", "soap"],
    tags: ["soap", "radiance", "skin type support"],
    ingredientsHighlight: ["radiance blend"],
    suitableConcerns: [
      "normal skin",
      "dry skin",
      "oily skin",
      "sensitive-looking skin",
      "combination skin",
      "acne-prone appearance",
    ],
    recommendationReason:
      "Suitable for cosmetic wellness guidance when the skin type context aligns with a gentle radiance-focused cleanse.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "radiant-rose-face-mist",
    name: "Radiant Rose Face Mist",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/rose-mist-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/radiant-rose-face-mist/",
    categories: ["face-care", "wellness"],
    tags: ["rose", "face mist", "hydration"],
    ingredientsHighlight: ["rose"],
    suitableConcerns: [
      "hydration",
      "dullness",
      "pollution exposure appearance",
      "dryness",
    ],
    recommendationReason:
      "May support the appearance of refreshed, hydrated-looking skin when dryness or dullness are reported.",
    defaultFaceScanEligible: true,
  }),
  createProduct({
    id: "botanical-nutrify-hair-oil",
    name: "Botanical Nutrify Hair Oil",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/hair-oil-1.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/botanical-nutrify-hair-oil/",
    categories: ["hair-care"],
    tags: ["hair oil", "scalp", "hair wellness"],
    ingredientsHighlight: ["botanical oil blend"],
    suitableConcerns: [
      "dry scalp",
      "hair dryness",
      "hair fall appearance",
      "dandruff appearance",
    ],
    recommendationReason:
      "Suitable for cosmetic wellness guidance when the report context includes scalp or hair appearance concerns.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "beard-and-hair-balm",
    name: "Beard and Hair Balm",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/beared-balm-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/beard-and-hair-balm/",
    categories: ["beard-care", "hair-care"],
    tags: ["beard", "hair balm", "dryness"],
    ingredientsHighlight: ["balm blend"],
    suitableConcerns: ["beard dryness", "hair roughness", "scalp dryness"],
    recommendationReason:
      "Recommended when the wellness context includes beard or hair dryness concerns rather than a default face scan report.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "gift-for-her",
    name: "Gift For Her",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/gift-for-her-2.jpg",
    productUrl: "https://www.auroraorganics.co/product/gift-for-her/",
    categories: ["gift-set", "wellness"],
    tags: ["gift set", "wellness"],
    ingredientsHighlight: ["gift set"],
    suitableConcerns: ["gift set", "general wellness"],
    recommendationReason:
      "Suitable for general wellness gifting contexts outside the default face scan report.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "gift-for-him",
    name: "Gift For Him",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/gift-for-him-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/gift-for-him/",
    categories: ["gift-set", "wellness"],
    tags: ["men care", "gift set", "wellness"],
    ingredientsHighlight: ["gift set"],
    suitableConcerns: ["men care", "gift set", "general wellness"],
    recommendationReason:
      "Suitable for general wellness gifting contexts outside the default face scan report.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "natural-hand-sanitizer-disinfectant-spray",
    name: "Natural Hand Sanitizer / Disinfectant SPRAY",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/senitizer.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/natural-hand-sanitizer-disinfectant-spray/",
    categories: ["hand-care"],
    tags: ["sanitizer", "disinfectant", "hand care"],
    ingredientsHighlight: ["sanitizer blend"],
    suitableConcerns: ["hand hygiene", "general wellness"],
    recommendationReason:
      "Excluded from default facial skin reports unless the requested context explicitly includes hand hygiene.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "natural-hand-senitizer-foaming",
    name: "Natural Hand Senitizer / Foaming",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/natural-senitizer-spray.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/natural-hand-senitizer-foaming/",
    categories: ["hand-care"],
    tags: ["sanitizer", "foaming", "hand care"],
    ingredientsHighlight: ["sanitizer blend"],
    suitableConcerns: ["hand hygiene", "general wellness"],
    recommendationReason:
      "Excluded from default facial skin reports unless the requested context explicitly includes hand hygiene.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "natural-multi-surface-cleaner",
    name: "Natural Multi-Surface Cleaner",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/Natural-Multi-Surface-Cleaner-1.jpg",
    productUrl:
      "https://www.auroraorganics.co/product/natural-multi-surface-cleaner/",
    categories: ["home-care"],
    tags: ["surface cleaner", "home care"],
    ingredientsHighlight: ["cleaning blend"],
    suitableConcerns: ["home care", "general wellness"],
    recommendationReason:
      "Excluded from default facial skin reports unless the requested context explicitly includes home care.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "neem-liquid-dishwash",
    name: "Neem Liquid Dishwash",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/Neem-Dish-Wash-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/neem-liquid-dishwash/",
    categories: ["home-care"],
    tags: ["dishwash", "neem", "home care"],
    ingredientsHighlight: ["neem"],
    suitableConcerns: ["home care", "general wellness"],
    recommendationReason:
      "Excluded from default facial skin reports unless the requested context explicitly includes home care.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "skin-professional-gender-neutral-foot-care",
    name: "Skin Professional Gender-Neutral Foot Care",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/foot-soak-1.jpg",
    productUrl: "https://www.auroraorganics.co/product/foot-soak/",
    categories: ["foot-care"],
    tags: ["foot care", "wellness"],
    ingredientsHighlight: ["foot care blend"],
    suitableConcerns: ["foot dryness", "foot texture", "general wellness"],
    recommendationReason:
      "Excluded from default facial skin reports unless the requested context explicitly includes foot care.",
    defaultFaceScanEligible: false,
  }),
  createProduct({
    id: "calmer-blend-and-soap",
    name: "Calmer Blend and Soap",
    imageUrl:
      "https://www.auroraorganics.co/wp-content/uploads/2022/06/calmer-2.jpg",
    productUrl: "https://www.auroraorganics.co/product/calmer-blend-and-soap/",
    categories: ["soap", "wellness"],
    tags: ["soap", "calming", "wellness"],
    ingredientsHighlight: ["calmer blend"],
    suitableConcerns: ["general wellness", "irritation appearance"],
    recommendationReason:
      "Excluded from default facial skin reports unless explicitly requested for the report context.",
    defaultFaceScanEligible: false,
  }),
]
