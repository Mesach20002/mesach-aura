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
  IconUser,
  IconUserPlus,
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
import { authClient } from "@/lib/auth/auth-client"

function getSafeRedirectPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null
  }

  return value
}

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"))
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("Please enter your name, email, and password.")
      return
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return
    }

    if (!consentAccepted) {
      setErrorMessage(
        "Please confirm Aurora SkinSense provides cosmetic and wellness guidance only."
      )
      return
    }

    const destination = redirectPath ?? "/dashboard"
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim() || undefined,
          email: email.trim(),
          password,
          callbackURL: destination,
        }),
      })

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        setErrorMessage(getRegisterErrorMessage(result?.error))
        return
      }

      if (response.redirected) {
        router.push(response.url)
        router.refresh()
        return
      }

      if (!result || !("devSession" in result)) {
        const session = await authClient.getSession()

        if (!session.data) {
          router.push(
            `/login?redirect=${encodeURIComponent(destination)}&accountCreated=true`
          )
          return
        }
      }

      if (result?.error) {
        router.push(
          `/login?redirect=${encodeURIComponent(destination)}&accountCreated=true`
        )
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
          <IconUserPlus className="size-6" aria-hidden />
        </div>
        <Badge className="mx-auto rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
          Privacy-first onboarding
        </Badge>
        <CardTitle className="text-2xl tracking-normal normal-case">
          Create your Aurora Account
        </CardTitle>
        <CardDescription>
          Register with email, username, and password to open your Aurora
          Dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="register-name">Full Name</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconUser className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-username">Username</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconUser className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="register-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="aurora_user"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconMail className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="flex items-center gap-3 border-b border-border">
              <IconLock className="size-4 text-muted-foreground" aria-hidden />
              <Input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
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

          <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
            <Checkbox
              id="register-consent"
              checked={consentAccepted}
              onCheckedChange={(value) => setConsentAccepted(value === true)}
            />
            <Label
              htmlFor="register-consent"
              className="leading-5 text-muted-foreground"
            >
              I understand Aurora SkinSense provides cosmetic and wellness
              guidance only.
            </Label>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" className="w-full" size="lg">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectPath ?? "/dashboard")}`}
            className="font-medium text-foreground"
          >
            Sign in
          </Link>
        </p>
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">
          <IconShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            Passwords are handled by Better Auth and stored as secure hashes in
            the authentication account table.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function getRegisterErrorMessage(message?: string): string {
  const normalizedMessage = message?.toLowerCase() ?? ""

  if (!message) {
    return "Unable to create your account right now."
  }

  if (normalizedMessage.includes("username")) {
    return "That username is already in use or is not available."
  }

  if (normalizedMessage.includes("email")) {
    return "That email is already registered or is not available."
  }

  if (normalizedMessage.includes("password")) {
    return "Password must be at least 8 characters long."
  }

  return "Unable to create the account. Please review your details and try again."
}
