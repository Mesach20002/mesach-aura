import {
  Prisma,
  SeverityBand as DbSeverityBand,
  SkinType as DbSkinType,
} from "@prisma/client"

import type { SeverityBand, SkinAssessment, SkinConcern } from "@/lib/ai/types"
import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"
import { getProductRecommendations } from "@/lib/recommendations/engine"
import { auroraProductCatalog } from "@/lib/products/catalog"
import type { AuroraProduct } from "@/lib/products/types"
import type { ProductRecommendation } from "@/lib/recommendations/types"
import {
  createSkinReport,
  deleteSkinReportById,
  getRecentSkinReports,
  getSkinReportById,
} from "@/lib/reports/mock-report-store"
import type { SkinReport } from "@/lib/reports/types"
import type {
  ClimateRecommendation,
  ClimateReportContext,
  WeatherProductTag,
} from "@/lib/weather/types"

const reportInclude = {
  assessment: true,
  climateSnapshot: true,
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

const weatherProductTags = new Set<WeatherProductTag>([
  "barrier-support",
  "richer-moisturizer",
  "gentle-cleanser",
  "lightweight-moisturizer",
  "non-comedogenic",
  "gel-cleanser",
  "lightweight-routine",
  "hydration",
  "sunscreen-support",
  "gentle-cleansing",
  "antioxidant",
  "sunscreen",
  "protective-routine",
])

export async function createReportRecord(
  assessment: SkinAssessment,
  userId?: string,
  climate?: ClimateReportContext
): Promise<SkinReport> {
  if (!isPrismaAvailable) {
    return createSkinReport(assessment, userId, climate)
  }

  try {
    const prisma = getPrismaClient()
    const recommendations = buildRecommendations(assessment, climate)
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
        climateSnapshot: climate
          ? {
              create: {
                locationName: climate.snapshot.location.name,
                country: climate.snapshot.location.country,
                latitudeRounded: climate.snapshot.location.latitude,
                longitudeRounded: climate.snapshot.location.longitude,
                temperatureCelsius: climate.snapshot.temperatureCelsius,
                feelsLikeCelsius: climate.snapshot.feelsLikeCelsius,
                humidityPercent: Math.round(climate.snapshot.humidityPercent),
                pressureHpa: roundNullable(climate.snapshot.pressureHpa),
                windSpeedMps: climate.snapshot.windSpeedMps,
                cloudCoverPercent: roundNullable(
                  climate.snapshot.cloudCoverPercent
                ),
                visibilityMeters: roundNullable(
                  climate.snapshot.visibilityMeters
                ),
                condition: climate.snapshot.condition,
                description: climate.snapshot.description,
                uvIndex: climate.snapshot.uvIndex,
                pm25: climate.snapshot.pm25,
                pm10: climate.snapshot.pm10,
                airQualityIndex: roundNullable(
                  climate.snapshot.airQualityIndex
                ),
                provider: climate.snapshot.provider,
                recommendations:
                  climate.recommendations as Prisma.InputJsonValue,
                observedAt: new Date(climate.snapshot.observedAt),
              },
            }
          : undefined,
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
    return createSkinReport(assessment, userId, climate)
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
  assessment: SkinAssessment,
  climate?: ClimateReportContext
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
    climateTags: getClimateTags(climate),
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
    recommendations: record.recommendations
      .map(mapRecommendationRecord)
      .filter(
        (recommendation): recommendation is ProductRecommendation =>
          recommendation !== null
      ),
    privacy: {
      imageStored: false,
      imageRetentionConsent: false,
    },
    climate: record.climateSnapshot
      ? mapClimateSnapshot(record.climateSnapshot)
      : null,
  }
}

function mapClimateSnapshot(
  snapshot: NonNullable<ReportWithRelations["climateSnapshot"]>
): ClimateReportContext | null {
  if (
    snapshot.provider !== "openweather" ||
    snapshot.latitudeRounded === null ||
    snapshot.longitudeRounded === null ||
    snapshot.feelsLikeCelsius === null ||
    !snapshot.condition ||
    !snapshot.description
  ) {
    return null
  }

  return {
    snapshot: {
      provider: "openweather",
      location: {
        name: snapshot.locationName,
        country: snapshot.country,
        latitude: snapshot.latitudeRounded,
        longitude: snapshot.longitudeRounded,
      },
      observedAt: snapshot.observedAt.toISOString(),
      temperatureCelsius: snapshot.temperatureCelsius,
      feelsLikeCelsius: snapshot.feelsLikeCelsius,
      humidityPercent: snapshot.humidityPercent,
      pressureHpa: snapshot.pressureHpa,
      windSpeedMps: snapshot.windSpeedMps,
      cloudCoverPercent: snapshot.cloudCoverPercent,
      visibilityMeters: snapshot.visibilityMeters,
      condition: snapshot.condition,
      description: snapshot.description,
      weatherIconCode: null,
      uvIndex: snapshot.uvIndex,
      pm25: snapshot.pm25,
      pm10: snapshot.pm10,
      airQualityIndex: snapshot.airQualityIndex,
    },
    recommendations: getClimateRecommendationArray(snapshot.recommendations),
  }
}

function getClimateTags(
  climate: ClimateReportContext | undefined
): WeatherProductTag[] {
  return Array.from(
    new Set(
      climate?.recommendations.flatMap(
        (recommendation) => recommendation.recommendedProductTags
      ) ?? []
    )
  )
}

function getClimateRecommendationArray(
  value: Prisma.JsonValue
): ClimateRecommendation[] {
  if (!Array.isArray(value)) return []
  return value.filter(isClimateRecommendation)
}

function isClimateRecommendation(
  value: Prisma.JsonValue
): value is ClimateRecommendation {
  if (!value || Array.isArray(value) || typeof value !== "object") return false

  return (
    typeof value.code === "string" &&
    typeof value.title === "string" &&
    typeof value.explanation === "string" &&
    (value.priority === "low" ||
      value.priority === "medium" ||
      value.priority === "high") &&
    Array.isArray(value.recommendedProductTags) &&
    value.recommendedProductTags.every(
      (tag) =>
        typeof tag === "string" &&
        weatherProductTags.has(tag as WeatherProductTag)
    )
  )
}

function roundNullable(value: number | null): number | null {
  return value === null ? null : Math.round(value)
}

function mapRecommendationRecord(
  recommendation: ReportWithRelations["recommendations"][number]
): ProductRecommendation | null {
  const product = getRecommendationProduct(recommendation)

  if (!product) {
    return null
  }

  return {
    product,
    matchedConcerns: getStringArray(recommendation.matchedConcerns).filter(
      (concern): concern is ProductRecommendation["matchedConcerns"][number] =>
        product.skinConcerns.includes(
          concern as ProductRecommendation["matchedConcerns"][number]
        )
    ),
    reason: recommendation.reason,
    priorityBand: severityBandFromDb[recommendation.priorityBand],
    confidenceBand: "moderate",
    score: product.recommendationPriority,
  }
}

function getRecommendationProduct(
  recommendation: ReportWithRelations["recommendations"][number]
): AuroraProduct | null {
  const product = auroraProductCatalog.find(
    (item) => item.name === recommendation.productName
  )

  if (product) {
    return {
      ...product,
      productUrl: recommendation.productUrl ?? product.productUrl,
    }
  }

  return null
}

function getStringArray(value: Prisma.JsonValue): string[] {
  return Array.isArray(value)
    ? value.filter((item: unknown): item is string => typeof item === "string")
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
