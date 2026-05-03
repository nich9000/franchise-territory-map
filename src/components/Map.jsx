import React from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  GeoJSON,
  Tooltip,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon path issues with bundlers.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const existingIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng)
    },
  })
  return null
}

const Map = ({
  selectedLocation,
  radiusMiles,
  onLocationSelect,
  existingLocations,
  showCompetitors,
  competitorFilters,
  geoJson,
}) => {
  const defaultCenter = [39.8283, -98.5795] // Center of US
  const radiusMeters = radiusMiles * 1609.34

  return (
    <div className="map-wrapper">
      <MapContainer
        center={
          selectedLocation
            ? [selectedLocation.lat, selectedLocation.lng]
            : defaultCenter
        }
        zoom={selectedLocation ? 13 : 4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />

        {selectedLocation && !geoJson && (
          <>
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            <Circle
              center={[selectedLocation.lat, selectedLocation.lng]}
              pathOptions={{
                fillColor: '#3b82f6',
                color: '#2563eb',
                weight: 2,
                fillOpacity: 0.2,
              }}
              radius={radiusMeters}
            />
          </>
        )}

        {selectedLocation && geoJson && (
          <>
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            <GeoJSON
              key={geoJson.features.map((f) => f.properties.GEOID).join('-')}
              data={geoJson}
              style={{
                fillColor: '#3b82f6',
                color: '#2563eb',
                weight: 2,
                fillOpacity: 0.2,
              }}
            />
          </>
        )}

        {showCompetitors &&
          existingLocations
            .filter((loc) => competitorFilters?.includes(loc.type))
            .map((loc) => (
              <React.Fragment key={loc.id}>
                <Marker position={[loc.lat, loc.lng]} icon={existingIcon}>
                  <Tooltip
                    direction="top"
                    offset={[0, -30]}
                    opacity={0.9}
                    permanent
                    className="font-bold"
                  >
                    {loc.name}
                  </Tooltip>
                </Marker>
                <Circle
                  center={[loc.lat, loc.lng]}
                  pathOptions={{
                    fillColor: '#ef4444',
                    color: '#dc2626',
                    weight: 2,
                    fillOpacity: 0.1,
                  }}
                  radius={2 * 1609.34}
                />
              </React.Fragment>
            ))}
      </MapContainer>
    </div>
  )
}

export default Map
