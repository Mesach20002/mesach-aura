import type { SkinAssessment } from "@/lib/ai/types"

export async function analyzeSkinImageWithGemini(
  image: File
): Promise<SkinAssessment> {
  void image

  // Server-only placeholder. Do not import this module into React components.
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.")
  }

  // TODO(ai): Install the approved Google Gemini SDK and implement image bytes/base64
  // conversion, SKIN_ANALYSIS_SYSTEM_PROMPT submission, JSON parsing, and validation here.
  throw new Error(
    "Gemini SDK is not installed. Install the approved Google Gemini SDK before enabling AI_PROVIDER=gemini."
  )
}
