import type { Icon } from "@tabler/icons-react"

interface HeroFeatureItemProps {
  icon: Icon
  label: string
}

export function HeroFeatureItem({
  icon: FeatureIcon,
  label,
}: HeroFeatureItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FeatureIcon className="size-5" aria-hidden />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  )
}
