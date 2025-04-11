'use client'

import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { toast } from 'sonner'

import MapClickHandler from './MapClickHandler'
import RoutingMachine from './RoutingMachine'
import WaypointMarkers from './WaypointMarkers'

import useRouteStore from '@/lib/hooks/useRouteStore'

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const maps = {
  base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

export default function RoutingMap({
  waypoints,
  routingMode,
  setWaypoints,
  setInstructionText,
  setIsSubmitBtnDisabled
}: {
  waypoints: L.LatLng[]
  routingMode: 'select' | 'view' | null
  setWaypoints: Dispatch<SetStateAction<L.LatLng[]>>
  setInstructionText: Dispatch<SetStateAction<string>>
  setIsSubmitBtnDisabled: Dispatch<SetStateAction<boolean>>
}) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -7.245343402100674, 112.73873405427051
  ])
  const [mapZoom, setMapZoom] = useState<number>(13)

  const { route, estimation } = useRouteStore()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          setMapZoom(15)
        },
        error => {
          console.error('Error getting geolocation:', error)
          toast.info(
            'Tidak dapat mengakses lokasi Anda. Menggunakan lokasi default.'
          )
        }
      )
    }
  }, [])

  useEffect(() => {
    if (route && route.summary && route.summary.totalDistance > 3000) {
      setIsSubmitBtnDisabled(true)
      toast.info('Jarak rute tidak boleh lebih dari 3 kilometer!')
    } else {
      setIsSubmitBtnDisabled(false)
    }
  }, [route, setIsSubmitBtnDisabled])

  const handleAddWaypoint = (latlng: L.LatLng) => {
    if (waypoints.length === 0) {
      setWaypoints([latlng])
      setInstructionText('Tap pada peta untuk memilih titik tujuan.')
      toast.info('Titik awal dipilih. Silakan pilih titik tujuan.')
    } else if (waypoints.length === 1) {
      setWaypoints([...waypoints, latlng])
    }
  }

  const handleRemoveWaypoint = () => {
    const newWaypoints = [...waypoints]
    newWaypoints.splice(0, 1)
    setWaypoints(newWaypoints)

    if (newWaypoints.length === 0) {
      setInstructionText('Tap pada peta untuk memilih titik awal')
      toast.info('Titik awal dihapus. Silakan pilih titik awal baru.')
    }
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '650px', width: '100%', padding: 0 }}
    >
      <MapClickHandler onWaypointAdd={handleAddWaypoint} />
      {routingMode === 'select' ? (
        waypoints.length >= 2 ? (
          <RoutingMachine
            setInstructionText={setInstructionText}
            waypoints={waypoints}
          />
        ) : (
          waypoints.length > 0 && (
            <WaypointMarkers
              waypoint={waypoints[0]}
              onRemoveWaypoint={handleRemoveWaypoint}
            />
          )
        )
      ) : (
        routingMode === 'view' && (
          <RoutingMachine
            waypoints={waypoints}
            apiRoutes={estimation?.routes}
            apiPoles={estimation?.poles}
            isViewMode={true}
          />
        )
      )}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url={maps.base}
      />
    </MapContainer>
  )
}
