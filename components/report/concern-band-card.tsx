import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { SeverityBand, SkinConcern } from "@/lib/ai/types"

interface ConcernBandCardProps {
  concern: SkinConcern
  band: SeverityBand
}

const concernLabels: Record<SkinConcern, string> = {
  hydration: "Hydration",
  texture: "Texture",
  pores: "Pores",
  redness: "Redness",
  pigmentation: "Pigmentation",
  "fine-lines": "Fine Lines",
  dullness: "Dullness",
  oiliness: "Oiliness",
}

const bandLabels: Record<SeverityBand, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
}

const concernNotes: Record<SkinConcern, string> = {
  hydration:
    "Hydration skin insights describe the appearance of comfort and moisture balance.",
  texture:
    "Texture skin insights describe the appearance of smoothness and visible unevenness.",
  pores:
    "Pores skin insights describe the appearance of visible pore prominence.",
  redness:
    "Redness skin insights describe the appearance of visible flush or blotchiness.",
  pigmentation:
    "Pigmentation skin insights describe the appearance of tone variation.",
  "fine-lines":
    "Fine lines skin insights describe the appearance of delicate line visibility.",
  dullness:
    "Dullness skin insights describe the appearance of radiance and freshness.",
  oiliness:
    "Oiliness skin insights describe the appearance of shine and surface balance.",
}

export function ConcernBandCard({ concern, band }: ConcernBandCardProps) {
  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {concernLabels[concern]}
          </p>
          <div className="mt-3">
            <Badge className="rounded-lg border border-border bg-background px-3 py-1">
              {bandLabels[band]}
            </Badge>
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {concernNotes[concern]}
        </p>
      </CardContent>
    </Card>
  )
}
