export interface IMaps {
  name?: string
  coordinates?: Coordinate[]
  instructions?: Instruction[]
  summary?: Summary
  waypointIndices?: number[]
  inputWaypoints?: Waypoint[]
  waypoints?: Waypoint[]
  properties?: Properties
  routesIndex?: number
}

export interface Coordinate {
  lat: number
  lng: number
}

export interface Waypoint {
  options: Options
  latLng: Coordinate
  _initHooksCalled: boolean
}

export interface Options {
  allowUTurn: boolean
}

export interface Instruction {
  type: string
  distance: number
  time: number
  road: string
  direction: string
  index: number
  mode: string
  text: string
  modifier?: string
}

export interface Properties {
  isSimplified: boolean
}

export interface Summary {
  totalDistance: number
  totalTime: number
}

export interface IEstimation {
  totalMaterial?: number
  totalPasang?: number
  totalPoles?: number
  totalDistance?: number
  poles?: Pole[]
  routes?: Route[]
}

export interface Pole {
  latitude: number
  longitude: number
  id_konstruksi: number
  id_tiang: number
  panjang_jaringan: number
}

export interface Route {
  latitude: number
  longitude: number
}
