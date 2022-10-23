import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'

const SettingsRoutes = [
  {
    path: ROUTER_URL.SETTINGS_GENERAL,
    exact: true,
    component: lazy(() => import('../../views/settings/general')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_GENERAL
    }
  },
  {
    path: ROUTER_URL.SETTINGS_CONFIGURATIONS,
    exact: true,
    component: lazy(() => import('../../views/settings/configuration')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_CONFIGURATIONS
    }
  },
  {
    path: ROUTER_URL.SETTINGS_SYSTEM_ALERT,
    exact: true,
    component: lazy(() => import('../../views/settings/system-alert')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_SYSTEM_ALERT
    }
  },
  {
    path: ROUTER_URL.SETTINGS_PROJECTS,
    exact: true,
    component: lazy(() => import('../../views/settings/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_PROJECTS
    }
  },
  {
    path: ROUTER_URL.SETTINGS_PROJECTS_REQUEST,
    exact: true,
    component: lazy(() => import('../../views/settings/projects/request')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_PROJECTS_REQUEST
    }
  },
  {
    path: ROUTER_URL.SETTINGS_USERS,
    exact: true,
    component: lazy(() => import('../../views/settings/users')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_USERS
    }
  },
  {
    path: ROUTER_URL.SETTINGS_USERS_ACTIVITIES,
    exact: true,
    component: lazy(() => import('../../views/settings/users/activities')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_USERS_ACTIVITIES
    }
  },
  {
    path: ROUTER_URL.SETTINGS_CUSTOMERS,
    exact: true,
    component: lazy(() => import('../../views/settings/customers')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_CUSTOMERS
    }
  },
  {
    path: ROUTER_URL.SETTINGS_DEVICE_TYPES,
    exact: true,
    component: lazy(() => import('../../views/settings/device-types')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.SETTINGS_DEVICE_TYPES
    }
  }
]

export default SettingsRoutes
