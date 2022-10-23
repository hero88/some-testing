import {
  GET_MONITORING_INVERTERS,
  SET_SELECTED_MONITORING_INVERTER,
  GET_MONITORING_INVERTER_BY_ID,
  SET_MONITORING_INVERTER_DATA,
  ROWS_PER_PAGE_DEFAULT,
  GET_LATEST_MONITORING_INVERTER_BY_ID,
  GET_MONITORING_INVERTERS_MULTI_TIMES,
  GET_DAILY_YIELD,
  GET_DAILY_YIELD_BY_PROJECT,
  GET_YESTERDAY_DAILY_YIELD_BY_PROJECT,
  GET_MONTHLY_YIELD_BY_PROJECT, GET_PANELS_BY_INVERTER_ID
} from '@constants/index'

// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    order: 'createDate desc',
    state: '*'
  },
  allData: [],
  selectedInverter: null,
  latestData: null,
  dailyYield: null,
  projectDailyYield: null,
  yesterdayProjectDailyYield: null,
  projectMonthlyYield: null,
  panels: []
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONITORING_INVERTERS:
      return {
        ...state,
        allData: action?.allData ? action.allData : state.allData,
        data: action?.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_MONITORING_INVERTER_BY_ID:
      return {
        ...state,
        selectedInverter: action.inverter
      }
    case SET_SELECTED_MONITORING_INVERTER: {
      return {
        ...state,
        selectedInverter: action.inverter
      }
    }
    case SET_MONITORING_INVERTER_DATA: {
      return {
        ...state,
        data: action.inverters,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    case GET_LATEST_MONITORING_INVERTER_BY_ID: {
      return {
        ...state,
        latestData: action.data
      }
    }
    case GET_MONITORING_INVERTERS_MULTI_TIMES: {
      return {
        ...state,
        allData: [...state.allData, ...action.allData]
      }
    }

    case GET_DAILY_YIELD: {
      return {
        ...state,
        dailyYield: action.data
      }
    }

    case GET_DAILY_YIELD_BY_PROJECT: {
      return {
        ...state,
        projectDailyYield: action.data
      }
    }

    case GET_YESTERDAY_DAILY_YIELD_BY_PROJECT: {
      return {
        ...state,
        yesterdayProjectDailyYield: action.data
      }
    }

    case GET_MONTHLY_YIELD_BY_PROJECT: {
      return {
        ...state,
        projectMonthlyYield: action.data
      }
    }

    case GET_PANELS_BY_INVERTER_ID: {
      return {
        ...state,
        panels: action.data
      }
    }

    default:
      return state
  }
}

export default DataTablesReducer
