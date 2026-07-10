import { NextResponse } from "next/server"

const placeholderApiKeys = new Set([
  "your_api_key_here",
  "your_key_here",
  "your_real_key",
  "your_real_key_here",
])

export function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 })
  }

  const geminiApiKey = process.env.GEMINI_API_KEY
  const hasUsableGeminiKey = Boolean(
    geminiApiKey && !placeholderApiKeys.has(geminiApiKey)
  )

  return NextResponse.json({
    provider: process.env.REPORT_CHAT_PROVIDER,
    geminiConfigured: hasUsableGeminiKey,
    keyPreview: geminiApiKey
      ? `${geminiApiKey.substring(0, 6)}...${geminiApiKey.substring(
          geminiApiKey.length - 4
        )}`
      : null,
  })
}
