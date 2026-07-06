import {
  IconActivityHeartbeat,
  IconChartBar,
  IconFileAnalytics,
  IconUsers,
} from "@tabler/icons-react"

import type { AdminAnalyticsSummary } from "@/types"

interface AnalyticsCardsProps {
  summary: AdminAnalyticsSummary
}

export function AnalyticsCards({ summary }: AnalyticsCardsProps) {
  const cards = [
    {
      label: "Total users",
      value: summary.totalUsers.toLocaleString(),
      detail: "Registered profiles",
      icon: IconUsers,
    },
    {
      label: "Total scans",
      value: summary.totalScans.toLocaleString(),
      detail: `${summary.scansThisWeek.toLocaleString()} this week`,
      icon: IconActivityHeartbeat,
    },
    {
      label: "Reports downloaded",
      value: summary.reportDownloads.toLocaleString(),
      detail: "PDF exports",
      icon: IconFileAnalytics,
    },
    {
      label: "Average score",
      value: summary.avgOverallScore.toFixed(1),
      detail: "Overall skin score",
      icon: IconChartBar,
    },
  ] as const

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div key={card.label} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {card.label}
              </p>
              <Icon className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <p className="mt-4 text-3xl font-medium text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
          </div>
        )
      })}
    </section>
  )
}
