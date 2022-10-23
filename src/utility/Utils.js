/* eslint-disable no-mixed-operators */
import { forwardRef } from 'react'
import { ROUTER_URL } from '@constants/router'
import { Slide, toast } from 'react-toastify'
import { FormText } from 'reactstrap'
import { IMAGE_REGEX } from '@constants/regex'
import _orderBy from 'lodash/orderBy'
import { USER_ROLE } from '@constants/user'
import { DEVICE_TYPE } from '@constants/project'
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_FORMAT_CALENDAR,
  INTERVAL_BUTTON,
  NUMBER_TO_FIXED,
  NUMBER_TO_FIXED_THREE
} from '@constants/common'
import moment from 'moment'
import _sortBy from 'lodash/sortBy'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you
 * need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  switch (userRole) {
    case USER_ROLE.SUPER_ADMIN.VALUE:
    case USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE:
    case USER_ROLE.ADMIN_PORTAL_USER.VALUE:
    case USER_ROLE.SITE_PORTAL_ADMIN.VALUE:
    case USER_ROLE.SITE_PORTAL_USER.VALUE:
      return '/'
    default:
      return ROUTER_URL.LOGIN
  }
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

// ** Bootstrap Checkbox Component
// eslint-disable-next-line react/display-name,react/prop-types
export const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
  <div className="custom-control custom-checkbox">
    <input type="checkbox" className="custom-control-input" ref={ref} {...rest} />
    <label className="custom-control-label" onClick={onClick} />
  </div>
))

