import { useMapEvents } from 'react-leaflet'

export default function MapClickHandler({
  onWaypointAdd
}: {
  onWaypointAdd: (latlng: L.LatLng) => void
}) {
  useMapEvents({
    click: e => {
      onWaypointAdd(e.latlng)
    }
  })

  return null
}
