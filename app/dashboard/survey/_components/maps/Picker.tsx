'use client'

import 'ol/ol.css'
import { fromLonLat, toLonLat } from 'ol/proj'
import { useState } from 'react'
import { RMap, ROSM } from 'rlayers'

export function MapPicker({
  initialPosition,
  onPositionChange
}: {
  initialPosition: { lat: number; lng: number }
  onPositionChange: (pos: { lat: number; lng: number }) => void
}) {
  const initialCoord =
    initialPosition.lat && initialPosition.lng
      ? fromLonLat([initialPosition.lng, initialPosition.lat])
      : fromLonLat([106.8272, -6.1754])
  const [center, setCenter] = useState(initialCoord)

  return (
    <div className="relative h-[400px] w-full">
      <RMap
        initial={{ center, zoom: 17 }}
        className="h-full w-full"
        onMoveEnd={e => {
          const newCenter = e.map.getView().getCenter()
          if (newCenter) {
            setCenter(newCenter)
            const [lng, lat] = toLonLat(newCenter)
            onPositionChange({ lat, lng })
          }
        }}
      >
        <ROSM />
      </RMap>
      {/* Pin overlay tetap di tengah */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="red"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
      </div>
    </div>
  )
}
