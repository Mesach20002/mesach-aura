"use client"

import { useState } from "react"
import { IconShieldCheck } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ConsentCardProps {
  onContinue: () => void
}

export function ConsentCard({ onContinue }: ConsentCardProps) {
  const [accepted, setAccepted] = useState(false)

  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardHeader className="gap-4">
        <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm">
          <IconShieldCheck className="size-5" aria-hidden />
        </span>
        <CardTitle className="tracking-normal normal-case">
          Before Your Skin Scan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-6 text-muted-foreground">
          Aurora SkinSense provides cosmetic and wellness guidance only. It is
          not a medical diagnostic tool.
        </p>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
          <Checkbox
            id="scan-consent"
            checked={accepted}
            onCheckedChange={(value) => setAccepted(value === true)}
          />
          <Label
            htmlFor="scan-consent"
            className="leading-5 text-muted-foreground"
          >
            I consent to image processing for cosmetic report generation.
          </Label>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          disabled={!accepted}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  )
}
