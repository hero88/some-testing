import { ROUTER_URL } from '@constants/router'
import setting from '@src/assets/images/svg/sidebar/icon-sidebar4.svg'
import React from 'react'


export default [
  {
    id: 'settings',
    title: 'Settings',
    icon:  <img src={setting} alt='Setting'/>,
    children: [
      {
        id: 'generalSettings',
        title: 'General settings',
        action: 'manage',
        resource: ROUTER_URL.SETTINGS_GENERAL,
        navLink: ROUTER_URL.SETTINGS_GENERAL
      },
      {
        id: 'configuration',
        title: 'Configuration',
        action: 'manage',
        resource: ROUTER_URL.SETTINGS_CONFIGURATIONS,
        navLink: ROUTER_URL.SETTINGS_CONFIGURATIONS
      },
      {
        id: 'settingSystemAlert',
        title: 'System Alert',
        action: 'manage',
        resource: ROUTER_URL.SETTINGS_SYSTEM_ALERT,
        navLink: ROUTER_URL.SETTINGS_SYSTEM_ALERT
      },
      {
        id: 'projectSettings',
        title: 'Projects',
        level: 2,
        children: [
          {
            id: 'projectGeneral',
            title: 'List',
            action: 'manage',
            resource: ROUTER_URL.SETTINGS_PROJECTS,
            navLink: ROUTER_URL.SETTINGS_PROJECTS
          },
          {
            id: 'projectRequest',
            title: 'Request',
            badge: 'light-danger',
            badgeText: '0',
            action: 'manage',
            resource: ROUTER_URL.SETTINGS_PROJECTS_REQUEST,
            navLink: ROUTER_URL.SETTINGS_PROJECTS_REQUEST
          }
        ]
      },
      {
        id: 'userSettings',
        title: 'Users',
        action: 'manage',
        resource: ROUTER_URL.SETTINGS_USERS,
        navLink: ROUTER_URL.SETTINGS_USERS
      },
      {
        id: 'customerSettings',
        title: 'Customers',
        action: 'manage',
        resource: ROUTER_URL.SETTINGS_CUSTOMERS,
        navLink: ROUTER_URL.SETTINGS_CUSTOMERS
      },
      {
        id: 'deviceTypes',
        title: 'Device types',
        action: 'manage',
        resource: ROUTER_URL.SETTINGS_DEVICE_TYPES,
        navLink: ROUTER_URL.SETTINGS_DEVICE_TYPES
      }
    ]
  }
]
