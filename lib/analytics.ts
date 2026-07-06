import type { AdminAnalyticsSummary } from "@/types"

import { getAnalyticsStore } from "@/lib/data-store"

/**
 * TODO(db-team): Replace this file-backed store with real database queries.
 *
 * Keep this function's return shape stable. The admin dashboard, API route,
 * and future reporting jobs should all depend on this application-level shape
 * instead of duplicating analytics calculations.
 */
export async function getAdminAnalyticsSummary(): Promise<AdminAnalyticsSummary> {
  return getAnalyticsStore()
}
