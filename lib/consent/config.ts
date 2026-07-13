export const REQUIRED_CONSENT_VERSION = "2026-07-13"
export const SKIN_SCAN_CONSENT_TYPE = "SKIN_SCAN_ONBOARDING"

export const ageRangeOptions = [
  { value: "under-18", label: "Under 18" },
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "55-64", label: "55–64" },
  { value: "65-plus", label: "65+" },
] as const

export const genderIdentityOptions = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
  { value: "self-describe", label: "Prefer to self-describe" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const

export const skinTypeOptions = [
  { value: "normal", label: "Normal" },
  { value: "dry", label: "Dry" },
  { value: "oily", label: "Oily" },
  { value: "combination", label: "Combination" },
  { value: "sensitive-looking", label: "Sensitive-looking" },
  { value: "unsure", label: "Not sure" },
] as const

export const skinConcernOptions = [
  { value: "dryness", label: "Dryness" },
  { value: "oiliness", label: "Oiliness" },
  { value: "uneven-texture", label: "Uneven texture" },
  { value: "visible-pores", label: "Visible pores" },
  { value: "redness", label: "Redness appearance" },
  { value: "uneven-tone", label: "Uneven tone" },
  { value: "fine-lines", label: "Fine lines" },
  { value: "dullness", label: "Dullness" },
] as const

export const sensitivityOptions = [
  { value: "low", label: "Rarely sensitive" },
  { value: "moderate", label: "Sometimes sensitive" },
  { value: "high", label: "Frequently sensitive" },
  { value: "unsure", label: "Not sure" },
] as const

export const routineOptions = [
  { value: "none", label: "No regular routine" },
  { value: "simple", label: "Simple — 1 to 2 steps" },
  { value: "consistent", label: "Consistent — 3 to 4 steps" },
  { value: "advanced", label: "Advanced — 5 or more steps" },
] as const

export type ConsentProfileInput = {
  preferredName: string
  ageRange: string
  genderIdentity: string | null
  country: string | null
  selfReportedSkinType: string
  skinConcerns: string[]
  skinSensitivity: string
  routineConsistency: string
  allergiesOrSensitivities: string | null
  primarySkinGoal: string | null
}
