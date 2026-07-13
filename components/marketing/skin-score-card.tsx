import {
  IconDroplet,
  IconRosetteDiscountCheck,
  IconSparkles,
  type Icon,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

export function SkinScoreCard() {
  return (
    <div className="w-full rounded-2xl border border-background/70 bg-background/90 p-4 shadow-xl backdrop-blur-xl sm:w-72 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Your Skin Score
          </p>
          <p className="mt-1 font-heading text-3xl font-semibold text-foreground">
            82<span className="text-base text-muted-foreground">/100</span>
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <IconSparkles className="size-4" aria-hidden />
        </span>
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Skin score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={82}
      >
        <div className="h-full w-4/5 rounded-full bg-primary" />
      </div>

      <div className="mt-4 space-y-3">
        <SkinStatus icon={IconDroplet} label="Hydration" status="Moderate" />
        <SkinStatus
          icon={IconRosetteDiscountCheck}
          label="Redness"
          status="Low"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
        <IconSparkles className="size-4" aria-hidden />
        Healthy Glow
      </div>
    </div>
  )
}

function SkinStatus({
  icon: StatusIcon,
  label,
  status,
}: {
  icon: Icon
  label: string
  status: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-foreground">
        <StatusIcon className="size-4 text-primary" aria-hidden />
        {label}
      </span>
      <Badge
        variant="secondary"
        className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground"
      >
        {status}
      </Badge>
    </div>
  )
}
