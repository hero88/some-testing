export const SEARCH_LENGTH_MIN = 1
export const PLACEHOLDER = {
  ADDRESS: 'Ex: Số 364 Cộng Hòa, Phường 13, Quận Tân Bình',
  PHONE: 'Ex: 842838100017',
  COMPANY_NAME: 'Ex: Công ty Cổ phần Cơ Điện Lạnh (REE)',
  E_COMPANY_NAME: 'Ex: Điện lực TP Hồ Chí Minh',
  POSITION: 'Ex: Tổng Giám đốc',
  EMAIL: 'Ex: noreply@reedigital.com.vn',
  USERNAME: 'Ex: admin@reedigital.com.vn',
  FULL_NAME: 'Ex: Nguyễn Văn A',
  INSTALLED_POWER_AC: 'Ex: 1500',
  INSTALLED_POWER_DC: 'Ex: 2000',
  PROJECT_NAME: 'Ex: Dự án năng lượng mặt trời Long An',
  PROJECT_CODE: 'Ex: P035 # HCM-RPB-PE11002061045',
  DEVICE_NAME: 'Ex: INV1_001_008',
  DEVICE_SN: 'Ex: A2007221459',
  DEVICE_MODEL: 'Ex: SG110CX',
  MANUFACTURER: 'Ex: SUNGROW',
  PANEL_MPPT: 'Ex: 1',
  PANEL_ARRAY: 'Ex: 2',
  PRICE_1: 'Ex: 2666',
  PRICE_2: 'Ex: 1622',
  PRICE_3: 'Ex: 4587',
  TRANSFORMER_MANUFACTURER: 'Ex: ABB',
  TRANSFORMER_CAPACITY: 'Ex: 2000',
  NOMINAL_PV: 'Ex: 450',
  TREES_SAVED_RATE: 'Ex: 0.0361',
  CO2_REDUCTION_RATE: 'Ex: 0.6612',
  STANDARD_COAL_RATE: 'Ex: 0.268',
  SESSION_TIMEOUT: 'Ex: 60',
  ALERT_CONTENT: 'Ex: Đứt chì trung thế',
  CONNECTED_POINT: 'Ex: Trụ BZ-202',
  INVERTER_MODEL_NAME: 'Ex: SG110CX',

  MANUFACTURER_NAME: 'Ex: SUNGROW',
  POWER_VALUE: 'Ex: Power value is greater than 0',
  MPPT_NUMBER: 'Ex: MPPT value from 1 to 12',
  STRING_PER_MPPT: 'Ex: String per MPPT value from 1 to 24',

  PANEL_MODEL_NAME: 'Ex: SG110CX',
  MAX_POWER_VALUE: 'Ex: Power value is greater than 0',
  AREA: 'Ex: Area value is greater than 0',
  EFFICIENCY: 'Ex: Module efficiency value from 0 to 100',
  AMBIENT_TEMPERATURE: 'Ex: Ambient temperature value is greater than 0',
  MEASUREMENT_POINT_CODE: 'Ex: Measurement code'
}
export const DEFAULT_AVATAR = require('@src/assets/images/avatars/avatar-blank.svg').default
export const SHOW_ALL_ROWS = -1
export const ROWS_PER_PAGE_DEFAULT = 25
export const STANDARD_COAL_RATE = 0.268
export const CO2_REDUCTION_RATE = 0.6612
export const TREES_SAVED_RATE = 0.0361
export const SESSION_TIMEOUT = 60
export const PENDING_STATUS = {
  NORMAL: 0,
  ADD: 1,
  DELETE: 2
}
export const CHECKING_DEVICE_STATUS_TIME = 10 * 60 * 1000
export const ALLOWED_IMPORT_PANEL_FILE_EXTENSIONS = ['.csv']
export const CHECKING_PANEL_FILE_EXTENSIONS = ['csv']

export const STATE = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_NEW: 'PENDING_NEW',
  PENDING_DELETE: 'PENDING_DELETE',
  TRASH: 'TRASH'
}

