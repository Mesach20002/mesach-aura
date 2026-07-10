import {
  IconChartArcs,
  IconFileAnalytics,
  IconSparkles,
  IconTargetArrow,
  type Icon,
} from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminStat, AdminStatIconName } from "@/lib/admin/types"

const statIcons: Record<AdminStatIconName, Icon> = {
  scans: IconChartArcs,
  reports: IconFileAnalytics,
  recommendations: IconSparkles,
  conversionIntent: IconTargetArrow,
}

interface AdminStatsCardsProps {
  stats: AdminStat[]
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <section
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      aria-label="Admin dashboard metrics"
    >
      {stats.map((stat) => {
        const StatIcon = statIcons[stat.iconName]

        return (
          <Card
            key={stat.label}
            className="rounded-lg border border-border shadow-sm"
          >
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-xs text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm">
                  <StatIcon className="size-4" aria-hidden />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {stat.helper}
              </p>
              <p className="mt-4 text-xs font-medium tracking-widest text-foreground uppercase">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
