export function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90
}

export function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180
}

export function parseCoordinates(
  latitudeValue: string | null,
  longitudeValue: string | null
): { latitude: number; longitude: number } | null {
  if (!latitudeValue || !longitudeValue) return null

  const latitude = Number(latitudeValue)
  const longitude = Number(longitudeValue)

  return isValidLatitude(latitude) && isValidLongitude(longitude)
    ? { latitude, longitude }
    : null
}
