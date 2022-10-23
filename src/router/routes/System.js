import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

export const SystemRoutes = [
  {
    path: ROUTER_URL.SYSTEM_PERMISSION_GROUP,
    exact: true,
    component: lazy(() => import('../../views/system/permission-group/index')),
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.GROUP_MANAGER,
      navLink: ROUTER_URL.SYSTEM_PERMISSION_GROUP
    }
  },
  {
    path: ROUTER_URL.SYSTEM_PERMISSION_GROUP_UPDATE,
    exact: true,
    navbar: require('../../views/system/permission-group/update')?.Navbar,
    component: lazy(() => import('../../views/system/permission-group/update')),
    meta: {
      action: USER_ACTION.EDIT,
      resource: USER_FEATURE.GROUP_MANAGER,
      navLink: ROUTER_URL.SYSTEM_PERMISSION_GROUP
    }
  },
  {
    path: ROUTER_URL.SYSTEM_DECENTRALIZATION,
    exact: true,
    component: lazy(() => import('../../views/system/user-role/index')),
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.ROLE_ASSIGNMENT,
      navLink: ROUTER_URL.SYSTEM_DECENTRALIZATION
    }
  }
]
