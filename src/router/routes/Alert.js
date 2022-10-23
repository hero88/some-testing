import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'

export const AlertRoutes = [
  {
    path: ROUTER_URL.ALERT,
    exact: true,
    component: lazy(() => import('../../views/alert')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.ALERT
    }
  }
]
