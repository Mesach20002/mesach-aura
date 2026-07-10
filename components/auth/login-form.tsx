"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconShieldCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function getSafeRedirectPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null
  }

  return value
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"))
  const registerRedirectPath = redirectPath ?? "/dashboard"
  const registerHref = `/register?redirect=${encodeURIComponent(registerRedirectPath)}`
  const accountCreated = searchParams.get("accountCreated") === "true"
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    if (!identifier.trim()) {
      setErrorMessage("Please enter your email address.")
      return
    }

    if (!password) {
      setErrorMessage("Please enter your password.")
      return
    }

    const destination = redirectPath ?? "/dashboard"
    const normalizedIdentifier = identifier.trim()

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          password,
          rememberMe,
          callbackURL: destination,
        }),
      })
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        setErrorMessage(getSignInErrorMessage(result?.error, response.status))
        return
      }

      router.push(destination)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-lg border border-border shadow-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm">
          <IconLock className="size-6" aria-hidden />
        </div>
        <Badge className="mx-auto rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
          Secure account access
        </Badge>
        <CardTitle className="text-2xl tracking-normal normal-case">
          Sign in to your Aurora Account
        </CardTitle>
        <CardDescription>
          {accountCreated
            ? "Account created. Please sign in to open your Aurora Dashboard."
            : "Sign in to view your Aurora Dashboard, reports, scans, and account tools."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-identifier">Email or username</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconMail className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@example.com or username"
                value={identifier}
                aria-invalid={Boolean(errorMessage) && !identifier.trim()}
                onChange={(event) => setIdentifier(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconLock className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                aria-invalid={Boolean(errorMessage) && !password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <IconEyeOff className="size-4" aria-hidden />
                ) : (
                  <IconEye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="login-remember"
                checked={rememberMe}
                onCheckedChange={(value) => setRememberMe(value === true)}
              />
              <Label
                htmlFor="login-remember"
                className="text-sm font-normal tracking-normal text-muted-foreground normal-case"
              >
                Remember this Aurora Account
              </Label>
            </div>
            <Button asChild variant="link" className="h-auto px-0">
              <Link href="/forgot-password">Forgot password?</Link>
            </Button>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" className="w-full" size="lg">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm text-muted-foreground">
          <p>
            New to Aurora SkinSense?{" "}
            <Link href={registerHref} className="font-medium text-foreground">
              Create an Aurora Account
            </Link>
          </p>
        </div>
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

function getSignInErrorMessage(message?: string, status?: number): string {
  const normalizedMessage = message?.toLowerCase() ?? ""

  if (message) {
    return message
  }

  if (status === 404) {
    return "No Aurora Account exists with that email address."
  }

  if (status === 401 || normalizedMessage.includes("password")) {
    return "The email/username or password you entered is incorrect."
  }

  if (
    normalizedMessage.includes("user") ||
    normalizedMessage.includes("email") ||
    normalizedMessage.includes("username")
  ) {
    return "No Aurora Account exists with that email address."
  }

  return "We couldn't sign you in right now. Please try again."
}
