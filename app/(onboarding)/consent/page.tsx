import { redirect } from "next/navigation"
import { IconShieldCheck } from "@tabler/icons-react"

import { ConsentOnboardingForm } from "@/components/consent/consent-onboarding-form"
import { getCurrentUser } from "@/lib/auth/session"
import { hasCompletedLatestConsent } from "@/lib/consent/service"

export default async function ConsentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/consent")
  }

  if (await hasCompletedLatestConsent(user.id)) {
    redirect("/climate")
  }

  return (
    <div className="space-y-8">
      <header className="space-y-5 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <IconShieldCheck className="size-6" aria-hidden />
        </span>
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Consent &amp; skin profile
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Before your first skin scan
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Tell us a little about your skin and review how Aurora SkinSense
            uses your information. Required fields are used only for
            personalized cosmetic guidance.
          </p>
        </div>
      </header>

      <ConsentOnboardingForm defaultName={user.name ?? ""} email={user.email} />
    </div>
  )
}
