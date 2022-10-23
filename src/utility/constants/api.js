const BASE_API_URL = process.env.REACT_APP_BASE_API_URL
const BASE_API_URL_V2 = process.env.REACT_APP_BASE_API_URL_V2

//Base URL for sending command to control power of inverter
const BASE_API_CLOUD_FUNCTION = process.env.BASE_API_CLOUD_FUNCTION

export const API_GET_USERS = `${BASE_API_URL}/glf_user`
export const API_GET_USERS_ACTIVITIES = `${BASE_API_URL}/glf_activity`
export const API_GET_USER_INFO = `${BASE_API_URL}/glf_user`
export const API_POST_USER_INFO = `${BASE_API_URL}/glf_user`
export const API_PUT_USER_INFO = `${BASE_API_URL}/glf_user`
export const API_DELETE_USER = `${BASE_API_URL}/glf_user`
export const API_GET_SYSTEM_ALERT_SETTING = `${BASE_API_URL}/glf_user_setting`
export const API_POST_SYSTEM_ALERT_SETTING = `${BASE_API_URL}/glf_user_setting`
export const API_GET_GENERAL_SETTING = `${BASE_API_URL}/glf_user_general_setting`
export const API_POST_GENERAL_SETTING = `${BASE_API_URL}/glf_user_general_setting`
export const API_PUT_GENERAL_SETTING = `${BASE_API_URL}/glf_user_general_setting`
export const API_CHANGE_PASSWORD = `${BASE_API_URL}/glf_change_password`
export const API_RESET_PASSWORD = `${BASE_API_URL}/glf_reset_password`
export const API_POST_MEDIA = `${BASE_API_URL}/glf_media`

export const API_GET_SENSOR = `${BASE_API_URL}/glf_sensor`

export const API_GET_PROJECTS = `${BASE_API_URL}/glf_project`
export const API_GET_PROJECT = `${BASE_API_URL}/glf_project`
export const API_POST_PROJECT = `${BASE_API_URL}/glf_project`
export const API_PUT_PROJECT = `${BASE_API_URL}/glf_project`
export const API_DELETE_PROJECT = `${BASE_API_URL}/glf_project`
export const API_GET_PROJECT_BY_CUSTOMER = `${BASE_API_URL}/glf_project`
export const API_GET_PROJECT_MONITORING = `${BASE_API_URL}/glf_monitoring_project`

export const API_GET_CUSTOMERS = `${BASE_API_URL}/glf_customer`
export const API_GET_CUSTOMER = `${BASE_API_URL}/glf_customer`
export const API_POST_CUSTOMER = `${BASE_API_URL}/glf_customer`
export const API_PUT_CUSTOMER = `${BASE_API_URL}/glf_customer`
export const API_DELETE_CUSTOMER = `${BASE_API_URL}/glf_customer`

export const API_GET_DEVICE_TYPE_INVERTERS = `${BASE_API_URL}/glf_inverter_type`
export const API_POST_DEVICE_TYPE_INVERTER = `${BASE_API_URL}/glf_inverter_type`
export const API_PUT_DEVICE_TYPE_INVERTER = `${BASE_API_URL}/glf_inverter_type`

export const API_GET_DEVICE_TYPE_PANELS = `${BASE_API_URL}/glf_panel_type`
export const API_POST_DEVICE_TYPE_PANEL = `${BASE_API_URL}/glf_panel_type`
export const API_PUT_DEVICE_TYPE_PANEL = `${BASE_API_URL}/glf_panel_type`

export const API_GET_DEVICES = `${BASE_API_URL}/glf_device`
export const API_GET_DEVICE = `${BASE_API_URL}/glf_device`
export const API_POST_DEVICE = `${BASE_API_URL}/glf_device`
export const API_POST_AUTO_DEVICE = `${BASE_API_URL}/glf_auto_device`
export const API_PUT_DEVICE = `${BASE_API_URL}/glf_device`
export const API_DELETE_DEVICE = `${BASE_API_URL}/glf_device`

