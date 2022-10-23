import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'

export const ReportRoutes = [
  {
    path: ROUTER_URL.REPORT_PROJECTS_OPERATION,
    exact: true,
    component: lazy(() => import('../../views/report/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_PROJECTS_OPERATION
    }
  },
  {
    path: ROUTER_URL.REPORT_PROJECTS_YIELD,
    exact: true,
    component: lazy(() => import('../../views/report/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_PROJECTS_YIELD
    }
  },
  {
    path: ROUTER_URL.REPORT_PROJECTS_GENERAL,
    exact: true,
    component: lazy(() => import('../../views/report/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_PROJECTS_GENERAL
    }
  },
  {
    path: ROUTER_URL.REPORT_PROJECTS_STATISTIC,
    exact: true,
    component: lazy(() => import('../../views/report/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_PROJECTS_STATISTIC
    }
  },
  {
    path: ROUTER_URL.REPORT_PROJECTS_DEVICES,
    exact: true,
    component: lazy(() => import('../../views/report/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_PROJECTS_DEVICES
    }
  },
  {
    path: ROUTER_URL.REPORT_PROJECTS_USER_ACTIVITIES,
    exact: true,
    component: lazy(() => import('../../views/report/projects')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_PROJECTS_USER_ACTIVITIES
    }
  },
  {
    path: ROUTER_URL.REPORT_STATISTICS,
    exact: true,
    component: lazy(() => import('../../views/report/statistics')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_STATISTICS
    }
  },
  {
    path: ROUTER_URL.REPORT_EXPORT,
    exact: true,
    component: lazy(() => import('../../views/report/export')),
    meta: {
      action: 'manage',
      resource: ROUTER_URL.REPORT_EXPORT
    }
  }
]
