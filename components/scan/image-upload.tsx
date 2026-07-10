"use client"

import { useRef, useState } from "react"
import { IconUpload } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  onImageSelected: (file: File) => void
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [localError, setLocalError] = useState("")

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setLocalError(
        "Please upload an image file for the cosmetic skin assessment."
      )
      event.target.value = ""
      return
    }

    setLocalError("")
    onImageSelected(file)
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Upload
        </p>
        <Label htmlFor="scan-upload" className="mt-2 block text-base">
          Upload Image
        </Label>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Choose a clear face image after consent. Upload happens only when you
          select “Analyze Skin.”
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          ref={inputRef}
          id="scan-upload"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => inputRef.current?.click()}
        >
          <IconUpload className="size-4" aria-hidden />
          Upload Image
        </Button>
        {localError ? (
          <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
            {localError}
          </p>
        ) : null}
      </div>
    </div>
  )
}
