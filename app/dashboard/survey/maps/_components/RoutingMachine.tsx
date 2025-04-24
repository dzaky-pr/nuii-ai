import useRouteStore from '@/lib/hooks/useRouteStore'
import { IMaps, Pole, Route } from '@/lib/types/maps'
import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react'
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
  isViewMode = false,
  setInstructionText
}: {
  waypoints?: L.LatLng[]
  apiRoutes?: Route[]
  apiPoles?: Pole[]
  isViewMode?: boolean
  setInstructionText?: Dispatch<SetStateAction<string>>
}) {
  const map = useMap()
  const routingControlRef = useRef<L.Routing.Control | null>(null)
  const poleMarkersRef = useRef<L.Marker[]>([])

  const { setRoute } = useRouteStore()

  const finalWaypoints = useMemo(() => {
    if (isViewMode && apiRoutes && apiRoutes.length >= 2) {
      const firstPoint = apiRoutes[0]
      const lastPoint = apiRoutes[apiRoutes.length - 1]
      return [
        L.latLng(firstPoint.latitude, firstPoint.longitude),
        L.latLng(lastPoint.latitude, lastPoint.longitude)
      ]
    } else if (waypoints && waypoints.length >= 2) {
      return waypoints
    } else if (apiRoutes && apiRoutes.length >= 2) {
      return apiRoutes.map(route => L.latLng(route.latitude, route.longitude))
    }
    return []
  }, [waypoints, apiRoutes, isViewMode])

  useEffect(() => {
    if (!map) return
    if (finalWaypoints.length < 2) return

    poleMarkersRef.current.map(marker => map.removeLayer(marker))
    poleMarkersRef.current = []

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
      .on('routesfound', e => {
        setInstructionText && setInstructionText('Rute berhasil dibuat.')
        toast.info('Rute berhasil ditemukan')
        const routes = e.routes as IMaps[]
        setRoute(routes[0])
      })
      .on('routingerror', () => {
        setInstructionText && setInstructionText('Rute gagal dibuat.')
        toast.error('Rute gagal ditemukan')
      })
      .addTo(map)

    routingControlRef.current = routingControl

    if (apiPoles && apiPoles.length > 0) {
      const markers: L.Marker[] = apiPoles.slice(1, -1).map(pole => {
        const marker = L.marker([pole.latitude, pole.longitude])

        const popupContent = `
          <div class="w-fit">
            <h4 class="text-lg font-bold">Detail Tiang</h4>
            <div class="mt-2">
              <p><strong>Konstruksi:</strong> ${pole.nama_konstruksi}</p>
              <p><strong>Tiang:</strong> ${pole.nama_tiang}</p>
              <p><strong>Panjang Jaringan:</strong> ${pole.panjang_jaringan}m</p>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)
        marker.addTo(map)
        return marker
      })

      setInstructionText && setInstructionText('Rute berhasil dibuat.')

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
  }, [
    map,
    waypoints,
    apiRoutes,
    apiPoles,
    setRoute,
    setInstructionText,
    finalWaypoints
  ])

  return null
}
