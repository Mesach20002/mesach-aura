import {
  IconCloud,
  IconDroplet,
  IconExternalLink,
  IconGauge,
  IconSun,
  IconTemperature,
} from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ClimateReportContext } from "@/lib/weather/types"

export function ClimateContextCard({
  climate,
}: {
  climate: ClimateReportContext
}) {
  const metrics = [
    {
      label: "Temperature",
      value: `${round(climate.snapshot.temperatureCelsius)}°C`,
      icon: IconTemperature,
    },
    {
      label: "Humidity",
      value: `${Math.round(climate.snapshot.humidityPercent)}%`,
      icon: IconDroplet,
    },
    {
      label: "Condition",
      value: climate.snapshot.condition,
      icon: IconCloud,
    },
    {
      label: "Air quality",
      value: formatAirQuality(climate.snapshot.airQualityIndex),
      icon: IconGauge,
    },
    {
      label: "UV index",
      value:
        climate.snapshot.uvIndex === null
          ? "Unavailable"
          : round(climate.snapshot.uvIndex),
      icon: IconSun,
    },
  ] as const

  return (
    <section aria-labelledby="local-climate-heading">
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader>
          <CardTitle
            id="local-climate-heading"
            className="font-heading text-xl tracking-normal normal-case"
          >
            Your Local Climate
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {[climate.snapshot.location.name, climate.snapshot.location.country]
              .filter(Boolean)
              .join(", ") || "Selected location"}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => {
              const MetricIcon = metric.icon
              return (
                <div
                  key={metric.label}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <MetricIcon className="size-4 text-primary" aria-hidden />
                    {metric.label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-foreground">
                    {metric.value}
                  </dd>
                </div>
              )
            })}
          </dl>

          {climate.recommendations.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Climate-aware cosmetic guidance
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {climate.recommendations.map((recommendation) => (
                  <li
                    key={recommendation.code}
                    className="rounded-lg border border-border bg-background p-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {recommendation.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {recommendation.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Weather data provided by OpenWeather
            <IconExternalLink className="size-3" aria-hidden />
          </a>
        </CardContent>
      </Card>
    </section>
  )
}

function round(value: number): string {
  return String(Math.round(value * 10) / 10)
}

function formatAirQuality(value: number | null): string {
  if (value === null) return "Unavailable"
  const labels = ["", "Good", "Fair", "Moderate", "Poor", "Very poor"]
  return labels[Math.round(value)] ?? `Index ${Math.round(value)}`
}