export const API_GET_METERS = `${BASE_API_URL}/glf_device`
export const API_GET_METER = `${BASE_API_URL}/glf_device`
export const API_POST_METER = `${BASE_API_URL}/glf_device`
export const API_PUT_METER = `${BASE_API_URL}/glf_device`
export const API_DELETE_METER = `${BASE_API_URL}/glf_device`

export const API_GET_INVERTERS = `${BASE_API_URL}/glf_device`
export const API_GET_INVERTER = `${BASE_API_URL}/glf_device`
export const API_POST_INVERTER = `${BASE_API_URL}/glf_device`
export const API_PUT_INVERTER = `${BASE_API_URL}/glf_device`
export const API_DELETE_INVERTER = `${BASE_API_URL}/glf_device`

export const API_GET_PANELS = `${BASE_API_URL}/glf_device`
export const API_GET_PANEL = `${BASE_API_URL}/glf_device`
export const API_POST_PANEL = `${BASE_API_URL}/glf_device`
export const API_PUT_PANEL = `${BASE_API_URL}/glf_device`
export const API_DELETE_PANEL = `${BASE_API_URL}/glf_device`

export const API_GET_MONITORING_METERS = `${BASE_API_URL}/glf_monitoring`
export const API_GET_MONITORING_METER = `${BASE_API_URL}/glf_monitoring`
export const API_POST_MONITORING_METER = `${BASE_API_URL}/glf_monitoring`
export const API_PUT_MONITORING_METER = `${BASE_API_URL}/glf_monitoring`
export const API_DELETE_MONITORING_METER = `${BASE_API_URL}/glf_monitoring`

export const API_GET_MONITORING_INVERTERS = `${BASE_API_URL}/glf_monitoring`
export const API_GET_MONITORING_INVERTER = `${BASE_API_URL}/glf_monitoring`
export const API_GET_LATEST_MONITORING_INVERTER_BY_ID = `${BASE_API_URL}/glf_monitoring`
export const API_POST_MONITORING_INVERTER = `${BASE_API_URL}/glf_monitoring`
export const API_PUT_MONITORING_INVERTER = `${BASE_API_URL}/glf_monitoring`
export const API_DELETE_MONITORING_INVERTER = `${BASE_API_URL}/glf_monitoring`
export const API_GET_DAILY_YIELD = `${BASE_API_URL}/glf_monitoring_stats`

export const API_GET_MONITORING_PROJECT_CHART = `${BASE_API_URL}/glf_monitoring_chart`
export const API_GET_CHART_FILTER_TEMPLATE = `${BASE_API_URL}/glf_user_filter`
export const API_POST_CHART_FILTER_TEMPLATE = `${BASE_API_URL}/glf_user_filter`
export const API_PUT_CHART_FILTER_TEMPLATE = `${BASE_API_URL}/glf_user_filter`
export const API_DELETE_CHART_FILTER_TEMPLATE = `${BASE_API_URL}/glf_user_filter`

export const API_GET_GROUP = `${BASE_API_URL}/glf_group`

export const API_GET_AUTO_CREATE_PROJECT = `${BASE_API_URL}/glf_auto_project`
export const API_POST_AUTO_CREATE_PROJECT = `${BASE_API_URL}/glf_auto_project`
export const API_PUT_AUTO_CREATE_PROJECT = `${BASE_API_URL}/glf_auto_project`
export const API_GET_PENDING_DELETE_PROJECT = `${BASE_API_URL}/glf_confirm_project`
export const API_DELETE_APPROVE_DELETE_PROJECT = `${BASE_API_URL}/glf_confirm_project`
export const API_GET_PENDING_APPROVE_PROJECT = `${BASE_API_URL}/glf_confirm_project`
export const API_PUT_APPROVE_PENDING_APPROVE_PROJECT = `${BASE_API_URL}/glf_confirm_project`

