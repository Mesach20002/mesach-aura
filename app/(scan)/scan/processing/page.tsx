import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ScanProcessingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Processing</h1>
        <p className="text-sm text-muted-foreground">Analyzing your scan placeholder.</p>
      </div>
      <Button asChild>
        <Link href="/scan/results">View results</Link>
      </Button>
    </div>
  )
}
