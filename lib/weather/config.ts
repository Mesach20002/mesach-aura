export class OpenWeatherConfigurationError extends Error {
  constructor() {
    super("OpenWeather is not configured.")
    this.name = "OpenWeatherConfigurationError"
  }
}

export function getOpenWeatherApiKey(): string {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim()

  if (!apiKey) {
    throw new OpenWeatherConfigurationError()
  }

  return apiKey
}
