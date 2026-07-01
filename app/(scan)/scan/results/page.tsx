import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ScanResultsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Your results</h1>
        <p className="text-sm text-muted-foreground">
          Cosmetic skin assessment placeholder. Not a medical diagnosis.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/login">Sign in to save</Link>
        </Button>
        <Button asChild>
          <Link href="/onboarding">Continue</Link>
        </Button>
      </div>
    </div>
  )
}
