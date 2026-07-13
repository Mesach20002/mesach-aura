import { getOpenWeatherApiKey } from "@/lib/weather/config"
import type {
  AirPollutionData,
  CurrentClimate,
  WeatherLocation,
} from "@/lib/weather/types"
import { isValidLatitude, isValidLongitude } from "@/lib/weather/validation"

const apiBaseUrl = "https://api.openweathermap.org"
const requestTimeoutMs = 8_000
const cacheSeconds = 15 * 60

export class OpenWeatherServiceError extends Error {
  constructor(message = "OpenWeather is temporarily unavailable.") {
    super(message)
    this.name = "OpenWeatherServiceError"
  }
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<CurrentClimate> {
  assertCoordinates(latitude, longitude)
  const apiKey = getOpenWeatherApiKey()
  const [weatherResult, airPollutionResult] = await Promise.allSettled([
    fetchCurrentWeather(latitude, longitude, apiKey),
    getAirPollution(latitude, longitude, apiKey),
  ])

  if (weatherResult.status === "rejected") {
    throw weatherResult.reason instanceof OpenWeatherServiceError
      ? weatherResult.reason
      : new OpenWeatherServiceError()
  }

  const weather = weatherResult.value
  const airPollution =
    airPollutionResult.status === "fulfilled"
      ? airPollutionResult.value
      : emptyAirPollution()

  return {
    ...weather,
    uvIndex: null,
    pm25: airPollution?.pm25 ?? null,
    pm10: airPollution?.pm10 ?? null,
    airQualityIndex: airPollution?.airQualityIndex ?? null,
  }
}

export async function getAirPollution(
  latitude: number,
  longitude: number,
  apiKey = getOpenWeatherApiKey()
): Promise<AirPollutionData | null> {
  assertCoordinates(latitude, longitude)
  const url = createUrl("/data/2.5/air_pollution", apiKey)
  url.searchParams.set("lat", String(latitude))
  url.searchParams.set("lon", String(longitude))

  const payload = await fetchProviderJson(url)
  const root = getRecord(payload)
  const first = Array.isArray(root?.list) ? getRecord(root.list[0]) : null
  const main = getRecord(first?.main)
  const components = getRecord(first?.components)

  if (!first) return null

  return {
    observedAt: unixSecondsToIso(getNumber(first.dt)),
    pm25: getNumber(components?.pm2_5),
    pm10: getNumber(components?.pm10),
    airQualityIndex: getNumber(main?.aqi),
  }
}

export async function getUvIndex(
  latitude: number,
  longitude: number
): Promise<number | null> {
  void latitude
  void longitude
  return null
}

export async function searchOpenWeatherLocations(
  query: string
): Promise<WeatherLocation[]> {
  const normalizedQuery = query.trim()

  if (normalizedQuery.length < 2 || normalizedQuery.length > 100) {
    throw new OpenWeatherServiceError(
      "Location search must be 2–100 characters."
    )
  }

  const url = createUrl("/geo/1.0/direct", getOpenWeatherApiKey())
  url.searchParams.set("q", normalizedQuery)
  url.searchParams.set("limit", "8")
  const payload = await fetchProviderJson(url)

  if (!Array.isArray(payload)) return []

  return payload.flatMap((item) => {
    const record = getRecord(item)
    const name = getString(record?.name)
    const latitude = getNumber(record?.lat)
    const longitude = getNumber(record?.lon)

    if (
      !name ||
      latitude === null ||
      longitude === null ||
      !isValidLatitude(latitude) ||
      !isValidLongitude(longitude)
    ) {
      return []
    }

    return [
      {
        name,
        region: getString(record?.state),
        country: getString(record?.country),
        latitude,
        longitude,
      },
    ]
  })
}

type RequiredWeather = Omit<
  CurrentClimate,
  "uvIndex" | "pm25" | "pm10" | "airQualityIndex"
>

async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<RequiredWeather> {
  const url = createUrl("/data/2.5/weather", apiKey)
  url.searchParams.set("lat", String(latitude))
  url.searchParams.set("lon", String(longitude))
  url.searchParams.set("units", "metric")

  const payload = await fetchProviderJson(url)
  const root = getRecord(payload)
  const coordinates = getRecord(root?.coord)
  const main = getRecord(root?.main)
  const wind = getRecord(root?.wind)
  const clouds = getRecord(root?.clouds)
  const system = getRecord(root?.sys)
  const firstWeather = Array.isArray(root?.weather)
    ? getRecord(root.weather[0])
    : null
  const temperature = getNumber(main?.temp)
  const feelsLike = getNumber(main?.feels_like)
  const humidity = getNumber(main?.humidity)
  const observedAt = unixSecondsToIso(getNumber(root?.dt))

  if (
    temperature === null ||
    feelsLike === null ||
    humidity === null ||
    !observedAt
  ) {
    throw new OpenWeatherServiceError()
  }

  return {
    provider: "openweather",
    location: {
      name: getString(root?.name),
      country: getString(system?.country),
      latitude: getNumber(coordinates?.lat) ?? latitude,
      longitude: getNumber(coordinates?.lon) ?? longitude,
    },
    observedAt,
    temperatureCelsius: temperature,
    feelsLikeCelsius: feelsLike,
    humidityPercent: humidity,
    pressureHpa: getNumber(main?.pressure),
    windSpeedMps: getNumber(wind?.speed),
    cloudCoverPercent: getNumber(clouds?.all),
    visibilityMeters: getNumber(root?.visibility),
    condition: getString(firstWeather?.main) ?? "Unavailable",
    description: getString(firstWeather?.description) ?? "Unavailable",
    weatherIconCode: getString(firstWeather?.icon),
  }
}

async function fetchProviderJson(url: URL): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(url, {
      next: { revalidate: cacheSeconds },
      signal: AbortSignal.timeout(requestTimeoutMs),
    })
  } catch {
    throw new OpenWeatherServiceError()
  }

  if (!response.ok) throw new OpenWeatherServiceError()

  try {
    return (await response.json()) as unknown
  } catch {
    throw new OpenWeatherServiceError()
  }
}

function createUrl(pathname: string, apiKey: string): URL {
  const url = new URL(pathname, apiBaseUrl)
  url.searchParams.set("appid", apiKey)
  return url
}

function assertCoordinates(latitude: number, longitude: number): void {
  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    throw new OpenWeatherServiceError("Invalid climate coordinates.")
  }
}

function emptyAirPollution(): AirPollutionData {
  return {
    observedAt: null,
    pm25: null,
    pm10: null,
    airQualityIndex: null,
  }
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function unixSecondsToIso(value: number | null): string | null {
  if (value === null) return null
  const date = new Date(value * 1_000)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}
