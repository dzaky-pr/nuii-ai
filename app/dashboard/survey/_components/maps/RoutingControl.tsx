'use client'

import { createControlComponent } from '@react-leaflet/core'
import L, { ControlOptions } from 'leaflet'

import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface RoutingMachineProps extends ControlOptions {
  waypoints?: L.LatLng[]
}

const createRoutingMachineLayer = (props: RoutingMachineProps) => {
  const instance = L.Routing.control({
    waypoints: props.waypoints,
    lineOptions: {
      missingRouteTolerance: 0,
      extendToWaypoints: false,
      styles: [{ color: '#757de8' }]
    }
  })

  return instance
}

const RoutingControl = createControlComponent(createRoutingMachineLayer)

export default RoutingControl
