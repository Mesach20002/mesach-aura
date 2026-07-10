import type { SkinAssessment } from "@/lib/ai/types"
import { validateSkinAssessment } from "@/lib/ai/validation"

export async function analyzeSkinImageWithMockAdapter(
  image: File
): Promise<SkinAssessment> {
  if (!image.type.startsWith("image/")) {
    throw new Error("Expected an image file.")
  }

  return validateSkinAssessment({
    skinType: "combination",
    concerns: {
      hydration: "moderate",
      texture: "moderate",
      pores: "high",
      redness: "low",
      pigmentation: "moderate",
      "fine-lines": "low",
      dullness: "moderate",
      oiliness: "moderate",
    },
    summary:
      "Your cosmetic skin assessment suggests combination-looking skin with visible pore prominence, moderate texture unevenness, and moderate dullness. This report is intended for wellness guidance only.",
    guidance: [
      "Focus on steady hydration support while keeping oil-prone areas comfortable.",
      "Use gentle cleansing and texture-supporting steps that respect the skin barrier.",
      "Track skin insights over time using coarse bands instead of precise scores.",
    ],
    disclaimer:
      "Aurora SkinSense provides cosmetic and wellness guidance only. It is not a medical diagnostic tool.",
  })
}
