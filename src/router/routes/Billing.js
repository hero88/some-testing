import { lazy } from 'react'
import { ROUTER_URL } from '@constants/router'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

export const BillingRoutes = [
  {
    path: ROUTER_URL.BILLING_OPERATION_UNIT,
    exact: true,
    component: lazy(() => import('../../views/billing/operation-unit')),
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.OPE_CO,
      navLink: ROUTER_URL.BILLING_OPERATION_UNIT
    }
  },
  {
    path: ROUTER_URL.BILLING_OPERATION_UNIT_CREATE,

    exact: true,
    component: lazy(() => import('../../views/billing/operation-unit/create')),
    navbar: require('../../views/billing/operation-unit/create')?.Navbar,

    meta: {
      action: USER_ACTION.CREATE,
      resource: USER_FEATURE.OPE_CO,
      navLink: ROUTER_URL.BILLING_OPERATION_UNIT
    }
  },
  {
    path: ROUTER_URL.BILLING_OPERATION_UNIT_UPDATE,
    component: lazy(() => import('../../views/billing/operation-unit/update')),
    exact: true,
    navbar: require('../../views/billing/operation-unit/update')?.Navbar,
    meta: {
      action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
      resource: USER_FEATURE.OPE_CO,
      navLink: ROUTER_URL.BILLING_OPERATION_UNIT
    }
  },
  {
    path: ROUTER_URL.BILLING_CUSTOMER,
    component: lazy(() => import('../../views/billing/customer')),
    exact: true,
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.CUSTOMER,
      navLink: ROUTER_URL.BILLING_CUSTOMER
    }
  },
  {
    path: ROUTER_URL.BILLING_CUSTOMER_UPDATE,
    component: lazy(() => import('../../views/billing/customer/update')),
    exact: true,
    navbar: require('../../views/billing/customer/update')?.Navbar,
    meta: {
      action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
      resource: USER_FEATURE.CUSTOMER,
      navLink: ROUTER_URL.BILLING_CUSTOMER
    }
  },
  {
    path: ROUTER_URL.BILLING_CUSTOMER_CREATE,
    exact: true,
    navbar: require('../../views/billing/customer/create')?.Navbar,
    component: lazy(() => import('../../views/billing/customer/create')),
    meta: {
      action: USER_ACTION.CREATE,
      resource: USER_FEATURE.CUSTOMER,
      navLink: ROUTER_URL.BILLING_CUSTOMER
    }
  },
  {
    path: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT,
    component: lazy(() => import('../../views/billing/roof-rental-unit/index')),
    exact: true,
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.RENTAL_COMPANY,
      navLink: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT
    }
  },
  {
    path: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT_CREATE,
    component: lazy(() => import('../../views/billing/roof-rental-unit/create')),
    navbar: require('../../views/billing/roof-rental-unit/create')?.Navbar,
    exact: true,
    meta: {
      action: USER_ACTION.CREATE,
      resource: USER_FEATURE.RENTAL_COMPANY,
      navLink: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT
    }
  },
  {
    path: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT_UPDATE,
    component: lazy(() => import('../../views/billing/roof-rental-unit/update')),
    navbar: require('../../views/billing/roof-rental-unit/update')?.Navbar,
    exact: true,
    meta: {
      action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
      resource: USER_FEATURE.RENTAL_COMPANY,
      navLink: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT
    }
  },
  {
    path: ROUTER_URL.BILLING_SETTING,
    component: lazy(() => import('../../views/billing/settings/index')),
    exact: true,
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.CONFIG,
      navLink: ROUTER_URL.BILLING_SETTING
    }
  },
  {
    path: ROUTER_URL.BILLING_SETTING_UPDATE,
    component: lazy(() => import('../../views/billing/settings/update')),
    exact: true,
    meta: {
      action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
      resource: USER_FEATURE.CONFIG,
      navLink: ROUTER_URL.BILLING_SETTING
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT,
    component: lazy(() => import('../../views/billing/project/index')),
    exact: true,
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT_CREATE_ROOF_VENDOR,
    component: lazy(() => import('../../views/billing/contract/RoofRenting/create')),
    navbar: require('../../views/billing/contract/RoofRenting/create')?.Navbar,

    exact: true,
    meta: {
      action: [USER_ACTION.CREATE, USER_ACTION.EDIT],
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT_UPDATE_ROOF_VENDOR,
    component: lazy(() => import('../../views/billing/contract/RoofRenting/update')),
    navbar: require('../../views/billing/contract/RoofRenting/update')?.Navbar,

    exact: true,
    meta: {
      action: [USER_ACTION.CREATE, USER_ACTION.EDIT, USER_ACTION.DETAIL],
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT_CREATE,
    component: lazy(() => import('../../views/billing/project/create')),
    navbar: require('../../views/billing/project/create')?.Navbar,

    exact: true,
    meta: {
      action: USER_ACTION.CREATE,
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT_UPDATE,
    component: lazy(() => import('../../views/billing/project/update')),
    navbar: require('../../views/billing/project/update')?.Navbar,
    exact: true,
    meta: {
      action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT_CREATE_CONTRACT_POWER_SELLING,
    component: lazy(() => import('../../views/billing/contract/PowerSelling/create')),
    navbar: require('../../views/billing/contract/PowerSelling/create')?.Navbar,
    exact: true,
    meta: {
      action: [USER_ACTION.CREATE, USER_ACTION.EDIT],
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  {
    path: ROUTER_URL.BILLING_PROJECT_UPDATE_CONTRACT_POWER_SELLING,
    component: lazy(() => import('../../views/billing/contract/PowerSelling/update')),
    navbar: require('../../views/billing/contract/PowerSelling/update')?.Navbar,

    exact: true,
    meta: {
      action: [USER_ACTION.CREATE, USER_ACTION.EDIT, USER_ACTION.DETAIL],
      resource: USER_FEATURE.PROJECT,
      navLink: ROUTER_URL.BILLING_PROJECT
    }
  },
  // {
  //   path: ROUTER_URL.BILLING_PROJECT_UPDATE_CONTRACT_POWER_SELLING,
  //   component: lazy(() => import('../../views/billing/contract/PowerSelling/update')),
  //   navbar: require('../../views/billing/contract/PowerSelling/update')?.Navbar,
  //   exact: true,
  //   meta: {
  //     action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
  //     resource: ROUTER_URL.BILLING_PROJECT,
  //     navLink: ROUTER_URL.BILLING_PROJECT
  //   }
  // },
  {
    path: ROUTER_URL.BILLING_METRIC_CLOCK,
    component: lazy(() => import('../../views/billing/clock-metric/index')),
    navbar: require('../../views/billing/clock-metric/index')?.Navbar,
    exact: true,
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.METER,
      navLink: ROUTER_URL.BILLING_METRIC_CLOCK
    }
  },
  {
    path: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK,
    component: lazy(() => import('../../views/billing/input-clock-index')),
    exact: true,
    meta: {
      action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
      resource: USER_FEATURE.BILL_PARAMS,
      navLink: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK
    }
  },
  {
    path: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK_CREATE,
    component: lazy(() => import('../../views/billing/input-clock-index/create')),
    navbar: require('../../views/billing/input-clock-index/create')?.Navbar,
    exact: true,
    meta: {
      action: USER_ACTION.CREATE,
      resource: USER_FEATURE.BILL_PARAMS,
      navLink: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK
    }
  },
  {
    path: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK_UPDATE,
    component: lazy(() => import('../../views/billing/input-clock-index/update')),
    navbar: require('../../views/billing/input-clock-index/update')?.Navbar,
    exact: true,
    meta: {
      action: [USER_ACTION.DETAIL, USER_ACTION.EDIT],
      resource: USER_FEATURE.BILL_PARAMS,
      navLink: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK
    }
  }
]
