import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth/session"
import { hasCompletedLatestConsent } from "@/lib/consent/service"
import {
  createWeatherContextToken,
  roundClimateCoordinates,
  WEATHER_CONTEXT_COOKIE,
} from "@/lib/weather/context"
import { OpenWeatherConfigurationError } from "@/lib/weather/config"
import {
  getCurrentWeather,
  OpenWeatherServiceError,
} from "@/lib/weather/openweather"
import { parseCoordinates } from "@/lib/weather/validation"

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

  const searchParams = new URL(request.url).searchParams
  const coordinates = parseCoordinates(
    searchParams.get("lat"),
    searchParams.get("lon")
  )

  if (!coordinates) {
    return NextResponse.json(
      { error: "Valid latitude and longitude are required." },
      { status: 400 }
    )
  }

  try {
    const climate = roundClimateCoordinates(
      await getCurrentWeather(coordinates.latitude, coordinates.longitude)
    )
    const response = NextResponse.json({ climate })
    response.cookies.set(
      WEATHER_CONTEXT_COOKIE,
      createWeatherContextToken(user.id, climate),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      }
    )
    response.headers.set("Cache-Control", "private, no-store")
    return response
  } catch (error: unknown) {
    if (error instanceof OpenWeatherConfigurationError) {
      return NextResponse.json(
        { error: "Climate service is not configured." },
        { status: 503 }
      )
    }

    if (process.env.NODE_ENV === "development") {
      console.error(
        "OpenWeather climate request failed.",
        error instanceof OpenWeatherServiceError
          ? error.message
          : "Unknown error"
      )
    }

    return NextResponse.json(
      { error: "Climate conditions are temporarily unavailable." },
      { status: 502 }
    )
  }
}

export async function DELETE() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Authentication is required." },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ cleared: true })
  response.cookies.set(WEATHER_CONTEXT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}
