import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, ZoomControl, useMap } from 'react-leaflet'
import { BASEMAP } from '../config'
import { createMarkerIcon } from '../lib/markers'

// Pans/zooms the map imperatively in response to selection changes.
function MapController({ route, selectedId }) {
  const map = useMap()

  // Frame the whole route when the route changes.
  useEffect(() => {
    if (!route?.alignment?.length) return
    map.fitBounds(route.alignment, { padding: [70, 70], maxZoom: 14 })
  }, [route, map])

  // Fly to a location when one is selected.
  useEffect(() => {
    if (!selectedId) return
    const loc = route.locations.find((l) => l.id === selectedId)
    if (loc) map.flyTo(loc.coordinates, 15, { duration: 0.8 })
  }, [selectedId, route, map])

  return null
}

/**
 * The interactive Leaflet map: basemap, route alignment, and location markers.
 */
export default function RouteMap({ route, selectedId, onSelect }) {
  // Rebuild icons only when selection changes.
  const markers = useMemo(
    () =>
      route.locations.map((loc) => ({
        loc,
        icon: createMarkerIcon(loc.type, { active: loc.id === selectedId }),
      })),
    [route, selectedId],
  )

  return (
    <MapContainer
      center={route.view.center}
      zoom={route.view.zoom}
      scrollWheelZoom={true}
      // On touch devices, require two fingers so the map doesn't hijack page scroll.
      dragging={true}
      className="h-full w-full"
      zoomControl={false}
      aria-label={`Map of the ${route.name} proposed passenger rail route`}
    >
      <TileLayer
        url={BASEMAP.url}
        attribution={BASEMAP.attribution}
        maxZoom={BASEMAP.maxZoom}
      />

      <ZoomControl position="bottomright" />


      {/* Casing under the route line for contrast on any basemap */}
      <Polyline
        positions={route.alignment}
        pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.9, lineCap: 'round' }}
      />
      <Polyline
        positions={route.alignment}
        pathOptions={{
          color: route.color,
          weight: 5,
          opacity: 0.95,
          dashArray: route.alignmentPlaceholder ? '1 12' : undefined,
          lineCap: 'round',
        }}
      />

      {markers.map(({ loc, icon }) => (
        <Marker
          key={loc.id}
          position={loc.coordinates}
          icon={icon}
          keyboard={true}
          alt={`${loc.name} — ${loc.type}`}
          eventHandlers={{ click: () => onSelect(loc.id) }}
          title={loc.name}
        />
      ))}

      <MapController route={route} selectedId={selectedId} />
    </MapContainer>
  )
}
