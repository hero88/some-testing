import { ROUTER_URL } from '@constants/router'
import electric from '@src/assets/images/svg/sidebar/icon-electric.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'electricity-index',
    title: 'electricity-index',
    icon: <img src={electric} alt="electric" />,
    children: [
      {
        id: 'clock-index',
        title: 'clock-index',
        action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
        resource: USER_FEATURE.METER,
        navLink: ROUTER_URL.BILLING_METRIC_CLOCK
      },
      {
        id: 'manual-input-index',
        title: 'manual-input-index',
        action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
        resource: USER_FEATURE.BILL_PARAMS,
        navLink: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK
      }
    ]
  }
]
