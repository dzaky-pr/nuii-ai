import { Marker } from 'react-leaflet'

export default function WaypointMarkers({
  waypoint,
  onRemoveWaypoint,
  isDeleteable = false
}: {
  waypoint: L.LatLng
  isDeleteable?: boolean
  onRemoveWaypoint: () => void
}) {
  return (
    <Marker
      position={waypoint}
      eventHandlers={{
        click: () => {
          if (isDeleteable && window.confirm(`Hapus titik awal?`)) {
            onRemoveWaypoint()
          }
        }
      }}
    />
  )
}
