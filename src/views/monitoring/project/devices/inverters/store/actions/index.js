import axios from 'axios'
import {
  GET_INVERTERS,
  SET_SELECTED_INVERTER,
  GET_INVERTER_BY_ID,
  DEVICE_TYPE,
  SET_INVERTER_DATA,
  STATE,
  API_GET_INVERTER_TYPES,
  GET_INVERTER_TYPES
} from '@constants/index'
import {
  API_DELETE_INVERTER,
  API_GET_INVERTER,
  API_GET_INVERTERS,
  API_POST_INVERTER,
  API_PUT_INVERTER,
  API_SEND_COMMAND_TO_INVERTER
} from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getInverters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_INVERTERS, {
        params: {
          ...params,
          typeDevice: DEVICE_TYPE.INVERTER
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_INVERTERS,
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
export const getAllInverters = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_INVERTERS, {
        params: {
          ...params,
          typeDevice: DEVICE_TYPE.INVERTER
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_INVERTERS,
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
export const getInverterById = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_INVERTER, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_INVERTER_BY_ID,
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

// ** Add new inverter
export const addInverter = (inverter, params) => {
  return async (dispatch) => {
    await axios
      .post(API_POST_INVERTER, {
        ...inverter,
        typeDevice: DEVICE_TYPE.INVERTER,
        state: STATE.ACTIVE
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)
          dispatch(
            getInverters({
              ...params,
              order: 'createDate desc'
            })
          )
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Edit inverter
export const editInverter = (inverter, params) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_INVERTER, {
        ...inverter,
        typeDevice: DEVICE_TYPE.INVERTER
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)
          dispatch(getInverters(params))
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
export const setSelectedInverter = (inverter) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_INVERTER,
      inverter
    })
  }
}

// ** Remove inverter data by ID
export const removeInverter = (id, params) => {
  return async (dispatch) => {
    await axios
      .put(API_DELETE_INVERTER, { id, state: STATE.INACTIVE })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch(getInverters(params))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Delete inverter data by ID
export const deleteInverter = ({ data, params, successCBFunc }) => {
  return async (dispatch) => {
    await axios
      .delete(API_DELETE_INVERTER, { data })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          successCBFunc()
          dispatch(getInverters(params))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** reActiveInverter
export const reActiveInverter = (inverter, params) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_INVERTER, inverter)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch(getInverters(params))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Set inverter data
export const setInverterData = (inverters, params, total) => {
  return (dispatch) => {
    dispatch({
      type: SET_INVERTER_DATA,
      inverters,
      params,
      total
    })
  }
}

// ** Get inverter type
export const getInverterTypes = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_INVERTER_TYPES, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_INVERTER_TYPES,
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

// ** Send commands to inverters
export const sendCommandToInverters = (inverter, params) => {
  return async (dispatch) => {
    await axios
      .post(API_SEND_COMMAND_TO_INVERTER, {
        ...inverter
      })
      .then((response) => {
        if (response.data && response.data.data) {
          showToast('success', response.data.commandExecutionStatus)
          dispatch(getInverters(params))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}
