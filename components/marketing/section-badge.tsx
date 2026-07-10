import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"

interface SectionBadgeProps {
  children: ReactNode
}

export function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground"
    >
      {children}
    </Badge>
  )
}
