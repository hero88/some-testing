import { ROUTER_URL } from '@constants/router'
import project from '@src/assets/images/svg/sidebar/project.svg'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import React from 'react'

export default [
  {
    id: 'projectsManagement',
    title: 'project management',
    icon: <img src={project} alt="project" />,
    children: [
      {
        id: 'projects',
        title: 'project',
        action: [USER_ACTION.VIEW_ALL, USER_ACTION.VIEW],
        resource: USER_FEATURE.PROJECT,
        navLink: ROUTER_URL.BILLING_PROJECT
      }
    ]
  }
]
