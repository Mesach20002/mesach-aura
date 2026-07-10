import type { ReactNode } from "react"

interface AdminSectionHeaderProps {
  title: string
  description: string
  action?: ReactNode
}

export function AdminSectionHeader({
  title,
  description,
  action,
}: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
