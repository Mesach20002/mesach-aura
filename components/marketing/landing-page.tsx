import { FinalCta } from "@/components/marketing/final-cta"
import { HeroSection } from "@/components/marketing/hero-section"
import { LandingFooter } from "@/components/marketing/landing-footer"
import { PlatformOverview } from "@/components/marketing/platform-overview"
import { SecuritySection } from "@/components/marketing/security-section"
import { VisualReportPreview } from "@/components/marketing/visual-report-preview"

export function LandingPage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <PlatformOverview />
      <VisualReportPreview />
      <SecuritySection />
      <FinalCta />
      <LandingFooter />
    </div>
  )
}
