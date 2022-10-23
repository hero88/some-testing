import axios from 'axios'
import {
  GET_DEVICES,
  SET_SELECTED_DEVICE,
  GET_DEVICE_BY_ID,
  DEVICE_TYPE,
  EDIT_METER,
  EDIT_INVERTER,
  EDIT_PANEL,
  SET_DEVICE_DATA
} from '@constants/index'
import {
  API_DELETE_DEVICE,
  API_GET_DEVICE,
  API_GET_DEVICES,
  API_POST_DEVICE,
  API_PUT_DEVICE
} from '@constants/api'
import { showToast } from '@utils'
import { getMeters } from '@src/views/monitoring/project/devices/meters/store/actions'
import { getInverters } from '@src/views/monitoring/project/devices/inverters/store/actions'
import { getPanels } from '@src/views/monitoring/project/devices/panels/store/actions'

// ** Get table Data
export const getDevices = params => {
  return async dispatch => {
    await axios.get(API_GET_DEVICES, {
      params: {
        ...params
      }
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_DEVICES,
          allData: response.data.data,
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

// ** Get device by ID
export const getDeviceById = params => {
  return async dispatch => {
    await axios.get(API_GET_DEVICE, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_DEVICE_BY_ID,
          device: response.data.data
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Remove device data by ID
export const removeDevice = (id, params) => {
  return async dispatch => {
    await axios.delete(API_DELETE_DEVICE, { data: { id } }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch(getDevices(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Add new device
export const addDevice = (device, params) => {
  return async dispatch => {
    await axios.post(API_POST_DEVICE, {
      ...device
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        switch (device.typeDevice) {
          case DEVICE_TYPE.METER:
            dispatch(getMeters(params))
            break
          case DEVICE_TYPE.INVERTER:
            dispatch(getInverters(params))
            break
          case DEVICE_TYPE.PANEL:
            dispatch(getPanels(params))
            break
        }
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Edit device
export const editDevice = (device, params) => {
  return async dispatch => {
    await axios.put(API_PUT_DEVICE, {
      ...device
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        switch (device.typeDevice) {
          case DEVICE_TYPE.METER:
            dispatch({
              type: EDIT_METER,
              meter: response.data.data
            })
            dispatch(getMeters(params))
            break
          case DEVICE_TYPE.INVERTER:
            dispatch({
              type: EDIT_INVERTER,
              inverter: response.data.data
            })
            dispatch(getInverters(params))
            break
          case DEVICE_TYPE.PANEL:
            dispatch({
              type: EDIT_PANEL,
              panel: response.data.data
            })
            dispatch(getPanels(params))
            break
        }
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Set selected device
export const setSelectedDevice = (device) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_DEVICE,
      device
    })
  }
}

// ** Set device data
export const setDeviceData = (devices, params, total) => {
  return dispatch => {
    dispatch({
      type: SET_DEVICE_DATA,
      devices,
      params,
      total
    })
  }
}
