import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'
// import BlankLayout from '@src/@core/layouts/BlankLayout'

export const MonitoringRoutes = [
  {
    path: ROUTER_URL.INFORMATION,
    exact: true,
    component: lazy(() => import('../../views/monitoring/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.INFORMATION
    }
  },
  {
    path: ROUTER_URL.PROJECTS,
    exact: true,
    component: lazy(() => import('../../views/monitoring/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.PROJECTS
    }
  },
  {
    path: ROUTER_URL.CONTROL,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project/devices/inverters/index2')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.CONTROL
    }
  },
  {
    path: ROUTER_URL.BOOKING,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project/devices/inverters/BookingCalendar')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.BOOKING
    }
  },
  {
    path: ROUTER_URL.PROJECT_INFO_GENERAL,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.PROJECT_INFO_GENERAL
    }
  },
  {
    path: ROUTER_URL.PROJECT_INFO_COMMERCE,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.PROJECT_INFO_COMMERCE
    }
  },
  {
    path: ROUTER_URL.PROJECT_INFO_IMAGES,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.PROJECT_INFO_IMAGES
    }
  },
  {
    path: ROUTER_URL.PROJECT_INFO_MAP,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.PROJECT_INFO_MAP
    }
  },
  {
    path: `${ROUTER_URL.PROJECT}/:view`,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project')),
    meta: {
      navLink: ROUTER_URL.PROJECT,
      action: 'manage',
      resource: ROUTER_URL.PROJECT
    }
  },
  {
    path: ROUTER_URL.PROJECT,
    exact: true,
    component: lazy(() => import('../../views/monitoring/project')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.PROJECT
    }
  },
  {
    path: ROUTER_URL.MONITORING_DEVICE,
    exact: true,
    component: lazy(() => import('../../views/monitoring/devices')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.MONITORING_DEVICE
    }
  },
  {
    path: ROUTER_URL.MONITORING_EVENTS,
    exact: true,
    component: lazy(() => import('../../views/monitoring/events')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.MONITORING_EVENTS
    }
  }
]
