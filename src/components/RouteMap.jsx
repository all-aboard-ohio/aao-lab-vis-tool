import { Fragment, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, ZoomControl, useMap } from 'react-leaflet'
import { BASEMAP, DEFAULT_VIEW } from '../config'
import { createMarkerIcon } from '../lib/markers'

// Pans/zooms the map imperatively in response to which routes are shown and
// which location is selected.
function MapController({ routes, selectedId }) {
  const map = useMap()
  // A stable key so the fit-bounds effect only reruns when the set of visible
  // routes actually changes, not on every render.
  const boundsKey = routes.map((r) => r.id).join(',')

  useEffect(() => {
    const points = routes.flatMap((r) => r.alignment)
    if (points.length) map.fitBounds(points, { padding: [70, 70], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsKey, map])

  // Fly to a location when one is selected.
  useEffect(() => {
    if (!selectedId) return
    const loc = routes.flatMap((r) => r.locations).find((l) => l.id === selectedId)
    if (loc) map.flyTo(loc.coordinates, 15, { duration: 0.8 })
  }, [selectedId, routes, map])

  return null
}

/**
 * The interactive Leaflet map. Renders one or more route alignments and all of
 * their location markers, so the caller can show a single line or every line at
 * once ("All lines" overview).
 */
export default function RouteMap({ routes, selectedId, onSelect }) {
  const markers = useMemo(
    () =>
      routes.flatMap((route) =>
        route.locations.map((loc) => ({
          loc,
          icon: createMarkerIcon(loc.type, { active: loc.id === selectedId }),
        })),
      ),
    [routes, selectedId],
  )

  const initial = routes[0]?.view ?? DEFAULT_VIEW

  return (
    <MapContainer
      center={initial.center}
      zoom={initial.zoom}
      scrollWheelZoom={true}
      // On touch devices, require two fingers so the map doesn't hijack page scroll.
      dragging={true}
      className="h-full w-full"
      zoomControl={false}
      aria-label="Map of proposed passenger rail routes"
    >
      <TileLayer
        url={BASEMAP.url}
        attribution={BASEMAP.attribution}
        maxZoom={BASEMAP.maxZoom}
      />

      <ZoomControl position="bottomright" />

      {routes.map((route) => (
        <Fragment key={route.id}>
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
        </Fragment>
      ))}

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

      <MapController routes={routes} selectedId={selectedId} />
    </MapContainer>
  )
}
