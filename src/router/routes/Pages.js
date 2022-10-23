import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'

const PagesRoutes = [
  {
    path: ROUTER_URL.ACCOUNT_SETTING,
    component: lazy(() => import('../../views/pages/account-settings')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.ACCOUNT_SETTING
    }
  },
  {
    path: ROUTER_URL.CHANGE_PASSWORD,
    component: lazy(() => import('../../views/pages/change-password')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.CHANGE_PASSWORD
    }
  }
]

export default PagesRoutes