export const API_GET_ALERTS = `${BASE_API_URL}/glf_alert`
export const API_POST_ALERTS = `${BASE_API_URL}/glf_alert`
export const API_PUT_ALERTS = `${BASE_API_URL}/glf_alert`
export const API_GET_ALERT_NOTES = `${BASE_API_URL}/glf_note_alert`
export const API_POST_ALERT_NOTE = `${BASE_API_URL}/glf_note_alert`

export const API_POST_FIREBASE = `${BASE_API_URL}/glf_firebase`
export const API_GET_MONITORING_LOCATIONS = `${BASE_API_URL}/glf_monitoring_locations`
export const API_GET_ELECTRICITY = `${BASE_API_URL}/glf_electricity`

export const API_GET_EFF_FOR_CHART = `${BASE_API_URL}/glf_monitoring_chart`

export const API_GET_PROJECTS_QUANTITY_REPORT = `${BASE_API_URL}/glf_quantity_report`
export const API_GET_PROJECTS_OPERATIONAL_REPORT = `${BASE_API_URL}/glf_operational_report`
export const API_GET_GENERAL_REPORT = `${BASE_API_URL}/glf_summary_report`

export const API_GET_INDUSTRIAL_AREAS = `${BASE_API_URL}/glf_industrial`
export const API_GET_INVESTORS = `${BASE_API_URL}/glf_investor`
export const API_GET_YIELD_CHART = `${BASE_API_URL}/glf_monitoring_yield_chart`

export const API_GET_INVERTER_TYPES = `${BASE_API_URL}/glf_inverter_type`
export const API_GET_PANEL_TYPES = `${BASE_API_URL}/glf_panel_type`

export const API_GET_OPERATION_UNIT = `${BASE_API_URL_V2}/operation-company/search`
export const API_GET_ALL_OPERATION_UNIT = `${BASE_API_URL_V2}/operation-company/all`

export const CHECK_DUPLICATE_OPRERATION_UNIT_SIGN = `${BASE_API_URL_V2}/operation-company/check-sign`
export const CHECK_DUPLICATE_OPRERATION_UNIT_CODE = `${BASE_API_URL_V2}/operation-company/check-code`
export const API_CREATE_OPERATION_UNIT = `${BASE_API_URL_V2}/operation-company/create`
export const API_UPDATE_OPERATION_UNIT = `${BASE_API_URL_V2}/operation-company/update`
export const API_GET_OPERATION_UNIT_BY_ID = `${BASE_API_URL_V2}/operation-company/id`
export const API_DELETE_OPERATING_COMPANY = `${BASE_API_URL_V2}/operation-company/delete`
//roofVendor
export const API_GET_ALL_ROOF_VENDOR = `${BASE_API_URL_V2}/roof-vendor/all`
export const API_GET_ROOF_VENDOR = `${BASE_API_URL_V2}/roof-vendor/search`
export const API_CREATE_ROOF_VENDOR = `${BASE_API_URL_V2}/roof-vendor/create`
export const API_UPDATE_ROOF_VENDOR = `${BASE_API_URL_V2}/roof-vendor/update`
export const API_GET_ROOF_VENDOR_BY_ID = `${BASE_API_URL_V2}/roof-vendor/id`
export const API_DELETE_ROOF_VENDORS = `${BASE_API_URL_V2}/roof-vendor/delete`
export const API_CHECK_CODE_ROOF_VENDORS = `${BASE_API_URL_V2}/roof-vendor/check-code`
export const API_GET_CONTACT_BY_ROOF_VENDOR_ID = `${BASE_API_URL_V2}/contacts/roofVendorId`
//end roofVendor
//project
export const API_GET_NEW_PROJECT = `${BASE_API_URL_V2}/project/search`
export const API_CREATE_PROJECT = `${BASE_API_URL_V2}/project/create`
export const API_UPDATE_PROJECT = `${BASE_API_URL_V2}/project/update`
export const API_GET_PROJECT_BY_ID = `${BASE_API_URL_V2}/project/id`
export const API_DELETE_PROJECTS = `${BASE_API_URL_V2}/project/delete`
export const API_CHECK_PROJECT = `${BASE_API_URL_V2}/project/check-code`
export const API_CHECK_PROJECT_NAME = `${BASE_API_URL_V2}/project/check-name`

