'use client'

import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import MapClickHandler from './MapClickHandler'
import RoutingMachine from './RoutingMachine'
import WaypointMarkers from './WaypointMarkers'

import useRouteStore from '@/lib/hooks/useRouteStore'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import { useEstimationMutation } from '../_hooks/useEstimationMutation'

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

export default function RoutingMap() {
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([])
  const [instructionText, setInstructionText] = useState<string>(
    'Tap pada peta untuk memilih titik awal.'
  )
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState<boolean>(false)

  const { route, setRoute, estimation, setEstimation } = useRouteStore()

  const { mutate, isPending } = useEstimationMutation()

  const routingMode = getCookie('routing-mode') as 'select' | 'view' | null

  useEffect(() => {
    setCookie('routing-mode', 'select')
  }, [])

  useEffect(() => {
    if (route && route.summary && route.summary.totalDistance > 3000) {
      setIsSubmitBtnDisabled(true)
      toast.info('Jarak rute tidak boleh lebih dari 3 kilometer!')
    } else {
      setIsSubmitBtnDisabled(false)
    }
  }, [route])

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

  const handleReset = () => {
    if (routingMode === 'select') {
      setWaypoints([])
      setRoute({})
    } else if (routingMode === 'view') {
      setCookie('routing-mode', 'select')
      setWaypoints([])
      setRoute({})
      setEstimation({})
    }
    setInstructionText('Tap pada peta untuk memilih titik awal.')
    toast.info('Rute direset. Silakan pilih titik awal baru.')
  }

  return (
    <div className="flex flex-col gap-4 w-full text-center">
      <p className="font-medium text-neutral-100">{instructionText}</p>
      <MapContainer
        center={[-7.245343402100674, 112.73873405427051]}
        zoom={13}
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
            />
          )
        )}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={maps.base}
        />
      </MapContainer>
      <div className="flex gap-4 self-end">
        <Button
          size="sm"
          onClick={handleReset}
          className="bg-red-500 text-white hover:bg-red-600 w-fit self-center"
          disabled={waypoints.length < 1}
        >
          Reset
        </Button>
        {routingMode === 'select' && (
          <Button
            size="sm"
            className="bg-green-500 text-white hover:bg-green-600 w-fit self-center"
            disabled={waypoints.length < 2 || isSubmitBtnDisabled || isPending}
            onClick={() => route && mutate(route)}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}
