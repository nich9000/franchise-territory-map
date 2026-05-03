// Franchise presets define the viability rules and competitor categories
// for different franchise concepts. Add or edit entries to fit your model.
//
// Each preset:
//   - id:               URL-safe identifier
//   - label:            Display name in the picker
//   - tagline:          One-line description shown in the dashboard header
//   - radiusMiles:      Default territory radius
//   - minPopulation:    Minimum population inside the territory to pass
//   - minIncome:        Minimum median household income to pass
//   - competitorTypes:  Categories shown when "Show Existing Locations" is on
//                       (must match values returned by competitorApi.js)
//
// The Census + competitor data comes from real APIs at runtime, so swapping
// presets actually re-evaluates the same neighborhood against different rules.

export const FRANCHISE_PRESETS = [
  {
    id: 'club-pilates',
    label: 'Club Pilates',
    tagline: 'Boutique reformer-pilates studio',
    radiusMiles: 2,
    minPopulation: 15000,
    minIncome: 75000,
    competitorTypes: ['Pilates', 'Fitness Center'],
  },
  {
    id: 'orangetheory',
    label: 'Orangetheory Fitness',
    tagline: 'Heart-rate-based group training',
    radiusMiles: 3,
    minPopulation: 35000,
    minIncome: 65000,
    competitorTypes: ['Fitness Center'],
  },
  {
    id: 'anytime-fitness',
    label: 'Anytime Fitness',
    tagline: '24/7 neighborhood gym',
    radiusMiles: 3,
    minPopulation: 20000,
    minIncome: 50000,
    competitorTypes: ['Fitness Center'],
  },
  {
    id: 'starbucks',
    label: 'Starbucks (illustrative)',
    tagline: 'High-frequency premium coffee',
    radiusMiles: 1,
    minPopulation: 12000,
    minIncome: 60000,
    competitorTypes: ['Cafe'],
  },
  {
    id: 'custom',
    label: 'Custom rules',
    tagline: 'Set your own thresholds',
    radiusMiles: 2,
    minPopulation: 15000,
    minIncome: 60000,
    competitorTypes: ['Pilates', 'Fitness Center', 'Cafe'],
  },
]

export const DEFAULT_PRESET_ID = 'club-pilates'

export const getPresetById = (id) =>
  FRANCHISE_PRESETS.find((p) => p.id === id) ?? FRANCHISE_PRESETS[0]
