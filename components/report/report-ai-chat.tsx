"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  IconLoader2,
  IconMessageCircle,
  IconSparkles,
} from "@tabler/icons-react"

import { ReportChatInput } from "@/components/report/report-chat-input"
import { ReportChatMessage } from "@/components/report/report-chat-message"
import { Button } from "@/components/ui/button"
import type { SkinReport } from "@/lib/reports/types"
import type {
  ReportChatMessage as ReportChatMessageType,
  ReportChatResponse,
} from "@/lib/report-chat/types"

interface ReportAiChatProps {
  reportId: string
  initialReport: SkinReport
}

const suggestedPrompts = [
  "Explain simply",
  "Why pores high?",
  "Focus first?",
] as const

const initialAssistantMessage: ReportChatMessageType = {
  id: "initial-assistant-message",
  role: "assistant",
  content:
    "Hi, I can help explain your Aurora SkinSense cosmetic report. Ask me why a skin insight band appeared or what a result means.",
  createdAt: new Date(0).toISOString(),
}

export function ReportAiChat({ reportId, initialReport }: ReportAiChatProps) {
  const [messages, setMessages] = useState<ReportChatMessageType[]>([
    initialAssistantMessage,
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const messageAreaRef = useRef<HTMLDivElement | null>(null)

  const contextLabel = useMemo(
    () => initialReport.assessment.skinType.replaceAll("-", " "),
    [initialReport.assessment.skinType]
  )

  useEffect(() => {
    messageAreaRef.current?.scrollTo({
      top: messageAreaRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isSending])

  async function sendMessage(messageText = input): Promise<void> {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isSending) {
      return
    }

    const userMessage: ReportChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput("")
    setErrorMessage("")
    setIsSending(true)

    try {
      const response = await fetch(`/api/reports/${reportId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Report chat request failed.")
      }

      const data = (await response.json()) as ReportChatResponse
      setMessages([...nextMessages, data.message])
    } catch {
      setErrorMessage(
        "Aurora AI could not answer that report question right now. Please try again."
      )
      setMessages(nextMessages)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section
      id="report-ai-chat"
      aria-labelledby="aurora-ai-chat-title"
      className="flex h-[520px] max-h-[520px] w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm print:hidden"
    >
      <header className="border-b border-border bg-background p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconSparkles className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <h2
                id="aurora-ai-chat-title"
                className="font-heading text-base font-semibold text-foreground"
              >
                Aurora AI Chat
              </h2>
              <p className="text-xs text-muted-foreground">
                Ask about your cosmetic skin report.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Online
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Explaining your {contextLabel} appearance-based skin insight bands.
        </p>
      </header>

      <div
        ref={messageAreaRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-card p-4"
        aria-live="polite"
      >
        {messages.map((message) => (
          <ReportChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        {isSending ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconLoader2 className="size-4 animate-spin" aria-hidden />
            Aurora AI is reading your report...
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 space-y-3 border-t border-border bg-background p-4">
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-border bg-card px-2.5 text-xs"
              disabled={isSending}
              onClick={() => void sendMessage(prompt)}
            >
              <IconMessageCircle className="size-3.5" aria-hidden />
              {prompt}
            </Button>
          ))}
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-lg border border-border bg-card p-3 text-xs leading-5 text-muted-foreground"
          >
            {errorMessage}
          </p>
        ) : null}

        <ReportChatInput
          value={input}
          disabled={isSending}
          onChange={setInput}
          onSend={() => void sendMessage()}
        />
      </div>
    </section>
  )
}
