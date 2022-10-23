import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'

const DashboardRoutes = [
  {
    path: ROUTER_URL.HOME,
    exact: true,
    component: lazy(() => import('../../views/dashboard')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.HOME
    }
  },
  {
    path: ROUTER_URL.MAP,
    exact: true,
    component: lazy(() => import('../../views/dashboard/DashboardMap')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.MAP
    }
  }
]

export default DashboardRoutes
