import useRouteStore from '@/lib/hooks/useRouteStore'
import { IMaps } from '@/lib/types/maps'
import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'
import { toast } from 'sonner'
import '../../../../_styles/routing-styles.css'

export default function RoutingMachine({
  waypoints,
  apiRoutes,
  apiPoles,
  setInstructionText
}: {
  waypoints?: L.LatLng[]
  apiRoutes?: { latitude: number; longitude: number }[]
  apiPoles?: { latitude: number; longitude: number }[]
  setInstructionText?: Dispatch<SetStateAction<string>>
}) {
  const map = useMap()
  const routingControlRef = useRef<L.Routing.Control | null>(null)
  const poleMarkersRef = useRef<L.Marker[]>([])

  const { setRoute } = useRouteStore()

  useEffect(() => {
    if (!map) return

    poleMarkersRef.current.map(marker => map.removeLayer(marker))
    poleMarkersRef.current = []

    let finalWaypoints: L.LatLng[] = waypoints || []

    if (finalWaypoints.length < 2 && apiRoutes && apiRoutes.length >= 2) {
      finalWaypoints = apiRoutes.map(route =>
        L.latLng(route.latitude, route.longitude)
      )
    }

    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current)
      } catch (error) {
        console.error('Error removing routing control:', error)
      }
      routingControlRef.current = null
    }

    if (finalWaypoints.length < 2) return

    const routingControl = L.Routing.control({
      waypoints: finalWaypoints,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving'
      }),
      show: true,
      addWaypoints: false,
      routeWhileDragging: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        missingRouteTolerance: 0,
        extendToWaypoints: false,
        styles: [{ color: '#757de8', weight: 6, opacity: 0.75 }]
      },
      altLineOptions: {
        missingRouteTolerance: 0,
        extendToWaypoints: false,
        styles: [{ color: '#aab6ff', weight: 4, opacity: 0.65 }]
      }
    })
      .on('routingstart', () => {
        setInstructionText && setInstructionText('Mencari rute...')
        toast.info('Rute sedang diproses')
      })
      .on('routesfound', e => {
        setInstructionText && setInstructionText('Rute berhasil dibuat.')
        toast.info('Rute berhasil ditemukan')
        const routes = e.routes as IMaps[]
        setRoute(routes[0])
      })
      .on('routesfound routingerror', () => {
        setInstructionText && setInstructionText('Rute gagal dibuat.')
        toast.error('Rute gagal ditemukan')
      })
      .addTo(map)

    routingControlRef.current = routingControl

    if (apiPoles && apiPoles.length > 0) {
      const markers = apiPoles.map(pole =>
        L.marker([pole.latitude, pole.longitude]).addTo(map)
      )
      poleMarkersRef.current = markers
    }

    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current)
          routingControlRef.current = null
        } catch (error) {
          console.error('Error removing routing control:', error)
        }
      }

      poleMarkersRef.current.map(marker => map.removeLayer(marker))
      poleMarkersRef.current = []
    }
  }, [map, waypoints, apiRoutes, apiPoles, setRoute, setInstructionText])

  return null
}
