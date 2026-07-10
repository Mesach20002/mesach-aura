"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  IconAlertTriangle,
  IconCheck,
  IconLoader2,
  IconShieldCheck,
} from "@tabler/icons-react"

import { CameraCapture } from "@/components/scan/camera-capture"
import { ConsentCard } from "@/components/scan/consent-card"
import { ImagePreview } from "@/components/scan/image-preview"
import { ImageUpload } from "@/components/scan/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ScanStep = "consent" | "capture" | "preview" | "analyzing" | "error"

const stepLabels: Record<ScanStep, string> = {
  consent: "Consent",
  capture: "Capture",
  preview: "Preview",
  analyzing: "Analyzing",
  error: "Needs attention",
}

export function ScanFlow() {
  const router = useRouter()
  const [step, setStep] = useState<ScanStep>("consent")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function setPreview(file: File) {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setErrorMessage("")
    setStep("preview")
  }

  function handleError(message: string) {
    setErrorMessage(message)
    setIsAnalyzing(false)
    setStep("error")
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      handleError("Please capture or upload an image before analysis.")
      return
    }

    setIsAnalyzing(true)
    setStep("analyzing")

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/skin-analysis", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis request failed.")
      }

      const result = (await response.json()) as { reportId: string }
      router.push(`/report/${result.reportId}`)
    } catch {
      handleError(
        "We could not complete the cosmetic skin assessment. Please try again."
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  function handleRetake() {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(null)
    setPreviewUrl("")
    setErrorMessage("")
    setIsAnalyzing(false)
    setStep("capture")
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="grid gap-6 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <Badge className="rounded-lg border border-border bg-background px-3 py-1 text-muted-foreground">
            Fast scan flow
          </Badge>
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Start your cosmetic skin assessment
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Consent, capture or upload, preview, and generate a report from
              one clean page.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
          <IconShieldCheck
            className="mt-0.5 size-5 text-muted-foreground"
            aria-hidden
          />
          <p className="max-w-xs text-xs leading-5 text-muted-foreground">
            Privacy-first image processing with report generation as the default
            retained output.
          </p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-4" aria-label="Scan progress">
        {(["consent", "capture", "preview", "analyzing"] as const).map(
          (item, index) => {
            const steps = [
              "consent",
              "capture",
              "preview",
              "analyzing",
            ] as const
            const currentIndex = steps.indexOf(step as (typeof steps)[number])
            const isComplete = currentIndex > index
            const isActive = step === item

            return (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"
                data-active={isActive}
              >
                <span className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-xs font-semibold text-muted-foreground">
                  {isComplete ? (
                    <IconCheck className="size-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {stepLabels[item]}
                </p>
              </div>
            )
          }
        )}
      </div>

      {step === "consent" ? (
        <div className="mx-auto w-full max-w-3xl">
          <ConsentCard onContinue={() => setStep("capture")} />
        </div>
      ) : null}

      {step === "capture" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <CameraCapture onImageCaptured={setPreview} />
          <ImageUpload onImageSelected={setPreview} />
        </div>
      ) : null}

      {step === "preview" && previewUrl ? (
        <ImagePreview
          previewUrl={previewUrl}
          isAnalyzing={isAnalyzing}
          onRetake={handleRetake}
          onAnalyze={handleAnalyze}
        />
      ) : null}

      {step === "analyzing" ? (
        <Card className="mx-auto w-full max-w-3xl rounded-lg border border-border shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <IconLoader2
              className="size-8 animate-spin text-muted-foreground"
              aria-hidden
            />
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Generating your cosmetic skin report...
              </h2>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Reviewing image quality, creating skin insight bands, and
                preparing your report.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === "error" ? (
        <Card className="mx-auto w-full max-w-3xl rounded-lg border border-border shadow-sm">
          <CardContent className="space-y-5 py-6">
            <div className="flex items-start gap-3">
              <IconAlertTriangle
                className="mt-0.5 size-5 text-muted-foreground"
                aria-hidden
              />
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Scan flow paused
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {errorMessage}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={handleRetake}>
                Try Again
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl("")
                  setErrorMessage("")
                  setIsAnalyzing(false)
                  setStep("consent")
                }}
              >
                Start Scan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