export const API_GET_ALL_PROJECT = `${BASE_API_URL_V2}/project/all`
export const API_GET_PROJECT_BY_CUSTOMER_ID = `${BASE_API_URL_V2}/project/customerId`
export const API_GET_PROJECT_BY_ROOF_VENDOR_ID = `${BASE_API_URL_V2}/project/roofVendorId`
export const API_GET_PROJECT_BY_UNIT_COMPANY_ID = `${BASE_API_URL_V2}/project/operationCompanyId`

//end project

export const API_CUSTOMER_V2 = `${BASE_API_URL_V2}/customer/create`
export const API_ADD_CUSTOMER_V2 = `${BASE_API_URL_V2}/customer/create`
export const API_UPDATE_CUSTOMER_V2 = `${BASE_API_URL_V2}/customer/update`
export const API_GET_ALL_CUSTOMER = `${BASE_API_URL_V2}/customer/all`

export const API_DELETE_CUSTOMER_V2 = `${BASE_API_URL_V2}/customer/delete`

export const API_GET_LIST_CUSTOMER = `${BASE_API_URL_V2}/customer/search`
export const API_CHECK_DUPLICATE_CUSTOMER_CODE = `${BASE_API_URL_V2}/customer/check-code`
export const API_ADD_CONTACT = `${BASE_API_URL_V2}/contacts/create`
export const API_UPDATE_CONTACT = `${BASE_API_URL_V2}/contacts/update`
export const API_DELETE_CONTACT = `${BASE_API_URL_V2}/contacts/delete`
export const API_GET_CUSTOMER_BY_ID = `${BASE_API_URL_V2}/customer/id`
export const API_GET_CONTACT_BY_CUSTOMER_ID = `${BASE_API_URL_V2}/contacts/customerId`
export const API_GET_ALL_CUSTOMERS = `${BASE_API_URL_V2}/customer/all`
export const API_GET_LIST_CUSTOMER_BY_PROJECT_ID = `${BASE_API_URL_V2}/customer/project-id`

export const API_ROOF_RETAL_UNIT = `${BASE_API_URL}/api/v1/billing/roof`

export const API_CONTACT_ROOF_RETAL_UNIT = `${BASE_API_URL}/api/v1/billing/roof-contact`

export const API_DELETE_ROOF_RETAL_UNIT = `${BASE_API_URL}/api/v1/billing/customer`

export const API_GET_LIST_BILLING_SETTING = `${BASE_API_URL_V2}/config/search`
export const API_GET_BILLING_SETTING_BY_ID = `${BASE_API_URL_V2}/config/id`
export const API_GET_BILLING_SETTING_VALUE_BY_SETTING_ID = `${BASE_API_URL_V2}/config-value/config-id`
export const API_GET_BILLING_SETTING_VALUE_BY_CODE = `${BASE_API_URL_V2}/config/code`
export const API_UPDATE_BILLING_SETTING = `${BASE_API_URL_V2}/config/update`
export const API_CREATE_BILLING_SETTING_VALUE = `${BASE_API_URL_V2}/config-value/create`
export const API_UPDATE_BILLING_SETTING_VALUE = `${BASE_API_URL_V2}/config-value/update`
export const API_DELETE_BILLING_SETTING_VALUE = `${BASE_API_URL_V2}/config-value/delete`

