import { Marker } from 'react-leaflet'

export default function WaypointMarkers({
  waypoints,
  onRemoveWaypoint
}: {
  waypoints: L.LatLng[]
  onRemoveWaypoint: (index: number) => void
}) {
  return (
    <>
      {waypoints.map((waypoint, index) => (
        <Marker
          key={`waypoint-${index}-${waypoint.lat}-${waypoint.lng}`}
          position={waypoint}
          eventHandlers={{
            click: () => {
              if (
                window.confirm(`Hapus titik ${index === 0 ? 'awal' : 'akhir'}?`)
              ) {
                onRemoveWaypoint(index)
              }
            }
          }}
        />
      ))}
    </>
  )
}
