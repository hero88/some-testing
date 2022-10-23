import useJwt from '@src/@core/auth/jwt/useJwt'
import { USER_ABILITY, USER_ROLE } from '@constants/user'
import { ROUTER_URL } from '@constants/router'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  return localStorage.getItem('userData') && localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
}

export const getUserData = () => (
  localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null
)

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return { name: 'access-control' }
  return { name: 'auth-login' }
}

export const getUserRoleLabel = (userRole) => {
  switch (userRole) {
    case USER_ROLE.SITE_PORTAL_ADMIN.VALUE:
      return USER_ROLE.SITE_PORTAL_ADMIN.LABEL

    case USER_ROLE.SITE_PORTAL_USER.VALUE:
      return USER_ROLE.SITE_PORTAL_USER.LABEL

    case USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE:
      return USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL

    case USER_ROLE.ADMIN_PORTAL_USER.VALUE:
      return USER_ROLE.ADMIN_PORTAL_USER.LABEL

    case USER_ROLE.SUPER_ADMIN.VALUE:
      return USER_ROLE.SUPER_ADMIN.LABEL

    default:
      return 'User'
  }
}
/*
 * user 1 => admin portal => 10 roles
 * */
export const getUserAbility = (userRole) => {
  switch (userRole) {
    case USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE: {
      return [
        { action: 'manage', subject: ROUTER_URL.HOME },
        { action: 'manage', subject: ROUTER_URL.MAP },
        { action: 'manage', subject: ROUTER_URL.INFORMATION },
        { action: 'manage', subject: ROUTER_URL.PROJECTS },
        { action: 'manage', subject: ROUTER_URL.PROJECT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_OVERVIEW },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SINGLE_LINE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALARM },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CONTROL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_GENERAL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_COMMERCE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_IMAGES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_MAP },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CHART },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SETTING },
        { action: 'manage', subject: ROUTER_URL.PROJECT_DEVICES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALERT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_MAINTENANCE },
        { action: 'manage', subject: ROUTER_URL.MONITORING_DEVICE },
        { action: 'manage', subject: ROUTER_URL.MONITORING_EVENTS },
        { action: 'manage', subject: ROUTER_URL.ALERT },
        { action: 'manage', subject: ROUTER_URL.ALERT_ACTIVE },
        { action: 'manage', subject: ROUTER_URL.ALERT_HISTORY },
        { action: 'manage', subject: ROUTER_URL.REPORT_EXPORT },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_OPERATION },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_YIELD },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_STATISTIC },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_DEVICES },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_USER_ACTIVITIES },
        { action: 'manage', subject: ROUTER_URL.REPORT_STATISTICS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_CONFIGURATIONS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_SYSTEM_ALERT },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_PROJECTS_REQUEST },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_USERS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_USERS_ACTIVITIES },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_CUSTOMERS },
        { action: 'manage', subject: ROUTER_URL.ACCOUNT_SETTING },
        { action: 'manage', subject: ROUTER_URL.CHANGE_PASSWORD },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_DEVICE_TYPES },
        { action: 'manage', subject: USER_ABILITY.MANAGE_CUSTOMER },
        { action: 'manage', subject: USER_ABILITY.MANAGE_INVERTER },
        { action: 'manage', subject: USER_ABILITY.MANAGE_USER },
        { action: 'manage', subject: USER_ABILITY.MANAGE_PROJECT },
        { action: 'manage', subject: USER_ABILITY.MANAGE_DEVICE },
        { action: 'edit', subject: USER_ABILITY.EDIT_ANOTHER_USER },
        { action: 'manage', subject: USER_ABILITY.AUTO_CREATE_PROJECT },
        { action: 'manage', subject: USER_ABILITY.NO_NEED_CONFIRM },
        { action: 'manage', subject: USER_ABILITY.CAN_VIEW_INACTIVE_PROJECT },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_ALERT_STATUS },
        { action: 'manage', subject: ROUTER_URL.SWAGGER },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_SEND_EMAIL_TO_MANAGERS_SETTING },
        { action: 'manage', subject: USER_ABILITY.CAN_VIEW_USER_ACTIVITIES_REPORT },
        { action: 'manage', subject: ROUTER_URL.BILLING_OPERATION_UNIT },
        { action: 'manage', subject: ROUTER_URL.BILLING_CUSTOMER },
        { action: 'manage', subject: ROUTER_URL.BILLING_ROOF_RENTAL_UNIT },
        { action: 'manage', subject: ROUTER_URL.BILLING_SETTING },
        { action: 'manage', subject: ROUTER_URL.BILLING_PROJECT },
        { action: 'manage', subject: ROUTER_URL.BILLING_PROJECT_CREATE_ROOF_VENDOR },
        { action: 'manage', subject: ROUTER_URL.BILLING_PROJECT_UPDATE_ROOF_VENDOR },
        { action: 'manage', subject: ROUTER_URL.BILLING_METRIC_CLOCK },
        { action: 'manage', subject: ROUTER_URL.BILLING_MANUAL_INPUT_METRIC_CLOCK },
        { action: 'manage', subject: ROUTER_URL.SYSTEM_PERMISSION_GROUP },
        { action: 'manage', subject: ROUTER_URL.SYSTEM_PERMISSION_GROUP_UPDATE },
        { action: 'manage', subject: ROUTER_URL.SYSTEM_DECENTRALIZATION },
        { action: 'manage', subject: USER_ABILITY.CAN_VIEW_USER_ACTIVITIES_REPORT }
      ]
    }

    case USER_ROLE.ADMIN_PORTAL_USER.VALUE: {
      return [
        { action: 'manage', subject: ROUTER_URL.HOME },
        { action: 'manage', subject: ROUTER_URL.MAP },
        { action: 'manage', subject: ROUTER_URL.INFORMATION },
        { action: 'manage', subject: ROUTER_URL.PROJECTS },
        { action: 'manage', subject: ROUTER_URL.PROJECT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_OVERVIEW },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SINGLE_LINE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALARM },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CONTROL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_GENERAL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_COMMERCE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_IMAGES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_MAP },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CHART },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SETTING },
        { action: 'manage', subject: ROUTER_URL.PROJECT_DEVICES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALERT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_MAINTENANCE },
        { action: 'manage', subject: ROUTER_URL.MONITORING_DEVICE },
        { action: 'manage', subject: ROUTER_URL.ALERT },
        { action: 'manage', subject: ROUTER_URL.ALERT_ACTIVE },
        { action: 'manage', subject: ROUTER_URL.ALERT_HISTORY },
        { action: 'manage', subject: ROUTER_URL.REPORT_EXPORT },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_OPERATION },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_YIELD },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_STATISTIC },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_DEVICES },
        { action: 'manage', subject: ROUTER_URL.REPORT_STATISTICS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_CONFIGURATIONS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_SYSTEM_ALERT },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_USERS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_CUSTOMERS },
        { action: 'manage', subject: ROUTER_URL.ACCOUNT_SETTING },
        { action: 'manage', subject: ROUTER_URL.CHANGE_PASSWORD },
        { action: 'manage', subject: USER_ABILITY.CAN_VIEW_INACTIVE_PROJECT },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_ALERT_STATUS }
      ]
    }

    case USER_ROLE.SITE_PORTAL_ADMIN.VALUE: {
      return [
        { action: 'manage', subject: ROUTER_URL.HOME },
        { action: 'manage', subject: ROUTER_URL.MAP },
        { action: 'manage', subject: ROUTER_URL.INFORMATION },
        { action: 'manage', subject: ROUTER_URL.PROJECTS },
        { action: 'manage', subject: ROUTER_URL.PROJECT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_OVERVIEW },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SINGLE_LINE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALARM },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CONTROL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_GENERAL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_COMMERCE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_IMAGES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_MAP },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CHART },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SETTING },
        { action: 'manage', subject: ROUTER_URL.PROJECT_DEVICES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALERT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_MAINTENANCE },
        { action: 'manage', subject: ROUTER_URL.MONITORING_DEVICE },
        { action: 'manage', subject: ROUTER_URL.ALERT },
        { action: 'manage', subject: ROUTER_URL.ALERT_ACTIVE },
        { action: 'manage', subject: ROUTER_URL.ALERT_HISTORY },
        { action: 'manage', subject: ROUTER_URL.REPORT_EXPORT },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_OPERATION },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_YIELD },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_STATISTIC },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_DEVICES },
        { action: 'manage', subject: ROUTER_URL.REPORT_STATISTICS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_CONFIGURATIONS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_SYSTEM_ALERT },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.ACCOUNT_SETTING },
        { action: 'manage', subject: ROUTER_URL.CHANGE_PASSWORD },
        { action: 'manage', subject: USER_ABILITY.MANAGE_PROJECT },
        { action: 'need confirm', subject: USER_ABILITY.NEED_TO_CONFIRM },
        { action: 'manage', subject: USER_ABILITY.MANAGE_DEVICE },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_ALERT_STATUS },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_SEND_EMAIL_TO_MANAGERS_SETTING },
        { action: 'manage', subject: USER_ABILITY.CAN_VIEW_USER_ACTIVITIES_REPORT }
      ]
    }

    case USER_ROLE.SITE_PORTAL_USER.VALUE: {
      return [
        { action: 'manage', subject: ROUTER_URL.HOME },
        { action: 'manage', subject: ROUTER_URL.MAP },
        { action: 'manage', subject: ROUTER_URL.INFORMATION },
        { action: 'manage', subject: ROUTER_URL.PROJECTS },
        { action: 'manage', subject: ROUTER_URL.PROJECT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_OVERVIEW },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SINGLE_LINE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INVERTER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER },
        { action: 'manage', subject: ROUTER_URL.PROJECT_METER_DETAIL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALARM },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CONTROL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_GENERAL },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_COMMERCE },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_IMAGES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_INFO_MAP },
        { action: 'manage', subject: ROUTER_URL.PROJECT_CHART },
        { action: 'manage', subject: ROUTER_URL.PROJECT_SETTING },
        { action: 'manage', subject: ROUTER_URL.PROJECT_DEVICES },
        { action: 'manage', subject: ROUTER_URL.PROJECT_ALERT },
        { action: 'manage', subject: ROUTER_URL.PROJECT_MAINTENANCE },
        { action: 'manage', subject: ROUTER_URL.MONITORING_DEVICE },
        { action: 'manage', subject: ROUTER_URL.ALERT },
        { action: 'manage', subject: ROUTER_URL.ALERT_ACTIVE },
        { action: 'manage', subject: ROUTER_URL.ALERT_HISTORY },
        { action: 'manage', subject: ROUTER_URL.REPORT_EXPORT },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_OPERATION },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_YIELD },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_STATISTIC },
        { action: 'manage', subject: ROUTER_URL.REPORT_PROJECTS_DEVICES },
        { action: 'manage', subject: ROUTER_URL.REPORT_STATISTICS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_GENERAL },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_CONFIGURATIONS },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_SYSTEM_ALERT },
        { action: 'manage', subject: ROUTER_URL.SETTINGS_PROJECTS },
        { action: 'manage', subject: ROUTER_URL.ACCOUNT_SETTING },
        { action: 'manage', subject: ROUTER_URL.CHANGE_PASSWORD },
        { action: 'manage', subject: USER_ABILITY.CAN_UPDATE_ALERT_STATUS }
      ]
    }

    case USER_ROLE.SUPER_ADMIN.VALUE:
      return [{ action: 'manage', subject: 'all' }]

    default:
      return []
  }
}
