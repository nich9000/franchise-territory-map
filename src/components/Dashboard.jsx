import React from 'react'
import {
  Settings,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Store,
} from 'lucide-react'

const Dashboard = ({
  preset,
  selectedLocation,
  demographics,
  radiusMiles,
  setRadiusMiles,
  minPopulation,
  setMinPopulation,
  minIncome,
  setMinIncome,
  showCompetitors,
  setShowCompetitors,
  competitorFilters,
  setCompetitorFilters,
}) => {
  const handleFilterToggle = (type) => {
    if (competitorFilters.includes(type)) {
      setCompetitorFilters(competitorFilters.filter((t) => t !== type))
    } else {
      setCompetitorFilters([...competitorFilters, type])
    }
  }

  const hasLocation = !!selectedLocation && !!demographics
  const popPassed = demographics?.population >= minPopulation
  const incomePassed = demographics?.medianIncome >= minIncome
  const allowedTypes = preset.competitorTypes ?? []

  return (
    <div className="dashboard glass-panel">
      <div className="dashboard-header">
        <h2>Territory Analysis</h2>
        <p>
          {preset.label} — {preset.tagline}
        </p>
      </div>

      <div className="section">
        <h3>
          <Settings size={18} /> Configuration
        </h3>

        <div className="control-group">
          <label>
            Territory Radius (Miles): <span>{radiusMiles}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={radiusMiles}
            onChange={(e) => setRadiusMiles(parseFloat(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            Min Population: <span>{minPopulation.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={minPopulation}
            onChange={(e) => setMinPopulation(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            Min Median Income: <span>${minIncome.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="40000"
            max="150000"
            step="5000"
            value={minIncome}
            onChange={(e) => setMinIncome(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group toggle">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showCompetitors}
              onChange={(e) => setShowCompetitors(e.target.checked)}
            />
            Show Existing Locations
          </label>

          {showCompetitors && allowedTypes.length > 0 && (
            <div
              style={{
                marginLeft: '24px',
                marginTop: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {allowedTypes.map((type) => (
                <label
                  key={type}
                  className="checkbox-label"
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                >
                  <input
                    type="checkbox"
                    checked={competitorFilters.includes(type)}
                    onChange={() => handleFilterToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section results-section">
        <h3>
          <MapPin size={18} /> Location Data
        </h3>

        {!hasLocation ? (
          <div className="empty-state">
            <p>Click on the map to drop a pin and analyze a neighborhood.</p>
          </div>
        ) : (
          <div className="data-cards">
            {demographics?.areaName && (
              <div className="data-card neutral">
                <div className="card-header">
                  <MapPin size={16} />
                  <span>Aggregated Area</span>
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginTop: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {demographics.areaName}
                </div>
              </div>
            )}
            <div className={`data-card ${popPassed ? 'pass' : 'fail'}`}>
              <div className="card-header">
                <Users size={16} />
                <span>Population</span>
              </div>
              <div className="card-value">
                {demographics.population.toLocaleString()}
              </div>
              <div className="card-status">
                {popPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                <span>{popPassed ? 'Meets req' : 'Below req'}</span>
              </div>
            </div>

            <div className={`data-card ${incomePassed ? 'pass' : 'fail'}`}>
              <div className="card-header">
                <DollarSign size={16} />
                <span>Median Income</span>
              </div>
              <div className="card-value">
                ${demographics.medianIncome.toLocaleString()}
              </div>
              <div className="card-status">
                {incomePassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                <span>{incomePassed ? 'Meets req' : 'Below req'}</span>
              </div>
            </div>

            <div className="data-card neutral">
              <div className="card-header">
                <Store size={16} />
                <span>Existing Locations (≈15mi)</span>
              </div>
              <div className="card-value">
                {demographics.existingLocations.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {hasLocation && (
        <div className="viability-banner">
          {popPassed && incomePassed ? (
            <div className="banner success">
              <h4>Territory Viable</h4>
              <p>This area meets the {preset.label} criteria.</p>
            </div>
          ) : (
            <div className="banner warning">
              <h4>Does Not Meet Criteria</h4>
              <p>Adjust your requirements or try a different location.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
