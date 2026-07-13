"use server"

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth/session"
import {
  ageRangeOptions,
  genderIdentityOptions,
  routineOptions,
  sensitivityOptions,
  skinConcernOptions,
  skinTypeOptions,
  type ConsentProfileInput,
} from "@/lib/consent/config"
import { saveConsentOnboarding } from "@/lib/consent/service"

export type ConsentFormState = {
  message: string | null
  errors: Record<string, string>
}

export const initialConsentFormState: ConsentFormState = {
  message: null,
  errors: {},
}

export async function submitConsentOnboarding(
  _previousState: ConsentFormState,
  formData: FormData
): Promise<ConsentFormState> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/consent")
  }

  const result = parseConsentForm(formData)

  if (!result.success) {
    return {
      message: "Please review the highlighted fields before continuing.",
      errors: result.errors,
    }
  }

  try {
    await saveConsentOnboarding(user.id, result.data)
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unable to save consent onboarding.", error)
    }

    return {
      message: "We could not securely save your consent. Please try again.",
      errors: {},
    }
  }

  redirect("/climate")
}

type ParseResult =
  | { success: true; data: ConsentProfileInput }
  | { success: false; errors: Record<string, string> }

function parseConsentForm(formData: FormData): ParseResult {
  const errors: Record<string, string> = {}
  const preferredName = getText(formData, "preferredName", 80)
  const ageRange = getOption(formData, "ageRange", ageRangeOptions)
  const genderIdentity = getOptionalOption(
    formData,
    "genderIdentity",
    genderIdentityOptions
  )
  const country = getOptionalText(formData, "country", 80)
  const selfReportedSkinType = getOption(
    formData,
    "selfReportedSkinType",
    skinTypeOptions
  )
  const skinConcerns = getMultipleOptions(
    formData,
    "skinConcerns",
    skinConcernOptions
  )
  const skinSensitivity = getOption(
    formData,
    "skinSensitivity",
    sensitivityOptions
  )
  const routineConsistency = getOption(
    formData,
    "routineConsistency",
    routineOptions
  )
  const allergiesOrSensitivities = getOptionalText(
    formData,
    "allergiesOrSensitivities",
    500
  )
  const primarySkinGoal = getOptionalText(formData, "primarySkinGoal", 300)

  if (!preferredName) errors.preferredName = "Enter your preferred name."
  if (!ageRange) errors.ageRange = "Select your age range."
  if (!selfReportedSkinType) {
    errors.selfReportedSkinType =
      "Select the option that best describes your skin."
  }
  if (skinConcerns.length === 0) {
    errors.skinConcerns = "Select at least one skin concern."
  }
  if (!skinSensitivity) {
    errors.skinSensitivity = "Select your skin sensitivity."
  }
  if (!routineConsistency) {
    errors.routineConsistency = "Select your current routine."
  }

  for (const consentName of [
    "cosmeticAcknowledgement",
    "imageProcessingConsent",
    "privacyConsent",
  ]) {
    if (formData.get(consentName) !== "accepted") {
      errors.consent = "All required consent statements must be accepted."
      break
    }
  }

  if (
    Object.keys(errors).length > 0 ||
    !preferredName ||
    !ageRange ||
    !selfReportedSkinType ||
    !skinSensitivity ||
    !routineConsistency
  ) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      preferredName,
      ageRange,
      genderIdentity,
      country,
      selfReportedSkinType,
      skinConcerns,
      skinSensitivity,
      routineConsistency,
      allergiesOrSensitivities,
      primarySkinGoal,
    },
  }
}

function getText(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

function getOptionalText(
  formData: FormData,
  name: string,
  maxLength: number
): string | null {
  return getText(formData, name, maxLength) || null
}

function getOption<T extends ReadonlyArray<{ value: string }>>(
  formData: FormData,
  name: string,
  options: T
): T[number]["value"] | null {
  const value = formData.get(name)
  return typeof value === "string" &&
    options.some((option) => option.value === value)
    ? value
    : null
}

function getOptionalOption<T extends ReadonlyArray<{ value: string }>>(
  formData: FormData,
  name: string,
  options: T
): T[number]["value"] | null {
  return getOption(formData, name, options)
}

function getMultipleOptions<T extends ReadonlyArray<{ value: string }>>(
  formData: FormData,
  name: string,
  options: T
): string[] {
  const allowedValues = new Set(options.map((option) => option.value))
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .filter((value) => allowedValues.has(value))
}
