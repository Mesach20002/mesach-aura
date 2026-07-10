import { mkdirSync, promises as fs } from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"

import type {
  AdminAnalyticsSummary,
  ConcernType,
  ReportDetail,
  ScanStatus,
} from "@/types"

const dataDir = path.join(process.cwd(), "data")
const dbFilePath = path.join(dataDir, "aura.db")

type DatabaseConnection = InstanceType<typeof Database>
type ReportRow = {
  id: string
  report_number: string
  generated_at: string
  profile: string
  disclaimer: string
  export_note: string
}
type AnalyticsSummaryRow = {
  totalUsers: number
  totalScans: number
  scansThisWeek: number
  reportDownloads: number
  avgOverallScore: number
}
type TopConcernRow = { concernType: ConcernType; count: number }
type TopRecommendedProductRow = { productId: string; name: string; count: number }
type RecentScanRow = {
  scanId: string
  userFullName: string
  overallScore: number | null
  status: ScanStatus
  createdAt: string
}

let databaseInstance: DatabaseConnection | null = null

function ensureDatabase(): DatabaseConnection {
  if (databaseInstance) return databaseInstance

  mkdirSync(dataDir, { recursive: true })
  databaseInstance = new Database(dbFilePath)
  databaseInstance.pragma("journal_mode = WAL")

  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      report_number TEXT,
      generated_at TEXT,
      profile TEXT,
      disclaimer TEXT,
      export_note TEXT
    );

    CREATE TABLE IF NOT EXISTS findings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id TEXT,
      label TEXT,
      band TEXT,
      detail TEXT,
      client_message TEXT,
      FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS report_products (
      report_id TEXT,
      product_id TEXT,
      position INTEGER,
      PRIMARY KEY(report_id, product_id),
      FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE VIEW IF NOT EXISTS report_findings_view AS
      SELECT r.id AS report_id, r.report_number, f.label, f.band, f.detail, f.client_message
      FROM reports r JOIN findings f ON r.id = f.report_id;
  `)

  return databaseInstance
}

async function tryMigrateJsonSeeds() {
  const db = ensureDatabase()

  const count = db.prepare("SELECT COUNT(1) AS c FROM reports").get() as { c: number }
  if (count.c > 0) return

  try {
    const reportsJsonPath = path.join(dataDir, "reports.json")
    const exists = await fs.stat(reportsJsonPath).then(() => true).catch(() => false)

    if (!exists) return

    const raw = await fs.readFile(reportsJsonPath, "utf8")
    const reports = JSON.parse(raw) as Record<string, ReportDetail>

    const insertReport = db.prepare(
      `INSERT INTO reports (id, report_number, generated_at, profile, disclaimer, export_note)
       VALUES (?, ?, ?, ?, ?, ?)`
    )

    const insertFinding = db.prepare(
      `INSERT INTO findings (report_id, label, band, detail, client_message)
       VALUES (?, ?, ?, ?, ?)`
    )

    const insertProduct = db.prepare(`INSERT OR IGNORE INTO products (id, name) VALUES (?, ?)`)

    const insertReportProduct = db.prepare(
      `INSERT INTO report_products (report_id, product_id, position) VALUES (?, ?, ?)`
    )

    const tx = db.transaction((items: Record<string, ReportDetail>) => {
      for (const [id, rpt] of Object.entries(items)) {
        insertReport.run(id, rpt.reportNumber, rpt.generatedAt, rpt.profile, rpt.disclaimer, rpt.exportNote)

        rpt.findings.forEach((f) => {
          insertFinding.run(id, f.label, f.band, f.detail, f.clientMessage ?? null)
        })

        rpt.recommendedProducts.forEach((p, i) => {
          insertProduct.run(p.id, p.name)
          insertReportProduct.run(id, p.id, i)
        })
      }
    })

    tx(reports)
  } catch {
    // ignore migration failures and continue with empty data
  }
}

function buildClientMessage(label: string, band: string): string {
  const normalizedBand = (band || "").toLowerCase()

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

export async function getReportsStore(): Promise<Record<string, ReportDetail>> {
  ensureDatabase()
  await tryMigrateJsonSeeds()
  const db = databaseInstance as DatabaseConnection

  const rows = db.prepare("SELECT id, report_number, generated_at, profile, disclaimer, export_note FROM reports").all() as ReportRow[]

  const out: Record<string, ReportDetail> = {}
  const findFindings = db.prepare("SELECT label, band, detail, client_message FROM findings WHERE report_id = ? ORDER BY id")
  const findProducts = db.prepare(
    `SELECT p.id, p.name FROM report_products rp JOIN products p ON rp.product_id = p.id WHERE rp.report_id = ? ORDER BY rp.position`
  )

  for (const r of rows) {
    const findings = (findFindings.all(r.id) as Array<{ label: string; band: string; detail: string; client_message: string | null }>).map((f) => ({
      label: f.label,
      band: f.band,
      detail: f.detail,
      clientMessage: f.client_message ?? buildClientMessage(f.label, f.band),
    }))

    const products = (findProducts.all(r.id) as Array<{ id: string; name: string }>).map((p) => ({ id: p.id, name: p.name }))

    out[r.id] = {
      id: r.id,
      reportNumber: r.report_number,
      generatedAt: r.generated_at,
      profile: r.profile,
      disclaimer: r.disclaimer,
      findings,
      recommendedProducts: products,
      exportNote: r.export_note,
    }
  }

  return out
}

export async function saveReportsStore(store: Record<string, ReportDetail>) {
  ensureDatabase()
  const db = databaseInstance as DatabaseConnection

  const insertReport = db.prepare(
    `INSERT OR REPLACE INTO reports (id, report_number, generated_at, profile, disclaimer, export_note) VALUES (?, ?, ?, ?, ?, ?)`
  )

  const insertFinding = db.prepare(
    `INSERT INTO findings (report_id, label, band, detail, client_message) VALUES (?, ?, ?, ?, ?)`
  )

  const insertProduct = db.prepare(`INSERT OR IGNORE INTO products (id, name) VALUES (?, ?)`)
  const insertReportProduct = db.prepare(
    `INSERT OR REPLACE INTO report_products (report_id, product_id, position) VALUES (?, ?, ?)`
  )

  const deleteFindings = db.prepare(`DELETE FROM findings WHERE report_id = ?`)
  const deleteReportProducts = db.prepare(`DELETE FROM report_products WHERE report_id = ?`)

  const tx = db.transaction((items: Record<string, ReportDetail>) => {
    for (const [id, rpt] of Object.entries(items)) {
      insertReport.run(id, rpt.reportNumber, rpt.generatedAt, rpt.profile, rpt.disclaimer, rpt.exportNote)
      deleteFindings.run(id)
      deleteReportProducts.run(id)

      for (const f of rpt.findings) {
        insertFinding.run(id, f.label, f.band, f.detail, f.clientMessage ?? buildClientMessage(f.label, f.band))
      }

      rpt.recommendedProducts.forEach((p, i) => {
        insertProduct.run(p.id, p.name)
        insertReportProduct.run(id, p.id, i)
      })
    }
  })

  tx(store)
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

export async function getAnalyticsStore(): Promise<AdminAnalyticsSummary> {
  ensureDatabase()
  await tryMigrateJsonSeeds()
  const db = databaseInstance as DatabaseConnection

  try {
    const summaryRow = db.prepare(`SELECT totalUsers, totalScans, scansThisWeek, reportDownloads, avgOverallScore FROM analytics_summary LIMIT 1`).get() as AnalyticsSummaryRow | undefined

    if (!summaryRow) return defaultAnalytics

    const topConcerns = db.prepare(`SELECT concernType, count FROM top_concerns ORDER BY count DESC`).all() as TopConcernRow[]
    const topProducts = db.prepare(`SELECT productId, name, count FROM top_recommended_products ORDER BY count DESC`).all() as TopRecommendedProductRow[]
    const recentScans = db.prepare(`SELECT scanId, userFullName, overallScore, status, createdAt FROM recent_scans ORDER BY createdAt DESC LIMIT 20`).all() as RecentScanRow[]

    return {
      totalUsers: summaryRow.totalUsers,
      totalScans: summaryRow.totalScans,
      scansThisWeek: summaryRow.scansThisWeek,
      reportDownloads: summaryRow.reportDownloads,
      avgOverallScore: summaryRow.avgOverallScore,
      topConcerns: topConcerns.map((r) => ({ concernType: r.concernType, count: r.count })),
      topRecommendedProducts: topProducts.map((p) => ({ productId: p.productId, name: p.name, count: p.count })),
      recentScans: recentScans.map((s) => ({ scanId: s.scanId, userFullName: s.userFullName, overallScore: s.overallScore, status: s.status, createdAt: s.createdAt })),
    }
  } catch {
    return defaultAnalytics
  }
}

export async function saveAnalyticsStore(summary: AdminAnalyticsSummary) {
  ensureDatabase()
  const db = databaseInstance as DatabaseConnection

  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_summary (
      totalUsers INTEGER,
      totalScans INTEGER,
      scansThisWeek INTEGER,
      reportDownloads INTEGER,
      avgOverallScore REAL
    )
  `)

  const deleteSummary = db.prepare(`DELETE FROM analytics_summary`)
  const insertSummary = db.prepare(`INSERT INTO analytics_summary (totalUsers,totalScans,scansThisWeek,reportDownloads,avgOverallScore) VALUES (?,?,?,?,?)`)

  const deleteConcerns = db.prepare(`DELETE FROM top_concerns`)
  const insertConcern = db.prepare(`INSERT INTO top_concerns (concernType, count) VALUES (?, ?)`)

  const deleteTopProducts = db.prepare(`DELETE FROM top_recommended_products`)
  const insertTopProduct = db.prepare(`INSERT INTO top_recommended_products (productId, name, count) VALUES (?, ?, ?)`)

  const deleteRecent = db.prepare(`DELETE FROM recent_scans`)
  const insertRecent = db.prepare(`INSERT INTO recent_scans (scanId, userFullName, overallScore, status, createdAt) VALUES (?, ?, ?, ?, ?)`)

  db.exec(`
    CREATE TABLE IF NOT EXISTS top_concerns (concernType TEXT PRIMARY KEY, count INTEGER);
    CREATE TABLE IF NOT EXISTS top_recommended_products (productId TEXT PRIMARY KEY, name TEXT, count INTEGER);
    CREATE TABLE IF NOT EXISTS recent_scans (scanId TEXT PRIMARY KEY, userFullName TEXT, overallScore REAL, status TEXT, createdAt TEXT);
  `)

  const tx = db.transaction((s: AdminAnalyticsSummary) => {
    deleteSummary.run()
    insertSummary.run(s.totalUsers, s.totalScans, s.scansThisWeek, s.reportDownloads, s.avgOverallScore)

    deleteConcerns.run()
    for (const c of s.topConcerns) insertConcern.run(c.concernType, c.count)

    deleteTopProducts.run()
    for (const p of s.topRecommendedProducts) insertTopProduct.run(p.productId, p.name, p.count)

    deleteRecent.run()
    for (const r of s.recentScans) insertRecent.run(r.scanId, r.userFullName, r.overallScore, r.status, r.createdAt)
  })

  tx(summary)
}
