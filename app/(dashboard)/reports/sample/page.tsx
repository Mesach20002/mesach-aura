import { IconFileAnalytics } from "@tabler/icons-react"

import { ProductRecommendations } from "@/components/report/product-recommendations"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductRecommendations } from "@/lib/recommendations/engine"

const sampleReport = {
  skinType: "Combination",
  summary:
    "This sample report shows how Aurora SkinSense presents privacy-first skin insights from a cosmetic skin assessment. Results are grouped into coarse bands so users can understand overall wellness guidance without invented precision.",
  findings: [
    { label: "Hydration", band: "Moderate" },
    { label: "Texture", band: "Balanced" },
    { label: "Pores", band: "Moderate" },
    { label: "Redness", band: "Low" },
    { label: "Pigmentation", band: "Mild" },
  ],
  disclaimer:
    "Aurora SkinSense provides cosmetic and wellness guidance only and is not a medical diagnostic tool.",
} as const

const sampleRecommendations = getSampleRecommendations()

function getSampleRecommendations() {
  return getProductRecommendations({
    skinType: sampleReport.skinType,
    concerns: [
      "hydration",
      "dryness",
      "uneven texture",
      "redness",
      "pigmentation appearance",
      "combination skin",
    ],
    severityBands: {
      hydration: "moderate",
      dryness: "moderate",
      "uneven texture": "low",
      redness: "low",
      "pigmentation appearance": "moderate",
    },
  })
}

export default function SampleReport() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Sample report
        </p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          AI Skin Assessment &amp; Report Engine
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Preview the structured report experience users receive after the scan
          flow, image processing, and AI cosmetic assessment.
        </p>
      </header>

      <Card className="rounded-lg border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IconFileAnalytics
                  className="size-5 text-muted-foreground"
                  aria-hidden
                />
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Aurora SkinSense report preview
                </p>
              </div>
              <CardTitle className="text-2xl normal-case">
                Cosmetic skin assessment
              </CardTitle>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Skin type
              </p>
              <p className="mt-2 font-heading text-xl font-semibold text-foreground">
                {sampleReport.skinType}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          <section className="space-y-3" aria-labelledby="summary-heading">
            <h2
              id="summary-heading"
              className="font-heading text-xl font-semibold text-foreground"
            >
              AI summary
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {sampleReport.summary}
            </p>
          </section>

          <section
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            aria-label="Sample skin insight bands"
          >
            {sampleReport.findings.map((finding) => (
              <div
                key={finding.label}
                className="rounded-lg border border-border bg-background p-4"
              >
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {finding.label}
                </p>
                <div className="mt-4">
                  <Badge>{finding.band}</Badge>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-lg border border-border bg-background p-4">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Cosmetic disclaimer
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {sampleReport.disclaimer}
            </p>
          </section>
        </CardContent>
      </Card>

      <ProductRecommendations recommendations={sampleRecommendations} />
    </div>
  )
}
