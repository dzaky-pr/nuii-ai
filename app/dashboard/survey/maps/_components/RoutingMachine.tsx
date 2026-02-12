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
  const isActiveRef = useRef(false)

  const { setRoute } = useRouteStore()

  const safeguardRoutingControl = (control: L.Routing.Control) => {
    const controlAny = control as unknown as {
      _clearLines?: () => void
      _clearAltLines?: () => void
      _map?: L.Map | null
    }

    const originalClearLines = controlAny._clearLines?.bind(control)
    if (originalClearLines) {
      controlAny._clearLines = () => {
        if (!controlAny._map) return
        originalClearLines()
      }
    }

    const originalClearAltLines = controlAny._clearAltLines?.bind(control)
    if (originalClearAltLines) {
      controlAny._clearAltLines = () => {
        if (!controlAny._map) return
        originalClearAltLines()
      }
    }
  }

  const finalWaypoints = useMemo(() => {
    if (isViewMode && apiRoutes && apiRoutes.length >= 2) {
      const firstPoint = apiRoutes[0]
      const lastPoint = apiRoutes[apiRoutes.length - 1]
      return [
        L.latLng(firstPoint.latitude, firstPoint.longitude),
        L.latLng(lastPoint.latitude, lastPoint.longitude)
      ]
    } else if (waypoints && waypoints.length >= 2) {
      // Filter out duplicate waypoints to prevent React key warnings
      const uniqueWaypoints = waypoints.filter(
        (waypoint, index, self) =>
          index ===
          self.findIndex(w => w.lat === waypoint.lat && w.lng === waypoint.lng)
      )
      return uniqueWaypoints
    } else if (apiRoutes && apiRoutes.length >= 2) {
      return apiRoutes.map(route => L.latLng(route.latitude, route.longitude))
    }
    return []
  }, [waypoints, apiRoutes, isViewMode])

  useEffect(() => {
    if (!map) return
    isActiveRef.current = true
    if (finalWaypoints.length < 2) return

    poleMarkersRef.current.forEach(marker => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    })
    poleMarkersRef.current = []

    if (routingControlRef.current) {
      const existingControl = routingControlRef.current
      // mark inactive first to short-circuit any guarded callbacks
      isActiveRef.current = false
      try {
        map.removeControl(existingControl)
      } catch (error) {
        console.error('Error removing routing control:', error)
      }
      routingControlRef.current = null
    }

    if (finalWaypoints.length < 2) return

    const baseRouter = L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      profile: 'driving'
    })

    const guardedRouter: L.Routing.IRouter = {
      route: (waypoints: any, callback: any, context: any, options: any) => {
        if (!isActiveRef.current) return
        return baseRouter.route(
          waypoints,
          (...args: any[]) => {
            if (!isActiveRef.current) return
            callback?.apply(context, args)
          },
          context,
          options
        )
      }
    }

    // Store original console.error to restore later
    const originalError = console.error

    // Temporarily override console.error to suppress routing and React warnings
    console.error = (...args: any[]) => {
      // Filter out routing-related errors and React warnings
      const firstArg = args[0]
      const message = typeof firstArg === 'string' ? firstArg : ''

      const isRoutingError =
        message.includes('Routing error') ||
        (typeof firstArg === 'object' && firstArg?.message?.includes('Routing'))

      const isKeyWarning = message.includes(
        'Encountered two children with the same key'
      )

      const isObjectAsChildError = message.includes(
        'Objects are not valid as a React child'
      )

      if (isRoutingError || isKeyWarning || isObjectAsChildError) {
        // Silently ignore these errors
        return
      }

      // Pass through all other errors to original handler
      return originalError.call(console, ...args)
    }

    const routingControl = L.Routing.control({
      waypoints: finalWaypoints,
      router: guardedRouter,
      show: !isViewMode,
      addWaypoints: false,
      routeWhileDragging: !isViewMode,
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

    // Override default error handler to prevent errors
    const controlAny = routingControl as any
    controlAny.defaultErrorHandler = function () {
      // Suppress all routing errors
    }

    safeguardRoutingControl(routingControl)

    // Track route status to prevent duplicate notifications
    let routeFound = false
    let toastId: string | number | undefined
    let toastShown = false // Prevent duplicate toasts

    // Show loading toast when routing starts (only in select mode)
    if (!isViewMode && waypoints && waypoints.length >= 2) {
      toastId = toast.loading('Mencari rute terbaik...')
    }

    routingControl
      .on('routesfound', e => {
        routeFound = true
        setInstructionText && setInstructionText('Rute berhasil dibuat.')

        // Prevent duplicate toasts
        if (toastShown) return
        toastShown = true

        // Dismiss loading toast when route is found (route visual is enough feedback)
        if (toastId) {
          toast.dismiss(toastId)
        }

        const routes = e.routes as IMaps[]
        setRoute(routes[0])
      })
      .on('routingerror', (err: any) => {
        // Only show error if route wasn't found (prevents duplicate notifications)
        if (!routeFound && !toastShown) {
          toastShown = true
          setInstructionText && setInstructionText('Rute gagal dibuat.')

          // Update loading toast to error
          if (toastId) {
            toast.error('Rute gagal ditemukan. Silakan coba lagi.', {
              id: toastId
            })
          }
        }
      })
      .addTo(map)

    // Restore original console.error after a short delay
    setTimeout(() => {
      console.error = originalError
    }, 1000)

    routingControlRef.current = routingControl

    if (apiPoles && apiPoles.length > 0) {
      const markers: L.Marker[] = apiPoles.map((pole, index) => {
        const marker = L.marker([pole.latitude, pole.longitude])

        const popupContent = `
          <div class="w-fit">
            <h4 class="text-lg font-bold">Detail Tiang ${index + 1}</h4>
            <div class="mt-2">
              <p><strong>Konstruksi:</strong> ${pole.nama_konstruksi}</p>
              <p><strong>Tiang:</strong> ${pole.nama_tiang}</p>
              <p><strong>Panjang Jaringan:</strong> ${
                pole.panjang_jaringan
              }m</p>
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
      // prevent any in-flight callbacks from operating on removed control
      isActiveRef.current = false
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current)
          routingControlRef.current = null
        } catch (error) {
          console.error('Error removing routing control:', error)
        }
      }
      poleMarkersRef.current.forEach(marker => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      })
      poleMarkersRef.current = []
    }
  }, [
    isViewMode,
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
