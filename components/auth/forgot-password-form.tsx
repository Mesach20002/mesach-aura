"use client"

import { useState } from "react"
import Link from "next/link"
import { IconMail, IconShieldCheck } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")
    setStatusMessage("")

    if (!email.trim()) {
      setErrorMessage("Enter your email to prepare password reset.")
      return
    }

    setIsSubmitting(true)

    window.setTimeout(() => {
      setStatusMessage(
        "Password reset is not available yet because email delivery has not been configured."
      )
      setIsSubmitting(false)
    }, 250)
  }

  return (
    <Card className="rounded-lg border border-border shadow-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm">
          <IconMail className="size-6" aria-hidden />
        </div>
        <Badge className="mx-auto rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
          Account recovery
        </Badge>
        <CardTitle className="text-2xl tracking-normal normal-case">
          Reset your password
        </CardTitle>
        <CardDescription>
          Password reset is not available yet because email delivery has not
          been configured.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="forgot-password-email">Email</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconMail className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="forgot-password-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                aria-invalid={Boolean(errorMessage)}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" className="w-full" size="lg">
            {isSubmitting ? "Preparing reset..." : "Continue"}
          </Button>

          {statusMessage ? (
            <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
              {statusMessage}
            </p>
          ) : null}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground">
            Back to sign in
          </Link>
        </p>
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">
          <IconShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            Aurora SkinSense provides cosmetic and wellness guidance only and is
            not a medical diagnostic tool.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
