import {
  IconChartArcs,
  IconFileAnalytics,
  IconPackage,
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
  products: IconPackage,
  conversionIntent: IconTargetArrow,
}

interface AdminStatsCardsProps {
  stats: AdminStat[]
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <section
      className="gap-4 md:grid-cols-2 xl:grid-cols-5 grid"
      aria-label="Admin dashboard metrics"
    >
      {stats.map((stat) => {
        const StatIcon = statIcons[stat.iconName]

        return (
          <Card
            key={stat.label}
            className="rounded-lg border-border shadow-sm border"
          >
            <CardHeader className="gap-3">
              <div className="gap-4 flex items-start justify-between">
                <CardTitle className="text-xs text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <span className="size-10 rounded-lg border-border bg-background text-muted-foreground shadow-sm flex items-center justify-center border">
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
