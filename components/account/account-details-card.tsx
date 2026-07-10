import Link from "next/link"
import { IconFileDescription, IconShieldCheck, IconUserCircle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AuthUser } from "@/lib/auth/types"

interface AccountDetailsCardProps {
  user: AuthUser
  reportCount: number
}

export function AccountDetailsCard({
  user,
  reportCount,
}: AccountDetailsCardProps) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="space-y-4">
        <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <IconUserCircle className="size-6" aria-hidden />
        </span>
        <div>
          <CardTitle className="text-2xl tracking-normal normal-case">
            Aurora Account Details
          </CardTitle>
          <CardDescription>
            Safe account information for your Aurora SkinSense workspace.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Detail label="Name" value={user.name ?? "Not provided"} />
          <Detail label="Email" value={user.email} />
          <Detail label="Username" value={user.username ?? "Not set"} />
          <Detail label="Role" value={user.role} />
          <Detail
            label="Account Created"
            value={user.createdAt ? formatDate(user.createdAt) : "Available after sign in"}
          />
          <Detail label="Total Reports" value={reportCount.toString()} />
        </dl>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
            <IconShieldCheck
              className="mt-0.5 size-5 text-muted-foreground"
              aria-hidden
            />
            <p className="text-sm leading-6 text-muted-foreground">
              Passwords, password hashes, session tokens, and secrets are never
              displayed in Aurora Account Details.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
            <IconFileDescription
              className="mt-0.5 size-5 text-muted-foreground"
              aria-hidden
            />
            <p className="text-sm leading-6 text-muted-foreground">
              Reports remain available from the dashboard and report workspace.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/scan">Start New Scan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <dt className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  )
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}
