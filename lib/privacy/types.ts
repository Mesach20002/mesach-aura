export type ConsentType =
  | "skin-scan-processing"
  | "image-retention"
  | "report-generation"

export interface ConsentSnapshot {
  consentType: ConsentType
  accepted: boolean
  acceptedAt: string
}