export const numberWithCommas = (number, numberToFix) => {
  return isNaN(number)
    ? '-'
    : Number(number)
        .toFixed(numberToFix >= 0 ? numberToFix : NUMBER_TO_FIXED)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const numberWithOneCommas = (number) => {
  return isNaN(number)
    ? 0
    : Number(Math.round(Math.round(number * 10000) / 10) / 10)
        .toFixed(NUMBER_TO_FIXED)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const numberOneCommas = (number) => {
  return isNaN(number) ? 0 : Number(Math.round(Math.round(number * 10000) / 10) / 10)
}
export const numberWithThreeCommas = (number) => {
  return isNaN(number)
    ? 0
    : Number(Math.round(Math.round(number * 1000000) / 10) / 1000)
        .toFixed(NUMBER_TO_FIXED_THREE)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export const numberThreeCommas = (number) => {
  return isNaN(number) ? 0 : Number(Math.round(Math.round(number * 1000000) / 10) / 1000)
}

export const numberToFixed = (number, toFixed = NUMBER_TO_FIXED) => {
  if (typeof number === 'number') {
    return Number(number.toFixed(toFixed))
  }

  if (typeof number === 'string' && typeof Number(number) === 'number') {
    return Number(Number(number).toFixed(toFixed))
  }

  return 0
}

// Calculate project power by key
export const sumProjectPower = (projects, key) => {
  return projects.reduce((accumulator, currentValue) => {
    if (isNaN(Number(currentValue[key]))) {
      return accumulator
    }

    // eslint-disable-next-line no-mixed-operators
    return accumulator + Number(currentValue[key]) / 1000
  }, 0)
}

// Custom toast
// eslint-disable-next-line react/prop-types
const Container = (props) => <div>{props.children}</div>

export const showToast = (key, message) => {
  // render
  const toastContent = (
    <Container>
      <FormText>{message}</FormText>
    </Container>
  )

  return toast[key](toastContent, { transition: Slide, autoClose: 1000 })
}

// Check image URL
export const checkImageURL = (url) => {
  return url.toLowerCase().match(IMAGE_REGEX) !== null
}

// Replace Vietnamese character
export const toNonAccentVietnamese = (value) => {
  return (
    value
      // Lower
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      // Upper
      .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
      .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
      .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
      .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
      .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
      .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
      .replace(/Đ/g, 'D')
      .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
      .replace(/\u02C6|\u0306|\u031B/g, '')
  ) // Â, Ê, Ă, Ơ, Ư;
}

// Custom filter
export const customFilter = ({ data, filterKey, filterValue }) => {
  let filteredData = [...data]
  if (filterKey && filterValue) {
    const parsedValue = JSON.parse(filterValue)

    filteredData = filteredData.filter((item) => {
      if (item[filterKey]) {
        if (Array.isArray(item[filterKey]) && Array.isArray(parsedValue)) {
          if (item[filterKey].length === 0) return false

          for (let i = 0; i < item[filterKey].length; i++) {
            if (parsedValue.some((id) => id === item[filterKey][i].id)) {
              return true
            }
          }
        } else if (typeof item[filterKey] === 'object' && Array.isArray(parsedValue)) {
          return parsedValue.some((id) => id === item[filterKey].id)
        } else {
          console.log('ben trong filter: ', item[filterKey], filterValue)
          return item[filterKey] === filterValue
        }
      }

      return false
    })
  }

  return filteredData
}

// Custom filter
export const filterData = ({ data, params, searchKeys }) => {
  let tempData = [...data]

  // ** Filtering
  if (params?.customerId) {
    tempData = customFilter({ data: tempData, filterKey: 'customer', filterValue: params.customerId })
  }

  if (params?.customers) {
    tempData = customFilter({ data: tempData, filterKey: 'customers', filterValue: params.customers })
  }

  if (params?.projects) {
    tempData = customFilter({ data: tempData, filterKey: 'projects', filterValue: params.projects })
  }

  if (params?.users) {
    tempData = customFilter({ data: tempData, filterKey: 'users', filterValue: params.users })
  }

  if (params?.status) {
    tempData = customFilter({ data: tempData, filterKey: 'status', filterValue: params.status })
  }

  if (params?.typeModel) {
    tempData = customFilter({ data: tempData, filterKey: 'typeModel', filterValue: params.typeModel })
  }

  // ** Searching
  if (params?.q && searchKeys) {
    const queryLowered = toNonAccentVietnamese(params.q.toLowerCase())
    tempData = tempData.filter((item) => {
      return searchKeys.some((key) => {
        if (item[key]) {
          if (key === 'phones' || key === 'emails') {
            return item[key].some((searchItem) => searchItem?.value && searchItem.value.includes(queryLowered))
          }

          if (key === 'locations') {
            return item[key].some((location) => {
              return location?.address && toNonAccentVietnamese(location.address.toLowerCase()).includes(queryLowered)
            })
          }

          return toNonAccentVietnamese(item[key].toLowerCase()).includes(queryLowered)
        }

        return false
      })
    })
  }

  // ** Sorting
  if (params?.order) {
    const orders = params.order.split(' ')
    tempData = _orderBy(tempData, [orders[0]], [orders[1]])
  }

  return tempData
}

export const calculatePowerByKey = (row, key, unit) => {
  if (row?.devices) {
    const inverters = row.devices.filter((item) => item.typeDevice === DEVICE_TYPE.INVERTER)
    let todayActivePower = 0
    inverters.forEach((item) => {
      todayActivePower += item[key]
    })

    return `${numberWithCommas(todayActivePower / 1000)} ${unit}`
  }

  return `0 ${unit}`
}

export const parseFirebaseMessage = (data) => {
  const keys = Object.keys(data)
  const tempData = { ...data }

  keys.forEach((key) => {
    if (typeof tempData[key] === 'string') {
      tempData[key] = JSON.parse(tempData[key])
    }
  })

  return tempData
}

// Custom get local storage
export const getLocalStorage = (key) => {
  const tempValue = localStorage.getItem(key)

  if (tempValue) {
    return JSON.parse(tempValue)
  }

  return null
}

// Custom set local storage
export const setLocalStorage = ({ key, value }) => {
  const tempValue = getLocalStorage(key)

  if (tempValue) {
    localStorage.setItem(
      key,
      JSON.stringify({
        ...tempValue,
        ...value
      })
    )
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// Get list years by projects for rendering checkbox
export const getYears = (projects) => {
  const years = []

  projects.forEach((project) => {
    const startYear = moment(Number(project?.startDate) || Date.now()).year()
    if (!years.some((year) => year.id === startYear)) {
      years.push({ id: startYear, name: `${startYear}` })
    }
  })

  return _sortBy(years, (year) => year.id)
}

// Get randomColor (HEX)
export const randomColor = () => `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`

// Select unit time for moment
export const selectUnitOfTime = (key) => {
  switch (key) {
    case 'week':
      return 'isoWeek'

    case 'month':
      return 'month'

    case 'year':
      return 'year'

    case 'day':
    default:
      return 'day'
  }
}

// Render format date for Date picker
export const renderFormatDatePicker = ({ key, picker }) => {
  switch (key) {
    case 'week':
      return `${moment(picker).startOf('isoWeek').format(DISPLAY_DATE_FORMAT)} - ${moment(picker)
        .endOf('isoWeek')
        .format(DISPLAY_DATE_FORMAT)}`

    case 'month':
      return 'MM/yyyy'

    case 'year':
    case 'total':
      return 'yyyy'

    case 'day':
    default:
      return DISPLAY_DATE_FORMAT_CALENDAR
  }
}

// Render selection mode for Date picker
export const renderSelectionMode = (key) => {
  switch (key) {
    case 'week':
      return 'week'

    case 'month':
      return 'month'

    case 'year':
    case 'total':
      return 'year'

    case 'day':
    default:
      return 'day'
  }
}

// Sum by key
export const sumByKey = ({ data, key, type, inverterType }) => {
  switch (type) {
    case 'string': {
      const result = []

      if (data.length) {
        data.forEach((item) => {
          if (!result.includes(item[key])) {
            result.push(item[key])
          }
        })
      }

      return result.join(',')
    }

    case 'stringV2': {
      const result = []

      if (data.length) {
        data.forEach((item) => {
          result.push(item[key])
        })
      }

      return result.join(' / ')
    }

    case 'stringV3': {
      const tempResult = []
      const result = []

      if (data.length) {
        data.forEach((item) => {
          tempResult.push(item[inverterType])
        })
      } else {
        result.push('--')
        return result.join(' ')
      }

      if (tempResult.length) {
        tempResult.forEach((item) => {
          if (item !== null && item !== undefined) {
            if (!isNaN(item[key])) {
              if (!result.includes(item[key] / 1000)) {
                result.push(item[key] / 1000)
              }
            }
            if (isNaN(item[key])) {
              if (!result.includes(item[key])) {
                result.push(item[key])
              }
            }
          }
        })
      }

      return result.join(', ')
    }

    case 'timestamp': {
      const result = []

      if (data.length) {
        data.forEach((item) => {
          if (Number(item[key])) {
            const formatDate = moment(Number(item[key])).format(DISPLAY_DATE_FORMAT)
            if (!result.includes(formatDate)) {
              result.push(formatDate)
            }
          }
        })
      }

      return result.join(',')
    }

    case 'number':
    default: {
      let result = 0

      if (data.length) {
        data.forEach((item) => {
          if (item[key]) {
            result += item[key]
          }
        })
      }

      return result
    }
  }
}

// Calculate different between 2 items in array
export const calculateDiffInArray = (array) => {
  return array.map((item, i, originArray) => (i === 0 ? i : item - originArray[i - 1]))
}

// Render time options
export const renderTimeOptions = ({ intl, type }) => {
  switch (type) {
    case INTERVAL_BUTTON.WEEK:
      return [
        { value: 15, label: `15 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 30, label: `30 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 60, label: `60 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 1, label: `1 ${intl.formatMessage({ id: 'day' })}`, timeUnit: 'day' }
      ]

    case INTERVAL_BUTTON.MONTH:
      return [
        { value: 30, label: `30 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 60, label: `60 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 1, label: `1 ${intl.formatMessage({ id: 'day' })}`, timeUnit: 'day' }
      ]

    case INTERVAL_BUTTON.YEAR:
      return [{ value: 1, label: `1 ${intl.formatMessage({ id: 'month' })}`, timeUnit: 'month' }]

    default:
      return [
        { value: 5, label: `5 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 15, label: `15 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 30, label: `30 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' },
        { value: 60, label: `60 ${intl.formatMessage({ id: 'min' })}`, timeUnit: 'minute' }
      ]
  }
}

// Filter data by key with all projects
export const filterDataByKey = ({ projectAllData, items, key }) => {
  const tempData = []

  projectAllData.forEach((project) => {
    items.forEach((item) => {
      if (!tempData.find((e) => e.id === item.id) && project[key] === item.id) {
        tempData.push(item)
      }
    })
  })

  return tempData
}

// Render dynamic number and unit
export const renderDynamicUnit = ({ value, milUnit, thousandUnit, originUnit }) => {
  if (value > 1000000) {
    return {
      value: value / 1000000,
      unit: milUnit
    }
  }

  if (value > 1000) {
    return {
      value: value / 1000,
      unit: thousandUnit
    }
  }

  return { value, unit: originUnit }
}

/**
 * Get union codes
 * @param {array} codes
 * @returns {string|*}
 */
export const getUnionCode = (codes) => {
  if (Array.isArray(codes) && codes.length > 0) {
    const filteredCodes = codes.filter((code) => code && code !== '')

    return `# ${filteredCodes.join('-')}`
  }

  return ''
}

export const convertPermissionCodeToLabel = (per) => {
  return <span className="text-capitalize ">{per?.replaceAll('_', ' ').toLowerCase()}</span>
}
