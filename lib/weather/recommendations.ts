import type { ClimateRecommendation, CurrentClimate } from "@/lib/weather/types"

export function getClimateRecommendations(
  climate: CurrentClimate
): ClimateRecommendation[] {
  const recommendations: ClimateRecommendation[] = []

  if (climate.humidityPercent < 35) {
    recommendations.push({
      code: "low-humidity",
      title: "Dry-climate comfort",
      explanation:
        "Low humidity can make skin feel less comfortable, so consider gentle cleansing and richer, barrier-supportive cosmetic moisture.",
      priority: climate.humidityPercent < 25 ? "high" : "medium",
      recommendedProductTags: [
        "barrier-support",
        "richer-moisturizer",
        "gentle-cleanser",
      ],
    })
  }

  if (climate.humidityPercent > 75) {
    recommendations.push({
      code: "high-humidity",
      title: "Light layers for humid conditions",
      explanation:
        "In high humidity, lightweight and non-comedogenic cosmetic layers may feel more comfortable on the skin.",
      priority: "medium",
      recommendedProductTags: [
        "lightweight-moisturizer",
        "non-comedogenic",
        "gel-cleanser",
      ],
    })
  }

  if (climate.temperatureCelsius > 30) {
    recommendations.push({
      code: "high-temperature",
      title: "Warm-weather routine",
      explanation:
        "Warm conditions may suit a lighter cosmetic routine with comfortable hydration and daytime sun-protection support.",
      priority: "medium",
      recommendedProductTags: [
        "lightweight-routine",
        "hydration",
        "sunscreen-support",
      ],
    })
  }

  if (climate.pm25 !== null && climate.pm25 > 35) {
    recommendations.push({
      code: "elevated-pm25",
      title: "Elevated particulate conditions",
      explanation:
        "A gentle evening cleanse and antioxidant-focused cosmetic care can help remove surface buildup after time outdoors.",
      priority: "high",
      recommendedProductTags: [
        "gentle-cleansing",
        "antioxidant",
        "barrier-support",
      ],
    })
  }

  if (climate.uvIndex !== null && climate.uvIndex >= 6) {
    recommendations.push({
      code: "high-uv",
      title: "UV-aware daytime care",
      explanation:
        "Current UV conditions favor a protective daytime cosmetic routine and appropriate sunscreen use.",
      priority: climate.uvIndex >= 8 ? "high" : "medium",
      recommendedProductTags: ["sunscreen", "protective-routine"],
    })
  }

  return recommendations
}
