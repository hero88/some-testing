import { ROUTER_URL } from '@constants/router'
import home from '@src/assets/images/svg/sidebar/icon-sidebar1.svg'
import React from 'react'

export default [
  {
    id: 'dashboards',
    title: 'Home',
    icon: <img src={home} alt='Home'/>,
    action: 'manage',
    resource: ROUTER_URL.HOME,
    navLink: ROUTER_URL.HOME
  }
]
