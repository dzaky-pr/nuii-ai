import L from 'leaflet'
import { Marker } from 'react-leaflet'

export default function WaypointMarkers({
  waypoint,
  waypoints,
  onRemoveWaypoint
}: {
  waypoint?: L.LatLng
  waypoints?: L.LatLng[]
  onRemoveWaypoint?: () => void
}) {
  return (
    <>
      {waypoint ? (
        <Marker
          position={waypoint}
          eventHandlers={{
            click: () => {
              if (onRemoveWaypoint && window.confirm(`Hapus titik awal?`)) {
                onRemoveWaypoint()
              }
            }
          }}
        />
      ) : (
        waypoints &&
        waypoints.map((waypoint, index) => (
          <Marker key={index} position={waypoint} />
        ))
      )}
    </>
  )
}
