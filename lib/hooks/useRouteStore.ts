import { create } from 'zustand'
import { IEstimation, IMaps } from '../types/maps'

type RouteState = {
  route?: IMaps
  estimation?: IEstimation
  setRoute: (route: IMaps) => void
  setEstimation: (estimation: IEstimation) => void
}

const useRouteStore = create<RouteState>(set => ({
  route: {},
  estimation: {},
  setRoute: route => set({ route }),
  setEstimation: estimation => set({ estimation })
}))

export default useRouteStore
