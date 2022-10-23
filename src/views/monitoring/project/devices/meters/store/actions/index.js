import axios from 'axios'
import {
  GET_METERS,
  SET_SELECTED_METER,
  GET_METER_BY_ID,
  DEVICE_TYPE,
  SET_METER_DATA,
  ADD_METER,
  EDIT_METER,
  STATE
} from '@constants/index'
import { API_DELETE_METER, API_GET_METER, API_GET_METERS, API_POST_METER, API_PUT_METER } from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getMeters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_METERS, {
        params: {
          ...params,
          typeDevice: DEVICE_TYPE.METER
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_METERS,
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

// ** Get all Data
export const getAllMeters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_METERS, {
        params: {
          ...params,
          typeDevice: DEVICE_TYPE.METER
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_METERS,
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
export const getMeterById = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_METER, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_METER_BY_ID,
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

// ** Add new meter
export const addMeter = (meter, params) => {
  return async (dispatch) => {
    await axios
      .post(API_POST_METER, {
        ...meter,
        typeDevice: DEVICE_TYPE.METER,
        state: STATE.ACTIVE
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)
          dispatch({
            type: ADD_METER,
            meter: response.data.data
          })
          dispatch(getMeters({
            ...params,
            order: 'createDate desc'
          }))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Edit meter
export const editMeter = (meter, params) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_METER, {
        ...meter,
        typeDevice: DEVICE_TYPE.METER
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)
          dispatch({
            type: EDIT_METER,
            meter: response.data.data
          })
          dispatch(getMeters(params))
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
export const setSelectedMeter = (meter) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_METER,
      meter
    })
  }
}

// ** Remove meter data by ID
export const removeMeter = (id, params) => {
  return async (dispatch) => {
    await axios
      .put(API_DELETE_METER, { id, state: STATE.INACTIVE })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch(getMeters(params))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Delete meter data by ID
export const deleteMeter = ({ data, params, successCBFunc }) => {
  return async dispatch => {
    await axios.delete(API_DELETE_METER, { data }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        successCBFunc()
        dispatch(getMeters(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** reActiveMeter
export const reActiveMeter = (meter, params) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_METER, meter)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch(getMeters(params))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Set meter data
export const setMeterData = (meters, params, total) => {
  return (dispatch) => {
    dispatch({
      type: SET_METER_DATA,
      meters,
      params,
      total
    })
  }
}
