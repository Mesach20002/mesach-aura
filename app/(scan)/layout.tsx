import { ScanShell } from "@/components/layouts/scan-shell"

export default function ScanLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ScanShell>{children}</ScanShell>
}
