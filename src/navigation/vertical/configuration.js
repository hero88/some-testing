import { ROUTER_URL } from '@constants/router'
import configuration from '@src/assets/images/svg/sidebar/master-data.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'configuration',
    title: 'Configuration',
    icon: <img src={configuration} alt="configuration" />,
    action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
    resource: USER_FEATURE.CONFIG,
    navLink: ROUTER_URL.BILLING_SETTING
  }
]
