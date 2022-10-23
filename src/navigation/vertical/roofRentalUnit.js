import { ROUTER_URL } from '@constants/router'
import roof from '@src/assets/images/svg/sidebar/roof.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'roofRentalCompany',
    title: 'Roof Rental Company',
    icon: <img src={roof} alt="Roof Rental Company" />,
    action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
    resource: USER_FEATURE.RENTAL_COMPANY,
    navLink: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT
  }
]
