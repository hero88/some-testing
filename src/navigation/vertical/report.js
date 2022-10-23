import { ROUTER_URL } from '@constants/router'
import report from '@src/assets/images/svg/sidebar/icon-sidebar3.svg'
import React from 'react'

export default [
  {
    id: 'reports',
    title: 'Report',
    icon:<img src={report} alt='report'/>,
    action: 'manage',
    resource: ROUTER_URL.REPORT_PROJECTS_OPERATION,
    navLink: ROUTER_URL.REPORT_PROJECTS_OPERATION
  }
]
