import useRouteStore from '@/lib/hooks/useRouteStore'
import L from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

import { IMaps } from '@/lib/types/maps'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'
import './routing-styles.css'

export default function RoutingMachine({
  waypoints,
  setLoading
}: {
  waypoints: L.LatLng[]
  setLoading: Dispatch<SetStateAction<boolean>>
}) {
  const map = useMap()
  const routingControlRef = useRef<L.Routing.Control | null>(null)

  const { setRoute } = useRouteStore()

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return

    setRoute({})

    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current)
      } catch (error) {
        console.error('Error removing routing control:', error)
      }
      routingControlRef.current = null
    }

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
      .on('routingstart', () => setLoading(true))
      .on('routesfound', e => {
        setLoading(false)
        const routes = e.routes as IMaps[]
        setRoute(routes[0])
      })
      .addTo(map)

    routingControlRef.current = routingControl

    const mapClickHandler = (e: any) => {
      const container = document.createElement('div')

      const startBtn = document.createElement('button')
      startBtn.innerHTML = 'Mulai dari titik ini'
      startBtn.className = 'leaflet-routing-btn'
      L.DomEvent.on(startBtn, 'click', function () {
        routingControl.spliceWaypoints(0, 1, e.latlng)
        map.closePopup()
      })
      container.appendChild(startBtn)

      const destBtn = document.createElement('button')
      destBtn.innerHTML = 'Akhiri pada titik ini'
      destBtn.className = 'leaflet-routing-btn'
      L.DomEvent.on(destBtn, 'click', function () {
        routingControl.spliceWaypoints(
          routingControl.getWaypoints().length - 1,
          1,
          e.latlng
        )
        map.closePopup()
      })
      container.appendChild(destBtn)

      L.popup().setContent(container).setLatLng(e.latlng).openOn(map)
    }

    map.on('click', mapClickHandler)

    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current)
          routingControlRef.current = null
        } catch (error) {
          console.error('Error removing routing control:', error)
        }
      }
      map.off('click', mapClickHandler)
    }
  }, [map, waypoints, setRoute, setLoading])

  return null
}
