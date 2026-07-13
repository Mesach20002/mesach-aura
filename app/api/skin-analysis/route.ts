import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { analyzeSkinImage } from "@/lib/ai/adapter"
import { getCurrentUser } from "@/lib/auth/session"
import { hasCompletedLatestConsent } from "@/lib/consent/service"
import { createReportFromAssessment } from "@/lib/reports/service"
import { storeFile } from "@/lib/storage/storage-service"
import {
  verifyWeatherContextToken,
  WEATHER_CONTEXT_COOKIE,
} from "@/lib/weather/context"
import { getClimateRecommendations } from "@/lib/weather/recommendations"

const maxImageSizeBytes = 5 * 1024 * 1024
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"])

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication is required before analyzing images." },
        { status: 401 }
      )
    }

    if (!(await hasCompletedLatestConsent(user.id))) {
      return NextResponse.json(
        { error: "Required consent must be completed before skin analysis." },
        { status: 403 }
      )
    }

    const weatherToken = (await cookies()).get(WEATHER_CONTEXT_COOKIE)?.value
    const climate = weatherToken
      ? verifyWeatherContextToken(weatherToken, user.id)
      : null

    const formData = await request.formData()
    const image = formData.get("image")
    const retainImage = formData.get("retainImage") === "true"

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 }
      )
    }

    if (!allowedImageTypes.has(image.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, or WebP image files are supported." },
        { status: 400 }
      )
    }

    if (image.size > maxImageSizeBytes) {
      return NextResponse.json(
        { error: "Image files must be 5 MB or smaller." },
        { status: 400 }
      )
    }

    // Phase 1 stores the generated report only, not the uploaded image.
    const assessment = await analyzeSkinImage(image)
    const report = await createReportFromAssessment(
      assessment,
      user.id,
      climate
        ? {
            snapshot: climate,
            recommendations: getClimateRecommendations(climate),
          }
        : undefined
    )
    let imageRetentionWarning: string | undefined

    if (retainImage) {
      try {
        await storeFile({
          file: image,
          folder: "skin-scans",
          visibility: "private",
        })
      } catch {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Optional image retention skipped: storage backend unavailable."
          )
        }

        imageRetentionWarning =
          "Optional image retention was requested, but storage backend is not configured. The scan report was generated without storing the uploaded image."
      }
    }

    if (imageRetentionWarning) {
      return NextResponse.json({
        reportId: report.id,
        warning: imageRetentionWarning,
      })
    }

    return NextResponse.json({ reportId: report.id })
  } catch (error) {
    logSkinAnalysisError("Unable to create skin report.", error)

    return NextResponse.json(
      { error: "Unable to create skin report." },
      { status: 500 }
    )
  }
}

function logSkinAnalysisError(message: string, error: unknown): void {
  if (process.env.NODE_ENV === "production") {
    console.error(message)
    return
  }

  console.error(message, error)
}
