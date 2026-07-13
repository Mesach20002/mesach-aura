"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconAlertTriangle,
  IconCloud,
  IconDroplet,
  IconExternalLink,
  IconGauge,
  IconLoader2,
  IconMapPin,
  IconRefresh,
  IconSearch,
  IconSun,
  IconTemperature,
  IconWind,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getClimateRecommendations } from "@/lib/weather/recommendations"
import type {
  ClimateRecommendation,
  CurrentClimate,
  WeatherLocation,
} from "@/lib/weather/types"

type ClimateApiResponse = { climate: CurrentClimate; error?: string }
type ClimateRequest = { latitude: number; longitude: number }

export function ClimateStep({
  initialClimate,
}: {
  initialClimate: CurrentClimate | null
}) {
  const router = useRouter()
  const [climate, setClimate] = useState<CurrentClimate | null>(initialClimate)
  const [status, setStatus] = useState<
    "initial" | "requesting-location" | "loading" | "success" | "error"
  >(initialClimate ? "success" : "initial")
  const [errorMessage, setErrorMessage] = useState("")
  const [showManualSearch, setShowManualSearch] = useState(false)
  const [query, setQuery] = useState("")
  const [locations, setLocations] = useState<WeatherLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastRequest, setLastRequest] = useState<ClimateRequest | null>(() =>
    initialClimate
      ? {
          latitude: initialClimate.location.latitude,
          longitude: initialClimate.location.longitude,
        }
      : null
  )

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (!showManualSearch || normalizedQuery.length < 2) return

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsSearching(true)

      try {
        const response = await fetch(
          `/api/climate/locations?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal }
        )
        const result = (await response.json()) as {
          locations?: WeatherLocation[]
          error?: string
        }

        if (!response.ok) {
          throw new Error(result.error || "Location search failed.")
        }

        setLocations(result.locations ?? [])
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setLocations([])
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Location search is temporarily unavailable."
        )
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 400)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [query, showManualSearch])

  function requestCurrentLocation() {
    setErrorMessage("")
    setStatus("requesting-location")

    if (!navigator.geolocation) {
      setStatus("error")
      setShowManualSearch(true)
      setErrorMessage(
        "Location access is unavailable in this browser. Choose a city instead."
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const request = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setLastRequest(request)
        void loadClimate(request)
      },
      (error) => {
        setStatus("error")
        setShowManualSearch(true)
        setErrorMessage(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Search for your city below instead."
            : "Your location could not be determined. Search for your city below."
        )
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 15 * 60 * 1_000,
      }
    )
  }

  async function loadClimate(request: ClimateRequest) {
    setStatus("loading")
    setErrorMessage("")
    const search = new URLSearchParams({
      lat: String(request.latitude),
      lon: String(request.longitude),
    })

    try {
      const response = await fetch(`/api/climate/current?${search.toString()}`)
      const result = (await response.json()) as ClimateApiResponse

      if (!response.ok || !result.climate) {
        throw new Error(result.error || "Climate conditions are unavailable.")
      }

      setClimate(result.climate)
      setStatus("success")
    } catch (error: unknown) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Climate conditions are temporarily unavailable."
      )
    }
  }

  function selectLocation(location: WeatherLocation) {
    const request = {
      latitude: location.latitude,
      longitude: location.longitude,
    }
    setLastRequest(request)
    setShowManualSearch(false)
    setQuery("")
    setLocations([])
    void loadClimate(request)
  }

  function toggleManualSearch() {
    if (showManualSearch) {
      setQuery("")
      setLocations([])
      setIsSearching(false)
    }
    setShowManualSearch(!showManualSearch)
  }

  function updateQuery(value: string) {
    setQuery(value)
    if (value.trim().length < 2) {
      setLocations([])
      setIsSearching(false)
    }
  }

  async function continueWithoutClimate() {
    try {
      await fetch("/api/climate/current", { method: "DELETE" })
    } finally {
      router.push("/scan")
    }
  }

  return (
    <div className="space-y-6">
      {!climate ? (
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconMapPin className="size-5" aria-hidden />
            </span>
            <div className="space-y-2">
              <CardTitle className="font-heading text-2xl tracking-normal normal-case">
                Choose your climate location
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Aurora requests your location once to retrieve current
                conditions. Continuous location tracking is never used.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                onClick={requestCurrentLocation}
                disabled={
                  status === "requesting-location" || status === "loading"
                }
              >
                {status === "requesting-location" ? (
                  <IconLoader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <IconMapPin className="size-4" aria-hidden />
                )}
                Use my current location
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={toggleManualSearch}
              >
                <IconSearch className="size-4" aria-hidden />
                Choose city manually
              </Button>
            </div>

            {status === "loading" ? (
              <StatusMessage>
                Loading current weather and air quality...
              </StatusMessage>
            ) : null}

            {errorMessage ? (
              <div
                className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
                role="alert"
              >
                <IconAlertTriangle
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                {errorMessage}
              </div>
            ) : null}

            {showManualSearch ? (
              <div className="space-y-3 rounded-xl border border-border bg-background p-4">
                <Label htmlFor="weather-city">Search for a city</Label>
                <div className="flex items-center gap-3 border-b border-border">
                  <IconSearch
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="weather-city"
                    value={query}
                    maxLength={100}
                    placeholder="e.g. Kampala"
                    autoComplete="off"
                    onChange={(event) => updateQuery(event.target.value)}
                  />
                  {isSearching ? (
                    <IconLoader2
                      className="size-4 animate-spin text-muted-foreground"
                      aria-label="Searching"
                    />
                  ) : null}
                </div>
                {locations.length > 0 ? (
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {locations.map((location) => (
                      <li
                        key={`${location.name}-${location.latitude}-${location.longitude}`}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-4 p-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                          onClick={() => selectLocation(location)}
                        >
                          <span>
                            <span className="block text-sm font-medium text-foreground">
                              {location.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {[location.region, location.country]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </span>
                          <IconMapPin
                            className="size-4 shrink-0 text-primary"
                            aria-hidden
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              onClick={() => void continueWithoutClimate()}
            >
              Continue without climate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ClimateSummary climate={climate} />
      )}

      {climate ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            className="sm:flex-1"
            onClick={() => router.push("/scan")}
          >
            Continue to skin scan
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={!lastRequest || status === "loading"}
            onClick={() => lastRequest && void loadClimate(lastRequest)}
          >
            <IconRefresh className="size-4" aria-hidden />
            Refresh conditions
          </Button>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={() => {
              setClimate(null)
              setStatus("initial")
              setShowManualSearch(false)
            }}
          >
            Change location
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
      <IconLoader2 className="size-4 animate-spin" aria-hidden />
      {children}
    </div>
  )
}

function ClimateSummary({ climate }: { climate: CurrentClimate }) {
  const recommendations = getClimateRecommendations(climate)
  const metrics = [
    {
      label: "Temperature",
      value: formatMetric(climate.temperatureCelsius, "°C"),
      icon: IconTemperature,
    },
    {
      label: "Feels like",
      value: formatMetric(climate.feelsLikeCelsius, "°C"),
      icon: IconCloud,
    },
    {
      label: "Humidity",
      value: `${Math.round(climate.humidityPercent)}%`,
      icon: IconDroplet,
    },
    {
      label: "Wind",
      value: formatMetric(climate.windSpeedMps, " m/s"),
      icon: IconWind,
    },
    {
      label: "Air quality",
      value: formatAirQuality(climate.airQualityIndex),
      icon: IconGauge,
    },
    { label: "UV index", value: formatMetric(climate.uvIndex), icon: IconSun },
  ] as const

  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
      <CardHeader className="gap-4 border-b border-primary/15">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge className="rounded-full bg-primary/10 text-primary">
              Current local climate
            </Badge>
            <CardTitle className="font-heading text-2xl tracking-normal normal-case">
              {climate.location.name ?? "Selected location"}
              {climate.location.country ? `, ${climate.location.country}` : ""}
            </CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {climate.description} · Retrieved{" "}
              {formatObservedAt(climate.observedAt)}
            </p>
          </div>
          <IconCloud className="size-8 text-primary" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => {
            const MetricIcon = metric.icon
            return (
              <div
                key={metric.label}
                className="rounded-xl border border-border bg-background p-4"
              >
                <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <MetricIcon className="size-4 text-primary" aria-hidden />
                  {metric.label}
                </dt>
                <dd className="mt-2 font-heading text-lg font-semibold text-foreground">
                  {metric.value}
                </dd>
              </div>
            )
          })}
        </dl>

        {recommendations.length > 0 ? (
          <RecommendationList recommendations={recommendations} />
        ) : (
          <p className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
            No additional climate-specific cosmetic adjustments are suggested
            for the available conditions.
          </p>
        )}

        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Weather data provided by OpenWeather
          <IconExternalLink className="size-3" aria-hidden />
        </a>
      </CardContent>
    </Card>
  )
}

function RecommendationList({
  recommendations,
}: {
  recommendations: ClimateRecommendation[]
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Cosmetic routine context
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.code}
            className="rounded-xl border border-border bg-background p-4"
          >
            <p className="font-medium text-foreground">
              {recommendation.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {recommendation.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatMetric(value: number | null, suffix = ""): string {
  return value === null
    ? "Unavailable"
    : `${Math.round(value * 10) / 10}${suffix}`
}

function formatAirQuality(value: number | null): string {
  if (value === null) return "Unavailable"
  const labels = ["", "Good", "Fair", "Moderate", "Poor", "Very poor"]
  return labels[Math.round(value)] ?? `Index ${Math.round(value)}`
}

function formatObservedAt(value: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return "recently"
  }
}
