import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ScanStartPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Start your scan</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll guide you through capture, processing, and your cosmetic skin
          assessment.
        </p>
      </div>
      <Button asChild>
        <Link href="/scan/capture">Continue</Link>
      </Button>
    </div>
  )
}
