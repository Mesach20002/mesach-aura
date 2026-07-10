import Link from "next/link"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 font-heading text-lg font-semibold tracking-wide shadow-sm"
          >
            Aurora SkinSense
          </Link>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Aurora SkinSense provides cosmetic and wellness guidance only and is
            not intended for clinical use.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
