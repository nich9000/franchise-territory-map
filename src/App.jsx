import React, { useState, useEffect, useMemo } from 'react'
import Map from './components/Map'
import Dashboard from './components/Dashboard'
import { getCensusDemographics } from './utils/censusApi'
import { getCompetitors } from './utils/competitorApi'
import { FRANCHISE_PRESETS, DEFAULT_PRESET_ID, getPresetById } from './presets'

function App() {
  const [presetId, setPresetId] = useState(DEFAULT_PRESET_ID)
  const preset = useMemo(() => getPresetById(presetId), [presetId])

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [radiusMiles, setRadiusMiles] = useState(preset.radiusMiles)
  const [minPopulation, setMinPopulation] = useState(preset.minPopulation)
  const [minIncome, setMinIncome] = useState(preset.minIncome)
  const [showCompetitors, setShowCompetitors] = useState(false)
  const [competitorFilters, setCompetitorFilters] = useState(preset.competitorTypes)

  const [demographics, setDemographics] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // When the preset changes, snap the rules back to that preset's defaults.
  useEffect(() => {
    setRadiusMiles(preset.radiusMiles)
    setMinPopulation(preset.minPopulation)
    setMinIncome(preset.minIncome)
    setCompetitorFilters(preset.competitorTypes)
  }, [preset])

  useEffect(() => {
    let isMounted = true
    const fetchDemographics = async () => {
      if (selectedLocation) {
        setIsLoading(true)

        const [censusData, competitorData] = await Promise.all([
          getCensusDemographics(selectedLocation.lat, selectedLocation.lng, radiusMiles),
          getCompetitors(selectedLocation.lat, selectedLocation.lng, radiusMiles),
        ])

        if (isMounted) {
          censusData.existingLocations = competitorData
          setDemographics(censusData)
          setIsLoading(false)
        }
      }
    }
    fetchDemographics()
    return () => {
      isMounted = false
    }
  }, [selectedLocation, radiusMiles])

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          Territory<span>IQ</span>
        </h1>
        <p>Franchise Location Intelligence</p>
        <div className="preset-picker">
          <label htmlFor="preset-select">Concept</label>
          <select
            id="preset-select"
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
          >
            {FRANCHISE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="app-main">
        <div className="dashboard-container">
          <Dashboard
            preset={preset}
            selectedLocation={selectedLocation}
            demographics={demographics}
            radiusMiles={radiusMiles}
            setRadiusMiles={setRadiusMiles}
            minPopulation={minPopulation}
            setMinPopulation={setMinPopulation}
            minIncome={minIncome}
            setMinIncome={setMinIncome}
            showCompetitors={showCompetitors}
            setShowCompetitors={setShowCompetitors}
            isLoading={isLoading}
            competitorFilters={competitorFilters}
            setCompetitorFilters={setCompetitorFilters}
          />
        </div>
        <div className="map-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <h3>Calculating Territory Data...</h3>
              <p>Fetching geospatial boundaries and competitor locations.</p>
            </div>
          )}
          <Map
            selectedLocation={selectedLocation}
            radiusMiles={radiusMiles}
            onLocationSelect={handleLocationSelect}
            existingLocations={demographics?.existingLocations || []}
            showCompetitors={showCompetitors}
            competitorFilters={competitorFilters}
            geoJson={demographics?.geoJson}
          />
        </div>
      </main>
    </div>
  )
}

export default App
