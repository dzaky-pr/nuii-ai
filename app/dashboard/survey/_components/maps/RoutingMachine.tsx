import useRouteStore from '@/lib/hooks/useRouteStore'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

export default function RoutingMachine({
  waypoints
}: {
  waypoints: L.LatLng[]
}) {
  const map = useMap()
  const routingControlRef = useRef<L.Routing.Control | null>(null)

  const { setRoute } = useRouteStore()

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return

    setRoute({})

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving'
      }),
      show: true,
      addWaypoints: false,
      routeWhileDragging: true,
      fitSelectedRoutes: true,
      showAlternatives: true,
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

    routingControl.addTo(map)

    routingControlRef.current = routingControl

    routingControl.on('routesfound', e => {
      const routes = e.routes
      console.log('Routes found:', routes[0])
      setRoute(routes[0])
    })

    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current)
        } catch (error) {
          console.error('Error removing routing control:', error)
        }
      }
    }
  }, [map, waypoints, setRoute])

  return null
}
