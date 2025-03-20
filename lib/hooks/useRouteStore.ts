import { create } from 'zustand'

type RouteState = {
  route: any
  setRoute: (route: any) => void
}

const useRouteStore = create<RouteState>(set => ({
  route: {},
  setRoute: route => set({ route })
}))

export default useRouteStore
