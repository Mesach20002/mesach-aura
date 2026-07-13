export type CurrentClimate = {
  provider: "openweather"
  location: {
    name: string | null
    country: string | null
    latitude: number
    longitude: number
  }
  observedAt: string
  temperatureCelsius: number
  feelsLikeCelsius: number
  humidityPercent: number
  pressureHpa: number | null
  windSpeedMps: number | null
  cloudCoverPercent: number | null
  visibilityMeters: number | null
  condition: string
  description: string
  weatherIconCode: string | null
  uvIndex: number | null
  pm25: number | null
  pm10: number | null
  airQualityIndex: number | null
}

export type AirPollutionData = {
  observedAt: string | null
  pm25: number | null
  pm10: number | null
  airQualityIndex: number | null
}

export type WeatherLocation = {
  name: string
  region: string | null
  country: string | null
  latitude: number
  longitude: number
}

export type WeatherProductTag =
  | "barrier-support"
  | "richer-moisturizer"
  | "gentle-cleanser"
  | "lightweight-moisturizer"
  | "non-comedogenic"
  | "gel-cleanser"
  | "lightweight-routine"
  | "hydration"
  | "sunscreen-support"
  | "gentle-cleansing"
  | "antioxidant"
  | "sunscreen"
  | "protective-routine"

export type ClimateRecommendation = {
  code: string
  title: string
  explanation: string
  priority: "low" | "medium" | "high"
  recommendedProductTags: WeatherProductTag[]
}

export type ClimateReportContext = {
  snapshot: CurrentClimate
  recommendations: ClimateRecommendation[]
}
