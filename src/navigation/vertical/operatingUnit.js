import { ROUTER_URL } from '@constants/router'
import operatingUnit from '@src/assets/images/svg/sidebar/operating-unit.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'operatingUnit',
    title: 'OperatingCompany',
    icon: <img src={operatingUnit} alt="operating-company" />,
    action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
    resource: USER_FEATURE.OPE_CO,
    navLink: ROUTER_URL.BILLING_OPERATION_UNIT
  }
]
