import { mkdirSync } from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"

import type { AdminAnalyticsSummary, ReportDetail } from "@/types"

const dataDir = path.join(process.cwd(), "data")
const dbFilePath = path.join(dataDir, "aura.db")

type DatabaseConnection = InstanceType<typeof Database>

const reportsKey = "reports"
const analyticsKey = "analytics"

function buildClientMessage(label: string, band: string): string {
  const normalizedBand = band.toLowerCase()

  switch (label) {
    case "Hydration":
      if (normalizedBand.includes("severe") || normalizedBand.includes("dehydr")) {
        return "Your skin may feel tight or less comfortable, so a barrier-friendly hydration routine will be especially helpful."
      }

      if (normalizedBand.includes("mild") || normalizedBand.includes("slight")) {
        return "A lightweight hydration step can help keep your skin feeling balanced and comfortable between cleanses."
      }

      return "Hydration support is a strong focus here, with comfort and moisture balance as the main goals."
    case "Pigmentation":
      if (normalizedBand.includes("noticeable") || normalizedBand.includes("strong")) {
        return "Visible tone unevenness may need a more consistent brightening routine over time to help support a more even look."
      }

      if (normalizedBand.includes("mild") || normalizedBand.includes("slight")) {
        return "A steady brightening routine can help support a more even-looking complexion with regular use."
      }

      return "Tone support is a priority here, especially for keeping the look of brightness and clarity balanced."
    case "Texture":
      if (normalizedBand.includes("rough") || normalizedBand.includes("coarse")) {
        return "Smoother-looking texture can often improve with gentle exfoliation and a calming, skin-barrier-friendly routine."
      }

      if (normalizedBand.includes("mild") || normalizedBand.includes("slight")) {
        return "A softer-feeling finish may come from a routine that gently refines and comforts the skin surface."
      }

      return "Texture support can be achieved with gentle smoothing steps that leave the skin feeling more polished."
    default:
      return "A tailored routine can help support your skin goals in a way that feels realistic and sustainable."
  }
}

const defaultReports: Record<string, ReportDetail> = {
  "aur-1048": {
    id: "aur-1048",
    reportNumber: "AUR-1048",
    generatedAt: "Today",
    profile: "Combination skin",
    disclaimer:
      "This report summarizes visible cosmetic skin observations and Aurora product recommendations. It is not a medical diagnosis.",
    findings: [
      {
        label: "Hydration",
        band: "Moderate dryness",
        detail: "Prioritize barrier support.",
        clientMessage: buildClientMessage("Hydration", "Moderate dryness"),
      },
      {
        label: "Pigmentation",
        band: "Mild uneven tone",
        detail: "Use daily brightening care.",
        clientMessage: buildClientMessage("Pigmentation", "Mild uneven tone"),
      },
      {
        label: "Texture",
        band: "Slight roughness",
        detail: "Keep exfoliation gentle.",
        clientMessage: buildClientMessage("Texture", "Slight roughness"),
      },
    ],
    recommendedProducts: [
      { id: "p-cleanser", name: "Aurora Gentle Botanical Cleanser" },
      { id: "p-serum", name: "Aurora Turmeric Glow Serum" },
      { id: "p-moisturizer", name: "Aurora Barrier Repair Moisturizer" },
    ],
    exportNote:
      "Use the Save as PDF button to open the print dialog and export this report. A server-generated PDF can be added later when the PDF package is approved.",
  },
}

const defaultAnalytics: AdminAnalyticsSummary = {
  totalUsers: 0,
  totalScans: 0,
  scansThisWeek: 0,
  reportDownloads: 0,
  avgOverallScore: 0,
  topConcerns: [],
  topRecommendedProducts: [],
  recentScans: [],
}

let databaseInstance: DatabaseConnection | null = null

function ensureDatabase(): DatabaseConnection {
  if (databaseInstance) {
    return databaseInstance
  }

  mkdirSync(dataDir, { recursive: true })
  databaseInstance = new Database(dbFilePath)
  databaseInstance.pragma("journal_mode = WAL")
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS key_value_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  return databaseInstance
}

function readValue<T>(key: string, fallback: T): T {
  const database = ensureDatabase()
  const row = database
    .prepare("SELECT value FROM key_value_store WHERE key = ?")
    .get(key) as { value: string } | undefined

  if (!row) {
    writeValue(key, fallback)

    return fallback
  }

  try {
    return JSON.parse(row.value) as T
  } catch {
    writeValue(key, fallback)

    return fallback
  }
}

function writeValue<T>(key: string, value: T) {
  const database = ensureDatabase()

  database
    .prepare(
      `INSERT INTO key_value_store (key, value, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    )
    .run(key, JSON.stringify(value))
}

export async function getReportsStore(): Promise<Record<string, ReportDetail>> {
  return readValue(reportsKey, defaultReports)
}

export async function saveReportsStore(store: Record<string, ReportDetail>) {
  writeValue(reportsKey, store)
}

export async function getAnalyticsStore(): Promise<AdminAnalyticsSummary> {
  return readValue(analyticsKey, defaultAnalytics)
}

export async function saveAnalyticsStore(summary: AdminAnalyticsSummary) {
  writeValue(analyticsKey, summary)
}
