import { ROUTER_URL } from '@constants/router'
import { lazy } from 'react'

const SwaggerRoutes = [
  {
    path: ROUTER_URL.SWAGGER,
    exact: true,
    component: lazy(() => import('../../views/swagger')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SWAGGER
    }
  }
]

export default SwaggerRoutes
