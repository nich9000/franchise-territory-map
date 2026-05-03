// Pull real demographic data from the U.S. Census:
//   1) TIGERweb to find Census Tracts intersecting a circle around (lat,lng)
//   2) ACS 5-Year (2022) for population (B01003_001E) and median household
//      income (B19013_001E) by tract.
//
// The result is aggregated across all intersecting tracts and returned with
// the GeoJSON so the map can render the actual tract boundaries.

export const getCensusDemographics = async (lat, lng, radiusMiles) => {
  try {
    const tigerUrl = `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=${radiusMiles}&units=esriSRUnit_StatuteMile&outFields=GEOID,NAME&outSR=4326&returnGeometry=true&f=geojson`

    const tigerRes = await fetch(tigerUrl)
    const tigerData = await tigerRes.json()

    if (!tigerData || !tigerData.features || tigerData.features.length === 0) {
      throw new Error('No Census Tracts found in this area.')
    }

    const geoJson = tigerData
    const tracts = tigerData.features

    // GEOID is 11 digits: SSCCCTTTTTT — group by state+county for ACS calls.
    const countyGroups = {}
    tracts.forEach((f) => {
      const geoid = f.properties.GEOID
      if (!geoid || geoid.length !== 11) return
      const state = geoid.substring(0, 2)
      const county = geoid.substring(2, 5)
      const tract = geoid.substring(5, 11)

      const key = `${state},${county}`
      if (!countyGroups[key]) countyGroups[key] = []
      countyGroups[key].push(tract)
    })

    let totalPopulation = 0
    let incomeSum = 0
    let validIncomeCount = 0

    for (const [key, tractList] of Object.entries(countyGroups)) {
      const [state, county] = key.split(',')
      const tractQuery = tractList.join(',')

      const acsUrl = `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E&for=tract:${tractQuery}&in=state:${state}%20county:${county}`

      try {
        const acsRes = await fetch(acsUrl)
        const acsData = await acsRes.json()

        if (Array.isArray(acsData) && acsData.length > 1) {
          for (let i = 1; i < acsData.length; i++) {
            const pop = parseInt(acsData[i][0], 10)
            const inc = parseInt(acsData[i][1], 10)

            if (!isNaN(pop) && pop > 0) {
              totalPopulation += pop
            }
            // Census returns negative numbers for missing income data.
            if (!isNaN(inc) && inc > 0) {
              incomeSum += inc
              validIncomeCount++
            }
          }
        }
      } catch (e) {
        console.warn(
          `Failed to fetch ACS data for county ${county} in state ${state}`,
          e,
        )
      }
    }

    const medianIncome =
      validIncomeCount > 0 ? Math.round(incomeSum / validIncomeCount) : 0

    return {
      population: totalPopulation,
      medianIncome,
      areaName: `${tracts.length} Intersecting Census Tracts`,
      geoJson,
      existingLocations: [],
    }
  } catch (error) {
    console.error('Error fetching census data:', error)
    return {
      population: 0,
      medianIncome: 0,
      areaName: 'Data Unavailable',
      geoJson: null,
      existingLocations: [],
      error: error.message,
    }
  }
}
