import axios from 'axios'
import {
  GET_DEVICE_TYPE_PANELS,
  ADD_DEVICE_TYPE_PANEL,
  EDIT_DEVICE_TYPE_PANEL,
  SET_SELECTED_DEVICE_TYPE_PANEL,
  INACTIVE_DEVICE_TYPE_PANEL,
  STATE
} from '@constants/index'
import {
  API_GET_DEVICE_TYPE_PANELS,
  API_POST_DEVICE_TYPE_PANEL,
  API_PUT_DEVICE_TYPE_PANEL
} from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getDeviceTypePanels = params => {
  return async dispatch => {
    await axios.get(API_GET_DEVICE_TYPE_PANELS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_DEVICE_TYPE_PANELS,
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
export const getAllDeviceTypePanels = params => {
  return async dispatch => {
    await axios.get(API_GET_DEVICE_TYPE_PANELS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_DEVICE_TYPE_PANELS,
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

// ** Add new device type panel
export const addDeviceTypePanel = (panel, params) => {
  return async dispatch => {
    await axios.post(API_POST_DEVICE_TYPE_PANEL, { ...panel, state: STATE.ACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: ADD_DEVICE_TYPE_PANEL,
          panel: response.data.data
        })
        dispatch(getDeviceTypePanels(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Set selected panel
export const setSelectedPanel = (panel) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_DEVICE_TYPE_PANEL,
      panel
    })
  }
}

// ** Edit panel
export const editDeviceTypePanel = (panel, params) => {
  return async dispatch => {
    await axios.put(API_PUT_DEVICE_TYPE_PANEL, panel).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: EDIT_DEVICE_TYPE_PANEL,
          panel: response.data.data
        })
        dispatch(getDeviceTypePanels(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Inactivate panel data by ID
export const inactivatePanel = (id, params) => {
  return async dispatch => {
    await axios.put(API_PUT_DEVICE_TYPE_PANEL, { id, state: STATE.INACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: INACTIVE_DEVICE_TYPE_PANEL,
          id
        })
        dispatch(getDeviceTypePanels(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}