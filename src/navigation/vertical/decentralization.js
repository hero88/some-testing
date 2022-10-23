import { ROUTER_URL } from '@constants/router'
import permision from '@src/assets/images/svg/permision.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'user-role',
    title: 'user-role',
    icon: <img src={permision} alt="rightsGroup" />,
    action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
    resource: USER_FEATURE.ROLE_ASSIGNMENT,
    navLink: ROUTER_URL.SYSTEM_DECENTRALIZATION
  }
]
