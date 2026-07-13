import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { IconCloud } from "@tabler/icons-react"

import { ClimateStep } from "@/components/climate/climate-step"
import { getCurrentUser } from "@/lib/auth/session"
import { hasCompletedLatestConsent } from "@/lib/consent/service"
import {
  verifyWeatherContextToken,
  WEATHER_CONTEXT_COOKIE,
} from "@/lib/weather/context"

export default async function ClimatePage() {
  const user = await getCurrentUser()

  if (!user) redirect("/login?redirect=/climate")
  if (!(await hasCompletedLatestConsent(user.id))) redirect("/consent")

  const token = (await cookies()).get(WEATHER_CONTEXT_COOKIE)?.value
  const initialClimate = token
    ? verifyWeatherContextToken(token, user.id)
    : null

  return (
    <div className="space-y-8">
      <header className="space-y-5 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <IconCloud className="size-6" aria-hidden />
        </span>
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Local climate context
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Conditions around you
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Current weather can help tailor cosmetic routine guidance. Choose a
            one-time location, search for a city, or continue without climate
            data.
          </p>
        </div>
      </header>

      <ClimateStep initialClimate={initialClimate} />
    </div>
  )
}
