import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Welcome to Aura</h1>
        <p className="text-sm text-muted-foreground">Let&apos;s get you set up.</p>
      </div>
      <Button asChild>
        <Link href="/onboarding/consent">Continue</Link>
      </Button>
    </div>
  )
}
