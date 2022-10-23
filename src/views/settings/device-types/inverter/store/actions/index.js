import axios from 'axios'
import {
  GET_DEVICE_TYPE_INVERTERS,
  ADD_DEVICE_TYPE_INVERTER,
  EDIT_DEVICE_TYPE_INVERTER,
  SET_SELECTED_DEVICE_TYPE_INVERTER,
  INACTIVE_DEVICE_TYPE_INVERTER,
  STATE
} from '@constants/index'
import {
  API_GET_DEVICE_TYPE_INVERTERS,
  API_POST_DEVICE_TYPE_INVERTER,
  API_PUT_DEVICE_TYPE_INVERTER
} from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getDeviceTypeInverters = params => {
  return async dispatch => {
    await axios.get(API_GET_DEVICE_TYPE_INVERTERS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_DEVICE_TYPE_INVERTERS,
          data: response.data.data,
          total: response.data.totalRow,
          params
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Get table Data
export const getAllDeviceTypeInverters = params => {
  return async dispatch => {
    await axios.get(API_GET_DEVICE_TYPE_INVERTERS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_DEVICE_TYPE_INVERTERS,
          allData: response.data.data,
          total: response.data.totalRow
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Add new device type inverter
export const addDeviceTypeInverter = (inverter, params) => {
  return async dispatch => {
    await axios.post(API_POST_DEVICE_TYPE_INVERTER, { ...inverter, state: STATE.ACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: ADD_DEVICE_TYPE_INVERTER,
          inverter: response.data.data
        })
        dispatch(getDeviceTypeInverters(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Set selected inverter
export const setSelectedInverter = (inverter) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_DEVICE_TYPE_INVERTER,
      inverter
    })
  }
}

// ** Edit inverter
export const editDeviceTypeInverter = (inverter, params) => {
  return async dispatch => {
    await axios.put(API_PUT_DEVICE_TYPE_INVERTER, inverter).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: EDIT_DEVICE_TYPE_INVERTER,
          inverter: response.data.data
        })
        dispatch(getDeviceTypeInverters(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Inactivate inverter data by ID
export const inactivateInverter = (id, params) => {
  return async dispatch => {
    await axios.put(API_PUT_DEVICE_TYPE_INVERTER, { id, state: STATE.INACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: INACTIVE_DEVICE_TYPE_INVERTER,
          id
        })
        dispatch(getDeviceTypeInverters(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}
