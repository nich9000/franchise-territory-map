// Optional fallback for offline / demo use. The live app uses real Census +
// OSM data via censusApi.js and competitorApi.js. This file is kept so a fork
// without internet can still render plausible numbers.

export const generateMockDemographics = (lat, lng, radiusMiles) => {
  const seed = Math.abs(Math.sin(lat * lng)) * 10000
  const baseDensity = 2000 + (seed % 6000)
  const areaSqMiles = Math.PI * radiusMiles * radiusMiles
  const population = Math.round(baseDensity * areaSqMiles)
  const income = 40000 + ((seed * 11) % 110000)

  const existingLocations = []
  const numLocations = Math.floor((seed % 10) / 3)

  for (let i = 0; i < numLocations; i++) {
    const latOffset = (((Math.sin(seed + i) * 10000) % 200) - 100) / 1000
    const lngOffset = (((Math.cos(seed + i) * 10000) % 200) - 100) / 1000

    existingLocations.push({
      id: i,
      lat: lat + latOffset,
      lng: lng + lngOffset,
      name: `Studio #${100 + Math.floor(seed % 100) + i}`,
      type: 'Pilates',
    })
  }

  return {
    population,
    medianIncome: Math.round(income),
    existingLocations,
  }
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
