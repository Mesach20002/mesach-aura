import {
  IconChartBar,
  IconDeviceMobile,
  IconFileAnalytics,
  IconScan,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

const concernBands = [
  { label: "Hydration", value: "Moderate" },
  { label: "Texture", value: "Moderate" },
  { label: "Pores", value: "High" },
  { label: "Redness", value: "Low" },
] as const

const analytics = [
  { label: "Scans", value: "1.8k" },
  { label: "Reports", value: "1.6k" },
  { label: "Intent", value: "High" },
] as const

export function PlatformMockup() {
  return (
    <div className="relative rounded-lg border border-border bg-card p-4 shadow-lg">
      {/* TODO(assets): Add brand-approved images in public/images/landing/ when available. */}
      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconDeviceMobile
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Scan preview
              </span>
            </div>
            <Badge variant="secondary">Live</Badge>
          </div>
          <div className="mt-5 aspect-[9/14] rounded-lg border border-border bg-card p-3">
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-background text-center">
              <span className="flex size-14 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm">
                <IconScan className="size-7" aria-hidden />
              </span>
              <div className="space-y-1 px-4">
                <p className="font-heading text-base font-semibold text-foreground">
                  Consent-first scan
                </p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Camera capture or secure upload
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Cosmetic report
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-foreground">
                  Skin insight bands
                </h3>
              </div>
              <IconFileAnalytics
                className="size-5 text-muted-foreground"
                aria-hidden
              />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {concernBands.map((band) => (
                <div
                  key={band.label}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <p className="text-xs text-muted-foreground">{band.label}</p>
                  <p className="mt-1 font-heading text-sm font-semibold text-foreground">
                    {band.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <IconChartBar
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Admin analytics
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {analytics.map((item: any) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-heading text-base font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
