import { create } from 'zustand'
import { IMaps } from '../types/maps'

type RouteState = {
  route?: IMaps
  setRoute: (route: IMaps) => void
}

const useRouteStore = create<RouteState>(set => ({
  route: {},
  setRoute: route => set({ route })
}))

export default useRouteStore
