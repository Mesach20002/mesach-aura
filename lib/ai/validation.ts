import type {
  SeverityBand,
  SkinAssessment,
  SkinConcern,
  SkinType,
} from "@/lib/ai/types"

const skinTypes: SkinType[] = [
  "normal",
  "dry",
  "oily",
  "combination",
  "sensitive-looking",
]

const severityBands: SeverityBand[] = ["low", "moderate", "high"]

const skinConcerns: SkinConcern[] = [
  "hydration",
  "texture",
  "pores",
  "redness",
  "pigmentation",
  "fine-lines",
  "dullness",
  "oiliness",
]

export function validateSkinAssessment(value: unknown): SkinAssessment {
  if (!isRecord(value)) {
    throw new Error("Skin assessment must be an object.")
  }

  const skinType = value.skinType
  const concerns = value.concerns
  const summary = value.summary
  const guidance = value.guidance
  const disclaimer = value.disclaimer

  if (typeof skinType !== "string" || !isSkinType(skinType)) {
    throw new Error("Skin assessment skinType is invalid.")
  }

  if (!isRecord(concerns)) {
    throw new Error("Skin assessment concerns are invalid.")
  }

  const validatedConcerns = skinConcerns.reduce(
    (result, concern) => {
      const band = concerns[concern]

      if (typeof band !== "string" || !isSeverityBand(band)) {
        throw new Error(`Skin assessment concern ${concern} is invalid.`)
      }

      return {
        ...result,
        [concern]: band,
      }
    },
    {} as Record<SkinConcern, SeverityBand>
  )

  if (typeof summary !== "string" || summary.trim().length === 0) {
    throw new Error("Skin assessment summary is required.")
  }

  if (
    !Array.isArray(guidance) ||
    guidance.length === 0 ||
    !guidance.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error("Skin assessment guidance is required.")
  }

  if (typeof disclaimer !== "string" || disclaimer.trim().length === 0) {
    throw new Error("Skin assessment disclaimer is required.")
  }

  return {
    skinType,
    concerns: validatedConcerns,
    summary,
    guidance,
    disclaimer,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isSkinType(value: string): value is SkinType {
  return skinTypes.includes(value as SkinType)
}

function isSeverityBand(value: string): value is SeverityBand {
  return severityBands.includes(value as SeverityBand)
}
