import { IconSparkles, IconUser } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { ReportChatRole } from "@/lib/report-chat/types"

interface ReportChatMessageProps {
  role: ReportChatRole
  content: string
}

export function ReportChatMessage({ role, content }: ReportChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <IconSparkles className="size-3.5" aria-hidden />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[78%] rounded-lg border border-border px-3 py-2 text-sm leading-6 whitespace-pre-wrap shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground"
        )}
      >
        {content}
      </div>
      {isUser ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
          <IconUser className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </div>
  )
}
