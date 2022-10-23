import axios from 'axios'
import {
  GET_MONITORING_INVERTERS,
  SET_SELECTED_MONITORING_INVERTER,
  GET_MONITORING_INVERTER_BY_ID,
  SET_MONITORING_INVERTER_DATA,
  API_GET_LATEST_MONITORING_INVERTER_BY_ID,
  GET_LATEST_MONITORING_INVERTER_BY_ID,
  GET_MONITORING_INVERTERS_MULTI_TIMES,
  API_GET_DAILY_YIELD,
  GET_DAILY_YIELD,
  GET_DAILY_YIELD_BY_PROJECT,
  GET_YESTERDAY_DAILY_YIELD_BY_PROJECT,
  GET_MONTHLY_YIELD_BY_PROJECT,
  STATE,
  GET_PANELS_BY_INVERTER_ID,
  API_GET_PANELS
} from '@constants/index'
import { API_GET_MONITORING_INVERTER, API_GET_MONITORING_INVERTERS } from '@constants/api'
import { showToast } from '@utils'
import { paginateArray } from '@src/@fake-db/utils'

// ** Get table Data
export const getMonitoringInverters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_INVERTERS, {
        params: {
          ...params
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_INVERTERS,
            allData: response.data.data,
            data: response.data.data,
            total: response.data.totalRow,
            params
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get table Data
export const getAllMonitoringInverters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_INVERTERS, {
        params: {
          ...params
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_INVERTERS,
            allData: response.data.data,
            data: paginateArray(response.data.data, 10, 1),
            total: response.data.totalRow
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get separate Data
export const getAllMonitoringInvertersInMultiTimes = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_INVERTERS, {
        params: {
          ...params
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_INVERTERS_MULTI_TIMES,
            allData: response.data.data,
            total: response.data.totalRow
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get inverter by ID
export const getMonitoringInverterById = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_INVERTER, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_INVERTER_BY_ID,
            inverter: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Set selected inverter
export const setSelectedMonitoringInverter = (inverter) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_MONITORING_INVERTER,
      inverter
    })
  }
}

// ** Set monitoring inverter data
export const setMonitoringInverterData = (inverters, params, total) => {
  return (dispatch) => {
    dispatch({
      type: SET_MONITORING_INVERTER_DATA,
      inverters,
      params,
      total
    })
  }
}

// ** Get latest monitoring inverter data
export const getLatestMonitoringInverterById = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_LATEST_MONITORING_INVERTER_BY_ID, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_LATEST_MONITORING_INVERTER_BY_ID,
            data: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get daily yield
export const getDailyYield = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_DAILY_YIELD, { params, isNotCount: true })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_DAILY_YIELD,
            data: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get daily yield
export const getDailyYieldByProject = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_DAILY_YIELD, { params, isNotCount: true })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_DAILY_YIELD_BY_PROJECT,
            data: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get daily yield
export const getYesterdayDailyYieldByProject = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_DAILY_YIELD, { params, isNotCount: true })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_YESTERDAY_DAILY_YIELD_BY_PROJECT,
            data: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get daily yield
export const getMonthlyYieldByProject = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_DAILY_YIELD, { params, isNotCount: true })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONTHLY_YIELD_BY_PROJECT,
            data: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get panels by inverter's id
export const getPanelsByInverterIds = (inverterId) => {
  return async (dispatch) => {
    await axios
      .get(
        API_GET_PANELS,
        {
          params:
            {
              withInverter: inverterId,
              rowsPerPage: -1,
              state: STATE.ACTIVE,
              fk: '*'
            }
        }
      )
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_PANELS_BY_INVERTER_ID,
            data: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}
