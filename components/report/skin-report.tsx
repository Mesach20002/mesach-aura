import {
  IconCalendar,
  IconFileAnalytics,
  IconShieldCheck,
} from "@tabler/icons-react"
import Link from "next/link"

import { ConcernBandCard } from "@/components/report/concern-band-card"
import { ClimateContextCard } from "@/components/report/climate-context-card"
import { DownloadReportButton } from "@/components/report/download-report-button"
import { ProductRecommendations } from "@/components/report/product-recommendations"
import { ReportAiChat } from "@/components/report/report-ai-chat"
import { SkinSummaryCard } from "@/components/report/skin-summary-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SeverityBand, SkinConcern } from "@/lib/ai/types"
import type { SkinReport as SkinReportType } from "@/lib/reports/types"

interface SkinReportProps {
  report: SkinReportType
}

export function SkinReport({ report }: SkinReportProps) {
  const concerns = Object.entries(report.assessment.concerns) as Array<
    [SkinConcern, SeverityBand]
  >

  return (
    <article className="mx-auto max-w-6xl space-y-8 px-6 py-10 print:px-0">
      <header className="rounded-lg border border-border bg-card p-6 shadow-sm print:hidden">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Badge className="rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
              Aurora SkinSense report
            </Badge>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
                Your skin intelligence report
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Review your cosmetic skin report, coarse bands, wellness
                guidance, and Aurora product suggestions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <IconFileAnalytics className="size-4" aria-hidden />
                Report {report.id}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <IconCalendar className="size-4" aria-hidden />
                {formatReportDate(report.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button asChild variant="outline">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <DownloadReportButton />
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-8">
          <section
            aria-labelledby="report-summary-heading"
            className="space-y-4"
          >
            <div className="space-y-2">
              <h2
                id="report-summary-heading"
                className="font-heading text-xl font-semibold text-foreground"
              >
                Report Summary
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Your appearance-based cosmetic report overview.
              </p>
            </div>
            <SkinSummaryCard
              reportId={report.id}
              createdAt={formatReportDate(report.createdAt)}
              skinType={report.assessment.skinType}
              summary={report.assessment.summary}
            />
          </section>

          {report.climate ? (
            <ClimateContextCard climate={report.climate} />
          ) : null}

          <section aria-labelledby="skin-bands-heading" className="space-y-4">
            <div className="space-y-2">
              <h2
                id="skin-bands-heading"
                className="font-heading text-xl font-semibold text-foreground"
              >
                Skin Insight Bands
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Coarse low, moderate, and high appearance-based bands.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {concerns.map(([concern, band]) => (
                <ConcernBandCard key={concern} concern={concern} band={band} />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="wellness-guidance-heading"
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <div className="max-w-2xl">
              <h2
                id="wellness-guidance-heading"
                className="font-heading text-xl font-semibold text-foreground"
              >
                Wellness Guidance
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Suggested cosmetic care considerations based on the report
                context.
              </p>
            </div>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
              {report.assessment.guidance.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside
          aria-labelledby="aurora-chat-section-heading"
          className="space-y-4 lg:sticky lg:top-6"
        >
          <div className="space-y-2">
            <h2
              id="aurora-chat-section-heading"
              className="font-heading text-xl font-semibold text-foreground"
            >
              Aurora AI Chat
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Ask follow-up questions about your cosmetic skin report.
            </p>
          </div>
          <ReportAiChat reportId={report.id} initialReport={report} />
        </aside>
      </div>

      <ProductRecommendations recommendations={report.recommendations} />

      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="font-heading text-sm font-semibold text-foreground">
          Privacy controls
        </h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Image processing</dt>
            <dd className="mt-1 font-medium text-foreground">
              {report.privacy.imageStored
                ? "Optional image retention enabled"
                : "Uploaded image not stored"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Optional image retention</dt>
            <dd className="mt-1 font-medium text-foreground">
              {report.privacy.imageRetentionConsent
                ? "Consented"
                : "Not enabled"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="flex items-start gap-3 rounded-lg border border-border bg-card p-6 shadow-sm">
        <IconShieldCheck
          className="mt-0.5 size-5 text-muted-foreground"
          aria-hidden
        />
        <div>
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Cosmetic and wellness disclaimer
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {report.assessment.disclaimer}
          </p>
        </div>
      </section>
    </article>
  )
}

function formatReportDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
