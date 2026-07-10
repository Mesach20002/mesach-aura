"use client"

import Image from "next/image"
import { IconShieldCheck } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

interface ImagePreviewProps {
  previewUrl: string
  isAnalyzing: boolean
  onRetake: () => void
  onAnalyze: () => void
}

export function ImagePreview({
  previewUrl,
  isAnalyzing,
  onRetake,
  onAnalyze,
}: ImagePreviewProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 rounded-lg border border-border bg-card p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Preview
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Confirm the image before starting the AI cosmetic skin assessment.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-inner">
        <Image
          src={previewUrl}
          alt="Selected scan preview"
          width={960}
          height={720}
          className="aspect-[4/3] w-full object-cover"
          unoptimized
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
        <IconShieldCheck
          className="mt-0.5 size-5 text-muted-foreground"
          aria-hidden
        />
        <p className="text-sm leading-6 text-muted-foreground">
          Your image is used for report generation and is not stored by default.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onRetake}
          disabled={isAnalyzing}
        >
          Retake
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Generating Report..." : "Analyze Skin"}
        </Button>
      </div>
    </div>
  )
}
