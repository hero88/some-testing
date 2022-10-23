import { ROUTER_URL } from '@constants/router'
import customer from '@src/assets/images/svg/sidebar/customer.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'customer',
    title: 'Customer',
    icon: <img src={customer} alt='customer'/>,
    action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
    resource: USER_FEATURE.CUSTOMER,
    navLink: ROUTER_URL.BILLING_CUSTOMER
  }
]
