"use client"

import type { KeyboardEvent } from "react"
import { IconSend } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

interface ReportChatInputProps {
  value: string
  disabled: boolean
  onChange: (value: string) => void
  onSend: () => void
}

export function ReportChatInput({
  value,
  disabled,
  onChange,
  onSend,
}: ReportChatInputProps) {
  const canSend = value.trim().length > 0 && !disabled

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return
    }

    event.preventDefault()

    if (canSend) {
      onSend()
    }
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Ask why your report showed this..."
        className="min-h-11 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-border focus-visible:ring-2 focus-visible:ring-border/30 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <Button
        type="button"
        className="h-11 shrink-0 rounded-lg px-3"
        disabled={!canSend}
        onClick={onSend}
      >
        <IconSend className="size-4" aria-hidden />
        Send
      </Button>
    </div>
  )
}
