import { analyzeSkinImageWithGemini } from "@/lib/ai/gemini-adapter"
import { analyzeSkinImageWithMockAdapter } from "@/lib/ai/mock-adapter"
import { getAiProvider } from "@/lib/ai/provider"
import type { SkinAssessment } from "@/lib/ai/types"

export async function analyzeSkinImage(image: File): Promise<SkinAssessment> {
  const provider = getAiProvider()

  if (provider === "gemini") {
    return analyzeSkinImageWithGemini(image)
  }

  return analyzeSkinImageWithMockAdapter(image)
}
