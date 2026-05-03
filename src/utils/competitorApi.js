// Pull real "existing location" candidates from OpenStreetMap via the
// Overpass API. Categories returned here line up with `competitorTypes`
// in src/presets.js — extend the query if you add new preset types.

export const getCompetitors = async (lat, lng /*, radiusMiles */) => {
  try {
    // Always search a generous 15 mi for context, regardless of territory radius.
    const searchRadiusMeters = 24140

    const query = `
      [out:json][timeout:25];
      (
        node["sport"="pilates"](around:${searchRadiusMeters}, ${lat}, ${lng});
        way["sport"="pilates"](around:${searchRadiusMeters}, ${lat}, ${lng});
        node["leisure"="fitness_centre"](around:${searchRadiusMeters}, ${lat}, ${lng});
        way["leisure"="fitness_centre"](around:${searchRadiusMeters}, ${lat}, ${lng});
        node["amenity"="cafe"](around:${searchRadiusMeters}, ${lat}, ${lng});
        way["amenity"="cafe"](around:${searchRadiusMeters}, ${lat}, ${lng});
      );
      out center;
    `

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

    const res = await fetch(url)
    const data = await res.json()

    if (!data || !data.elements) return []

    return data.elements
      .map((el) => {
        const elLat = el.lat || (el.center && el.center.lat)
        const elLng = el.lon || (el.center && el.center.lon)
        const tags = el.tags || {}
        const name = tags.name || 'Unnamed location'

        let type = 'Other'
        if (tags.sport === 'pilates') type = 'Pilates'
        else if (tags.leisure === 'fitness_centre') type = 'Fitness Center'
        else if (tags.amenity === 'cafe') type = 'Cafe'

        return { id: el.id, lat: elLat, lng: elLng, name, type }
      })
      .filter((loc) => loc.lat && loc.lng)
  } catch (error) {
    console.error('Error fetching competitor data:', error)
    return []
  }
}
