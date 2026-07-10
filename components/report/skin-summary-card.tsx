import { IconFileAnalytics } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SkinSummaryCardProps {
  reportId: string
  createdAt: string
  skinType: string
  summary: string
}

export function SkinSummaryCard({
  reportId,
  createdAt,
  skinType,
  summary,
}: SkinSummaryCardProps) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="border-b border-border">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconFileAnalytics
                className="size-5 text-muted-foreground"
                aria-hidden
              />
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Report {reportId}
              </p>
            </div>
            <CardTitle className="text-2xl tracking-normal normal-case">
              Cosmetic skin assessment
            </CardTitle>
          </div>
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Skin type
            </p>
            <p className="mt-2 font-heading text-xl font-semibold text-foreground">
              {skinType}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{createdAt}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          AI summary
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {summary}
        </p>
      </CardContent>
    </Card>
  )
}
