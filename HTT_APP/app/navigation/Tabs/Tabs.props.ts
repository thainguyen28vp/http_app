export interface History {
  type: string
  key: string
}

export interface Route {
  name: string
  key: string
}

export interface State {
  stale: boolean
  type: string
  key: string
  index: number
  routeNames: string[]
  history: History[]
  routes: Route[]
}

export interface RouteProps {
  key: string
  name: string
  state: State
}
