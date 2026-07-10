import {
  Prisma,
  SeverityBand as DbSeverityBand,
  SkinType as DbSkinType,
} from "@prisma/client"

import type { SeverityBand, SkinAssessment, SkinConcern } from "@/lib/ai/types"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"
import { getProductRecommendations } from "@/lib/recommendations/engine"
import { auroraProducts } from "@/lib/recommendations/products"
import type {
  AuroraProduct,
  ProductRecommendation,
} from "@/lib/recommendations/types"
import {
  createSkinReport,
  deleteSkinReportById,
  getRecentSkinReports,
  getSkinReportById,
} from "@/lib/reports/mock-report-store"
import type { SkinReport } from "@/lib/reports/types"

const reportInclude = {
  assessment: true,
  recommendations: true,
} satisfies Prisma.SkinReportInclude

type ReportWithRelations = Prisma.SkinReportGetPayload<{
  include: typeof reportInclude
}>

const skinTypeToDb: Record<SkinAssessment["skinType"], DbSkinType> = {
  normal: DbSkinType.NORMAL,
  dry: DbSkinType.DRY,
  oily: DbSkinType.OILY,
  combination: DbSkinType.COMBINATION,
  "sensitive-looking": DbSkinType.SENSITIVE_LOOKING,
}

const skinTypeFromDb: Record<DbSkinType, SkinAssessment["skinType"]> = {
  [DbSkinType.NORMAL]: "normal",
  [DbSkinType.DRY]: "dry",
  [DbSkinType.OILY]: "oily",
  [DbSkinType.COMBINATION]: "combination",
  [DbSkinType.SENSITIVE_LOOKING]: "sensitive-looking",
}

const severityBandToDb: Record<SeverityBand, DbSeverityBand> = {
  low: DbSeverityBand.LOW,
  moderate: DbSeverityBand.MODERATE,
  high: DbSeverityBand.HIGH,
}

const severityBandFromDb: Record<DbSeverityBand, SeverityBand> = {
  [DbSeverityBand.LOW]: "low",
  [DbSeverityBand.MODERATE]: "moderate",
  [DbSeverityBand.HIGH]: "high",
}

const recommendationConcernMap: Record<SkinConcern, string[]> = {
  hydration: ["hydration", "dryness"],
  texture: ["uneven texture", "rough texture"],
  pores: ["pores", "enlarged pores", "clogged pores"],
  redness: ["redness", "irritation appearance"],
  pigmentation: ["pigmentation appearance", "uneven tone"],
  "fine-lines": ["fine lines", "aging appearance"],
  dullness: ["dullness"],
  oiliness: ["oiliness"],
}

export async function createReportRecord(
  assessment: SkinAssessment,
  userId?: string
): Promise<SkinReport> {
  if (!isPrismaAvailable) {
    return createSkinReport(assessment, userId)
  }

  try {
    const prisma = getPrismaClient()
    const recommendations = buildRecommendations(assessment)
    const record = await prisma.skinReport.create({
      data: {
        userId,
        skinType: skinTypeToDb[assessment.skinType],
        summary: assessment.summary,
        guidance: assessment.guidance,
        disclaimer: assessment.disclaimer,
        assessment: {
          create: {
            hydrationBand: severityBandToDb[assessment.concerns.hydration],
            textureBand: severityBandToDb[assessment.concerns.texture],
            poresBand: severityBandToDb[assessment.concerns.pores],
            rednessBand: severityBandToDb[assessment.concerns.redness],
            pigmentationBand:
              severityBandToDb[assessment.concerns.pigmentation],
            fineLinesBand: severityBandToDb[assessment.concerns["fine-lines"]],
            dullnessBand: severityBandToDb[assessment.concerns.dullness],
            oilinessBand: severityBandToDb[assessment.concerns.oiliness],
          },
        },
        recommendations: {
          create: recommendations.map((recommendation) => ({
            productName: recommendation.product.name,
            productUrl: recommendation.product.productUrl,
            matchedConcerns: recommendation.matchedConcerns,
            reason: recommendation.reason,
            priorityBand: recommendationPriorityToDb(
              recommendation.priorityBand
            ),
          })),
        },
        scanEvents: {
          create: {
            status: "COMPLETED",
          },
        },
      },
      include: reportInclude,
    })

    return mapReportRecord(record)
  } catch (error) {
    logDatabaseFallback("create report", error)
    return createSkinReport(assessment, userId)
  }
}

export async function getReportRecordById(
  id: string
): Promise<SkinReport | null> {
  if (!isPrismaAvailable) {
    return getSkinReportById(id)
  }

  try {
    const prisma = getPrismaClient()
    const record = await prisma.skinReport.findUnique({
      where: { id },
      include: reportInclude,
    })

    return record ? mapReportRecord(record) : getSkinReportById(id)
  } catch (error) {
    logDatabaseFallback("read report", error)
    return getSkinReportById(id)
  }
}

