"use client"

import { useEffect, useRef, useState } from "react"
import {
  IconAlertTriangle,
  IconCamera,
  IconCameraOff,
  IconLoader2,
  IconShieldCheck,
  IconUpload,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type CameraStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "capturing"
  | "blocked"
  | "unsupported"
  | "error"

interface CameraCaptureProps {
  onImageCaptured: (file: File) => void
}

const captureTips = [
  "Use bright, even lighting",
  "Keep your face centered",
  "Avoid sunglasses or heavy shadows",
  "Hold the camera steady",
] as const

const readyGuidance = [
  "Face the camera directly",
  "Use even lighting",
  "Remove heavy shadows",
  "Keep your face centered",
] as const

const statusMessages: Partial<Record<CameraStatus, string>> = {
  requesting: "Requesting camera access...",
  blocked: "Camera permission is disabled in your browser.",
  unsupported:
    "Camera access is not supported in this browser. Please upload an image instead.",
  error: "Unable to start camera. Please try again or upload an image.",
}

export function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>("idle")
  const [message, setMessage] = useState("")
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current)
      streamRef.current = null
    }
  }, [])

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported")
      setMessage("Camera access is not supported in this browser.")
      return
    }

    if (!isCameraOriginAllowed()) {
      setStatus("error")
      setMessage("Camera access requires HTTPS or localhost.")
      return
    }

    setMessage("")
    setIsVideoReady(false)
    setStatus("requesting")

    try {
      const permissionState = await getCameraPermissionState()

      if (permissionState === "denied") {
        setStatus("blocked")
        setMessage(statusMessages.blocked ?? "")
        return
      }

      await requestCameraStream()
    } catch (error) {
      handleCameraError(error)
    }
  }

  function stopCamera() {
    stopCameraStream(streamRef.current)
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setMessage("")
    setIsVideoReady(false)
    setStatus("idle")
  }

  function openUploadFallback(): void {
    document.getElementById("scan-upload")?.click()
  }

  function captureImage() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (
      !video ||
      !canvas ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setMessage("Camera preview is not ready yet. Please try again.")
      return
    }

    setMessage("")
    setStatus("capturing")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")

    if (!context) {
      setMessage(
        "We could not capture a clear image. Please try again or upload a photo."
      )
      setStatus("ready")
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setMessage(
            "We could not capture a clear image. Please try again or upload a photo."
          )
          setStatus("ready")
          return
        }

        const file = new File([blob], "aurora-skin-scan.jpg", {
          type: "image/jpeg",
        })

        stopCamera()
        onImageCaptured(file)
      },
      "image/jpeg",
      0.92
    )
  }

  async function requestCameraStream(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })

    stopCameraStream(streamRef.current)
    streamRef.current = stream

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      await videoRef.current.play()

      if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        setIsVideoReady(true)
      }
    }

    setMessage("")
    setStatus("ready")
  }

  function handleCameraError(error: unknown): void {
    stopCameraStream(streamRef.current)
    streamRef.current = null
    setIsVideoReady(false)

    if (!(error instanceof DOMException)) {
      setStatus("error")
      setMessage("Unable to start camera. Please try again or upload an image.")
      return
    }

    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        setStatus("blocked")
        setMessage("Camera permission was denied.")
        return
      case "NotFoundError":
        setStatus("error")
        setMessage("No camera was found on this device.")
        return
      case "NotReadableError":
        setStatus("error")
        setMessage(
          "Your camera may be open in another app. Close other camera apps and try again."
        )
        return
      case "AbortError":
        setStatus("error")
        setMessage("Camera startup was interrupted. Please try again.")
        return
      case "SecurityError":
        setStatus("error")
        setMessage("Camera access requires HTTPS or localhost.")
        return
      default:
        setStatus("error")
        setMessage(
          "Unable to start camera. Please try again or upload an image."
        )
    }
  }

  const isCameraReady = status === "ready" || status === "capturing"
  const isBusy = status === "requesting" || status === "capturing"
  const canCapture = status === "ready" && isVideoReady

  return (
    <Card className="rounded-lg border border-border shadow-sm">
      <CardContent className="space-y-5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Camera
            </p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">
              Live camera preview
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Open your camera, center your face, then capture a clear image for
              skin insights.
            </p>
          </div>
          <span className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            <IconShieldCheck className="size-4" aria-hidden />
            Privacy-first
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background shadow-inner">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="h-full w-full -scale-x-100 object-cover"
              autoPlay
              muted
              playsInline
              onLoadedMetadata={() => setIsVideoReady(true)}
              onCanPlay={() => setIsVideoReady(true)}
            />

            {isCameraReady ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-3/4 w-1/2 rounded-full border border-dashed border-border bg-background/10" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-medium text-foreground backdrop-blur">
                  <span className="size-2 rounded-full bg-primary" />
                  LIVE CAMERA
                </div>
                <div className="absolute top-4 right-4 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
                  {isVideoReady ? "Camera Ready" : "Preparing preview"}
                </div>
                <div className="absolute bottom-4 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
                  Keep your face centered
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="space-y-3">
                  <IconCamera
                    className="mx-auto size-8 text-muted-foreground"
                    aria-hidden
                  />
                  <p className="text-sm leading-6 text-muted-foreground">
                    Camera preview will appear here after permission is granted.
                  </p>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" aria-hidden />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-lg border border-border bg-background p-4">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Capture Tips
            </h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {captureTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          {isCameraReady ? (
            <div className="rounded-lg border border-border bg-background p-4">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Quality Guidance
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {readyGuidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isCameraReady ? (
            <>
              <Button
                type="button"
                size="lg"
                onClick={captureImage}
                disabled={!canCapture || isBusy}
              >
                {status === "capturing" ? (
                  <IconLoader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <IconCamera className="size-4" aria-hidden />
                )}
                Capture Clear Image
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={stopCamera}
                disabled={status === "capturing"}
              >
                <IconCameraOff className="size-4" aria-hidden />
                Stop Camera
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={startCamera}
              disabled={isBusy}
            >
              {status === "requesting" ? (
                <IconLoader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <IconCamera className="size-4" aria-hidden />
              )}
              {status === "requesting"
                ? "Requesting camera access..."
                : "Start Scan"}
            </Button>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
          <IconShieldCheck
            className="mt-0.5 size-5 text-muted-foreground"
            aria-hidden
          />
          <p className="text-sm leading-6 text-muted-foreground">
            Your camera image is used for cosmetic report generation and is not
            stored by default.
          </p>
        </div>

        {message || statusMessages[status] ? (
          <div className="space-y-4 rounded-lg border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <IconAlertTriangle
                className="mt-0.5 size-5 text-muted-foreground"
                aria-hidden
              />
              <div className="space-y-2">
                <p className="text-sm leading-6 text-muted-foreground">
                  {message || statusMessages[status]}
                </p>
                {status === "blocked" ? (
                  <div className="space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>To enable it:</p>
                      <ol className="list-decimal space-y-1 pl-5">
                        <li>
                          Click the camera icon or lock icon in the browser
                          address bar.
                        </li>
                        <li>Set Camera to Allow.</li>
                        <li>Refresh this page.</li>
                        <li>Click Start Scan again.</li>
                      </ol>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      For privacy and security, Aurora SkinSense cannot enable
                      camera permission automatically. Your browser requires you
                      to allow camera access manually.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {status === "blocked" ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" onClick={startCamera}>
                  Try Again
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openUploadFallback}
                >
                  <IconUpload className="size-4" aria-hidden />
                  Upload Image Instead
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function stopCameraStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop())
}

async function getCameraPermissionState(): Promise<
  PermissionState | "unknown"
> {
  if (!navigator.permissions?.query) {
    return "unknown"
  }

  try {
    const permission = await navigator.permissions.query({
      name: "camera" as PermissionName,
    })

    return permission.state
  } catch {
    return "unknown"
  }
}

function isCameraOriginAllowed(): boolean {
  return window.isSecureContext || isLocalhost()
}

function isLocalhost(): boolean {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname)
}
