import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ScanCapturePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Capture</h1>
        <p className="text-sm text-muted-foreground">Camera and lighting check placeholder.</p>
      </div>
      <Button asChild>
        <Link href="/scan/processing">Continue</Link>
      </Button>
    </div>
  )
}
