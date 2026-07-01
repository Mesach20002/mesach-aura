import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-medium">Sign in</h1>
        <p className="text-sm text-muted-foreground">Email OTP login placeholder.</p>
      </div>
      <Button asChild className="w-full">
        <Link href="/verify">Continue with email</Link>
      </Button>
    </div>
  )
}
