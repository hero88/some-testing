import { ROUTER_URL } from '@constants/router'
import role from '@src/assets/images/svg/role.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'permission-group',
    title: 'permission-group',
    icon: <img src={role} alt="rightsGroup" />,
    action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
    resource: USER_FEATURE.GROUP_MANAGER,
    navLink: ROUTER_URL.SYSTEM_PERMISSION_GROUP
  }
]
