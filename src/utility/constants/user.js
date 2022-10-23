export const LOGIN_TYPE = {
  NORMAL: 1,
  GOOGLE: 2
}

export const USER_ROLE = {
  SITE_PORTAL_ADMIN: {
    VALUE: 'SITE_PORTAL_ADMIN',
    LABEL: 'Site portal - Admin'
  },
  SITE_PORTAL_USER: {
    VALUE: 'SITE_PORTAL_USER',
    LABEL: 'Site portal - User'
  },
  ADMIN_PORTAL_ADMIN: {
    VALUE: 'ADMIN_PORTAL_ADMIN',
    LABEL: 'Admin portal - Admin'
  },
  ADMIN_PORTAL_USER: {
    VALUE: 'ADMIN_PORTAL_USER',
    LABEL: 'Admin portal - User'
  },
  SUPER_ADMIN: {
    VALUE: 'SUPER_ADMIN',
    LABEL: 'Super admin'
  }
}

export const USER_ABILITY = {
  MANAGE_PROJECT: 'Manage project',
  MANAGE_USER: 'Manage user',
  MANAGE_CUSTOMER: 'Manage customer',
  MANAGE_INVERTER: 'Manage inverter',
  MANAGE_DEVICE: 'Manage device',
  EDIT_ADMIN_PORTAL_ADMIN: 'Edit Admin portal - Admin',
  EDIT_ANOTHER_USER: 'Edit another user',
  NO_NEED_CONFIRM: 'No need confirm',
  NEED_TO_CONFIRM: 'Need to confirm',
  AUTO_CREATE_PROJECT: 'Auto create project',
  CAN_VIEW_INACTIVE_PROJECT: 'Can view inactive project',
  CAN_UPDATE_ALERT_STATUS: 'Can update alert status',
  CAN_UPDATE_CONFIGURATION_SETTING: 'Can update configuration setting',
  CAN_UPDATE_SYSTEM_ALERT_SETTING: 'Can update system alert setting',
  CAN_UPDATE_SEND_EMAIL_TO_MANAGERS_SETTING: 'Can update send email to managers',
  CAN_VIEW_USER_ACTIVITIES_REPORT: 'Can view user activities report',
  CAN_DELETE: 'Can delete forever',
  MANAGE_ZERO_EXPORT: 'Turn on/off zero export' //New ability here
}

export const COMPANY = {
  GOOGLE: { LABEL: 'Google', VALUE: 1 },
  FACEBOOK: { LABEL: 'Facebook', VALUE: 2 },
  MICROSOFT: { LABEL: 'Microsoft', VALUE: 3 }
}

export const getLabel = (object, value) => {
  const objectKeys = Object.keys(object)
  const name = objectKeys.find((item) => {
    return object[item].VALUE === Number(value)
  })

  return name ? object[name].LABEL : ''
}
