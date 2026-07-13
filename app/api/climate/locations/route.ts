import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth/session"
import { hasCompletedLatestConsent } from "@/lib/consent/service"
import { OpenWeatherConfigurationError } from "@/lib/weather/config"
import { searchOpenWeatherLocations } from "@/lib/weather/openweather"

export async function GET(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 }
    )
  }

  if (!(await hasCompletedLatestConsent(user.id))) {
    return NextResponse.json(
      { error: "Required consent must be completed first." },
      { status: 403 }
    )
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? ""

  if (query.length < 2 || query.length > 100) {
    return NextResponse.json(
      { error: "Location search must be 2–100 characters." },
      { status: 400 }
    )
  }

  try {
    const locations = await searchOpenWeatherLocations(query)
    return NextResponse.json({ locations })
  } catch (error: unknown) {
    if (error instanceof OpenWeatherConfigurationError) {
      return NextResponse.json(
        { error: "Climate service is not configured." },
        { status: 503 }
      )
    }

    if (process.env.NODE_ENV === "development") {
      console.error("OpenWeather location search failed.")
    }

    return NextResponse.json(
      { error: "Location search is temporarily unavailable." },
      { status: 502 }
    )
  }
}
