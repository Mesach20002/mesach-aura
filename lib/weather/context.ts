import { createHmac, timingSafeEqual } from "node:crypto"

import type { CurrentClimate } from "@/lib/weather/types"

export const WEATHER_CONTEXT_COOKIE = "aurora_weather_context"
const lifetimeMs = 60 * 60 * 1_000

type WeatherContextPayload = {
  kind: "weather"
  version: 1
  userId: string
  expiresAt: number
  climate: CurrentClimate
}

export function createWeatherContextToken(
  userId: string,
  climate: CurrentClimate
): string {
  const payload: WeatherContextPayload = {
    kind: "weather",
    version: 1,
    userId,
    expiresAt: Date.now() + lifetimeMs,
    climate: roundClimateCoordinates(climate),
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${encoded}.${sign(encoded)}`
}

export function verifyWeatherContextToken(
  token: string,
  userId: string
): CurrentClimate | null {
  const [encoded, suppliedSignature, extra] = token.split(".")
  if (!encoded || !suppliedSignature || extra) return null

  const expectedSignature = sign(encoded)
  const supplied = Buffer.from(suppliedSignature)
  const expected = Buffer.from(expectedSignature)

  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return null
  }

  try {
    const value: unknown = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    )
    const payload = getRecord(value)

    if (
      payload?.kind !== "weather" ||
      payload.version !== 1 ||
      payload.userId !== userId ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt < Date.now() ||
      !isCurrentClimate(payload.climate)
    ) {
      return null
    }

    return payload.climate
  } catch {
    return null
  }
}

export function roundClimateCoordinates(
  climate: CurrentClimate
): CurrentClimate {
  return {
    ...climate,
    location: {
      ...climate.location,
      latitude: Math.round(climate.location.latitude * 100) / 100,
      longitude: Math.round(climate.location.longitude * 100) / 100,
    },
  }
}

function sign(value: string): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim()
  if (!secret) throw new Error("A server-side signing secret is required.")
  return createHmac("sha256", secret).update(value).digest("base64url")
}

function isCurrentClimate(value: unknown): value is CurrentClimate {
  const record = getRecord(value)
  const location = getRecord(record?.location)
  return (
    record?.provider === "openweather" &&
    typeof record.observedAt === "string" &&
    typeof record.temperatureCelsius === "number" &&
    typeof record.feelsLikeCelsius === "number" &&
    typeof record.humidityPercent === "number" &&
    typeof location?.latitude === "number" &&
    typeof location.longitude === "number"
  )
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null
}