export async function listRecentReportRecords(
  limit = 10
): Promise<SkinReport[]> {
  if (!isPrismaAvailable) {
    return getRecentSkinReports(limit)
  }

  try {
    const prisma = getPrismaClient()
    const records = await prisma.skinReport.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: reportInclude,
    })

    return records.map(mapReportRecord)
  } catch (error) {
    logDatabaseFallback("list reports", error)
    return getRecentSkinReports(limit)
  }
}

export async function deleteReportRecord(id: string): Promise<void> {
  if (!isPrismaAvailable) {
    deleteSkinReportById(id)
    return
  }

  try {
    const prisma = getPrismaClient()
    await prisma.skinReport.delete({
      where: { id },
    })
  } catch (error) {
    logDatabaseFallback("delete report", error)
    deleteSkinReportById(id)
  }
}

function buildRecommendations(
  assessment: SkinAssessment
): ProductRecommendation[] {
  const concerns = Object.keys(assessment.concerns) as SkinConcern[]
  const recommendationConcerns = concerns.flatMap(
    (concern) => recommendationConcernMap[concern]
  )
  const severityBands = Object.fromEntries(
    concerns.flatMap((concern) =>
      recommendationConcernMap[concern].map((mappedConcern) => [
        mappedConcern,
        assessment.concerns[concern],
      ])
    )
  ) as Partial<Record<string, SeverityBand>>

  return getProductRecommendations({
    skinType: assessment.skinType,
    concerns: recommendationConcerns,
    severityBands,
    maxResults: 4,
  })
}

function recommendationPriorityToDb(
  priorityBand: ProductRecommendation["priorityBand"]
): DbSeverityBand {
  if (priorityBand === "skin type") {
    return DbSeverityBand.LOW
  }

  return severityBandToDb[priorityBand]
}

function mapReportRecord(record: ReportWithRelations): SkinReport {
  if (!record.assessment) {
    throw new Error(`Report ${record.id} is missing its skin assessment.`)
  }

  return {
    id: record.id,
    userId: record.userId,
    createdAt: record.createdAt.toISOString(),
    assessment: {
      skinType: skinTypeFromDb[record.skinType],
      concerns: {
        hydration: severityBandFromDb[record.assessment.hydrationBand],
        texture: severityBandFromDb[record.assessment.textureBand],
        pores: severityBandFromDb[record.assessment.poresBand],
        redness: severityBandFromDb[record.assessment.rednessBand],
        pigmentation: severityBandFromDb[record.assessment.pigmentationBand],
        "fine-lines": severityBandFromDb[record.assessment.fineLinesBand],
        dullness: severityBandFromDb[record.assessment.dullnessBand],
        oiliness: severityBandFromDb[record.assessment.oilinessBand],
      },
      summary: record.summary,
      guidance: getStringArray(record.guidance),
      disclaimer: record.disclaimer,
    },
    recommendations: record.recommendations.map(mapRecommendationRecord),
    privacy: {
      imageStored: false,
      imageRetentionConsent: false,
    },
  }
}

function mapRecommendationRecord(
  recommendation: ReportWithRelations["recommendations"][number]
): ProductRecommendation {
  return {
    product: getRecommendationProduct(recommendation),
    matchedConcerns: getStringArray(recommendation.matchedConcerns),
    reason: recommendation.reason,
    priorityBand: severityBandFromDb[recommendation.priorityBand],
  }
}

function getRecommendationProduct(
  recommendation: ReportWithRelations["recommendations"][number]
): AuroraProduct {
  const product = auroraProducts.find(
    (item) => item.name === recommendation.productName
  )

  if (product) {
    return {
      ...product,
      productUrl: recommendation.productUrl ?? product.productUrl,
    }
  }

  return {
    id: recommendation.productName.toLowerCase().replaceAll(" ", "-"),
    name: recommendation.productName,
    description: null,
    shortDescription: null,
    price: null,
    regularPrice: null,
    categories: ["face-care"],
    tags: [],
    ingredientsHighlight: [],
    imageUrl: "",
    productUrl: recommendation.productUrl ?? "",
    suitableConcerns: [],
    recommendationReason: recommendation.reason,
    defaultFaceScanEligible: true,
  }
}

function getStringArray(value: Prisma.JsonValue): string[] {
  return Array.isArray(value)
    ? value.filter((item: any): item is string => typeof item === "string")
    : []
}

function logDatabaseFallback(action: string, error: unknown): void {
  if (process.env.NODE_ENV === "production") {
    return
  }

  const message = error instanceof Error ? error.message : "Unknown error"
  console.warn(
    `Aurora report repository could not ${action}; using mock report store fallback. ${message}`
  )
}