export const API_GET_ALL_CONTRACT_PROJECT_ID = `${BASE_API_URL_V2}/contract/projectId`
export const API_DELETE_CONTRACT = `${BASE_API_URL_V2}/contract/delete`
export const API_ADD_CONTRACT = `${BASE_API_URL_V2}/contract/create`
export const API_UPDATE_CONTRACT = `${BASE_API_URL_V2}/contract/update`
export const API_CHECK_CODE_CONTRACT = `${BASE_API_URL_V2}/contract/check-code`
export const API_GET_CONTRACT_BY_ID = `${BASE_API_URL_V2}/contract/id`
export const API_GET_CONTRACT_BY_CUSTOMER_ID = `${BASE_API_URL_V2}/contract/customerId`
export const API_FETCH_CONTRACT_BY_QUERY = `${BASE_API_URL_V2}/contract/fetch`
export const API_GET_ALL_CONTRACT = `${BASE_API_URL_V2}/contract/all`

//meter
export const API_FILLTER_METERS = `${BASE_API_URL_V2}/meter/meter-filter`
export const API_FILLTER_METERS_METRIC = `${BASE_API_URL_V2}/meter/meter-metrics`
export const API_DELETE_CLOCK = `${BASE_API_URL_V2}/meter/delete`
export const API_ADD_CLOCK = `${BASE_API_URL_V2}/meter/create`
export const API_UPDATE_CLOCK = `${BASE_API_URL_V2}/meter/update`
export const API_GET_ALL_CLOCK_BY_CONTRACT_ID = `${BASE_API_URL_V2}/meter/contractId`

// input clock index
export const API_GET_INPUT_CLOCK_INDEX = `${BASE_API_URL_V2}/billing-data/search`
export const API_GET_BLLING_DATA_BY_CONTRACT_ID = `${BASE_API_URL_V2}/billing-data/contractId`
export const API_GET_BLLING_DATA_BY_ID = `${BASE_API_URL_V2}/billing-data/id`
export const API_DELETE_INPUT_CLOCK_INDEX = `${BASE_API_URL_V2}/billing-data/delete`
export const API_UPDATE_INPUT_CLOCK_INDEX = `${BASE_API_URL_V2}/billing-data/update`

export const GET_ALL_CLOCK = `${BASE_API_URL_V2}/meter/all`

//role
export const GET_ROLE_PERMISION_BY_ROLE_ID = `${BASE_API_URL_V2}/role-permission/role`
export const GET_ROLES = `${BASE_API_URL_V2}/role/search`
export const API_GET_ROLE_BY_ROLE_ID = `${BASE_API_URL_V2}/role/id`
export const API_UPDATE_ROLE_BY_ROLE_ID = `${BASE_API_URL_V2}/role/update`
export const API_DELETE_ROLE_PERMISSION_BY_ROLE_ID = `${BASE_API_URL_V2}/role-permission/delete/roleId`
export const API_ADD_ROLE_PERMISSION_BY_ROLE_ID = `${BASE_API_URL_V2}/role-permission/create`

// permission
export const API_GET_ALL_PERMISSION = `${BASE_API_URL_V2}/permission/all`
export const API_GET_ROLE_BY_USER_ID = `${BASE_API_URL_V2}/user-role/userId`
export const API_GET_USER_ROLE = `${BASE_API_URL_V2}/user-role/search`
// user-feature
export const API_GET_ALL_USER_FEATURE = `${BASE_API_URL_V2}/user-feature/all`
export const API_POST_USER_ROLE = `${BASE_API_URL_V2}/user-role/update`

export const API_GET_ALL_USER_ACTION = `${BASE_API_URL_V2}/user-action/all`
export const API_PERMISSIONS_BY_USER = `${BASE_API_URL_V2}/user-role/current`


//file 
export const API_POST_FILES = `${BASE_API_URL_V2}/file/upload-multiple`
export const API_FILES_GET_SINGED_URL = `${BASE_API_URL_V2}/file/signedUrl`

//API to send command to inverters
export const API_SEND_COMMAND_TO_INVERTER = `${BASE_API_CLOUD_FUNCTION}/send_command_to_inverter`