import { ROUTER_URL } from '@constants/router'
import monitoring from '@src/assets/images/svg/sidebar/icon-sidebar2.svg'
import React from 'react'

export default [
  {
    id: 'operation',
    title: 'Operation',
    icon: <img src={monitoring} alt='operation'/>,
    children: [
      {
        id: 'projectInformation',
        title: 'Information',
        action: 'manage',
        resource: ROUTER_URL.INFORMATION,
        navLink: ROUTER_URL.INFORMATION
      },
      {
        id: 'monitoring',
        title: 'Monitoring',
        action: 'manage',
        resource: ROUTER_URL.PROJECTS,
        navLink: ROUTER_URL.PROJECTS
      },
      {
        id: 'control',
        title: 'Control',
        action: 'manage',
        resource: ROUTER_URL.CONTROL,
        navLink: ROUTER_URL.CONTROL
      },
      {
        id: 'booking',
        title: 'Booking',
        action: 'manage',
        resource: ROUTER_URL.BOOKING,
        navLink: ROUTER_URL.BOOKING
      },
      {
        id: 'alert',
        title: 'Alert',
        action: 'manage',
        resource: ROUTER_URL.ALERT,
        navLink: ROUTER_URL.ALERT
      },
      {
        id: 'events',
        title: 'Events',
        action: 'manage',
        resource: ROUTER_URL.MONITORING_EVENTS,
        navLink: ROUTER_URL.MONITORING_EVENTS
      }
    ]
  }
]
