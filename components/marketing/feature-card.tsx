import type { Icon } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon: Icon
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <Card className="rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="gap-5">
        <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm">
          <Icon className="size-5" aria-hidden />
        </span>
        <CardTitle className="text-base tracking-normal normal-case">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
