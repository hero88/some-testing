import axios from 'axios'
import {
  GET_MONITORING_METERS,
  SET_SELECTED_MONITORING_METER,
  GET_MONITORING_METER_BY_ID,
  SET_MONITORING_METER_DATA
} from '@constants/index'
import { API_GET_MONITORING_METER, API_GET_MONITORING_METERS } from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getMonitoringMeters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_METERS, {
        params: {
          ...params
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_METERS,
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
export const getAllMonitoringMeters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_METERS, {
        params: {
          ...params
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_METERS,
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

// ** Get meter by ID
export const getMonitoringMeterById = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_MONITORING_METER, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_MONITORING_METER_BY_ID,
            meter: response.data.data
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

// ** Set selected meter
export const setSelectedMonitoringMeter = (meter) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_MONITORING_METER,
      meter
    })
  }
}

// ** Set monitoring meter data
export const setMonitoringMeterData = (meters, params, total) => {
  return (dispatch) => {
    dispatch({
      type: SET_MONITORING_METER_DATA,
      meters,
      params,
      total
    })
  }
}