export const SW_STATUS = {
  YES: 'YES',
  NO: 'NO'
}

export const ALERT_STATUS = {
  NEW: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  UN_RESOLVED: 4
}

export const ALERT_IS_READ = {
  YES: 1,
  NO: 0
}

export const ALERT_TYPE = {
  RESEND_ALERT: 1,
  INVERTER_OFFLINE: 2,
  INVERTER_OVERHEAT: 3,
  LOW_EFFICIENCY: 4,
  UNSTABLE_NETWORK: 5,
  DATA_NOT_SYNCED: 6,
  LOW_COS_PHI: 7,
  METER_OFFLINE: 8,
  PUSH_TO_OPERATOR: 9,
  FAULT_EVENT_OF_EACH_INVERTERS: 10,
  DIFF_BTW_INVERTER_AND_METER: 11,
  ASYNC_INVERTER: 12,
  YIELD_AT_LOW_COST_TIME: 13,
  LOW_EFF_OF_EACH_INVERTER: 14,
  HAVE_DIFF_YIELD_BTW_PROJECT: 15,
  INSPECTION_EXPIRED: 16,
  PV_SENSOR_OVERHEAT: 17,
  INVERTER_STRING_ALERT: 18,
  WARNING: 'style=color:#d4af37;',
  ALERT: 'class=text-warning',
  ERROR: 'class=text-danger'
}

// Limit size 20MB
export const LIMITED_SIZE = process.env.REACT_APP_IMAGE_LIMIT_SIZE * 1024 * 1024
export const NUMBER_TO_FIXED = 1
export const NUMBER_TO_FIXED_THREE = 3

export const LAYOUT_SETTING = {
  MONITORING_METER: 'monitoringMeter',
  PROJECT: 'project',
  PROJECT_INFO: 'projectInformation',
  OPERATION_REPORT: 'operationReport',
  YIELD_REPORT: 'yieldReport'
}

export const INTERVAL_YIELD = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
}

export const INTERVAL_BUTTON = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  TOTAL: 'total'
}

export const MULTI_FORMAT_INPUT_DATE = ['DD/MM/YYYY', 'DD-MM-YYYY']

export const REPORT_TYPE = {
  OPERATION: 'Operation report',
  YIELD: 'Yield report',
  GENERAL: 'General report',
  STATISTIC: 'Statistic report',
  DEVICE: 'Devices report',
  USER_ACTIVITIES: 'User activities report'
}

export const GENERAL_REPORT_TYPE = {
  STATISTIC: 1,
  SYSTEM: 2,
  INVERTER: 3,
  METER: 4
}

export const ROWS_PER_PAGE_OPTIONS = [
  { label: 10, value: 10 },
  { label: 25, value: 25 },
  { label: 50, value: 50 },
  { label: 75, value: 75 },
  { label: 100, value: 100 }
]

export const CHART_TYPE = {
  BAR: 'bar',
  LINE: 'line'
}

export const STATISTICAL_PATTERN_TYPE = {
  SAMPLE: 'sample',
  DIFFERENCE: 'difference'
}

export const API_MONITORING_CHART_TYPE = {
  PR: 'PR',
  IRR: 'IRR',
  AP: 'AP',
  COMMON: 'COMMON'
}

export const CHART_PARAM_TYPE = {
  PROJECT: 'PROJECT',
  DEVICE: 'DEVICE'
}

export const DISPLAY_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss'
export const ISO_DISPLAY_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY'
export const DISPLAY_DATE_FORMAT_WORKSHEET = 'DD.MM.YYYY'
export const DISPLAY_DATE_FORMAT_CALENDAR = 'dd/MM/yyyy'
// https://github.com/reactstrap/reactstrap/issues/1412#issuecomment-492256559
export const ISO_STANDARD_FORMAT = 'YYYY-MM-DD'
export const ISO_STANDARD_FORMAT_MONTH = 'YYYY-MM'

