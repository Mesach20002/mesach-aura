export type AiProvider = "mock" | "gemini"

export function getAiProvider(): AiProvider {
  return process.env.AI_PROVIDER === "gemini" ? "gemini" : "mock"
}
