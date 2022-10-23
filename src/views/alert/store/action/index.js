// ** Get table Data
import axios from 'axios'
import {
  API_GET_ALERT_NOTES,
  API_GET_ALERTS,
  API_POST_ALERT_NOTE,
  API_POST_ALERTS,
  API_PUT_ALERTS
} from '@constants/api'
import {
  GET_ALERT_NOTES,
  GET_ALERTS, GET_ALERTS_FOR_INVERTER_PANEL,
  GET_HISTORY_ALERTS,
  GET_NOTIFICATIONS,
  MARK_ALL_READ,
  MARK_AS_READ,
  UPDATE_FIREBASE_MESSAGE
} from '@constants/actions'
import { showToast } from '@utils'
import { STATE } from '@constants/common'

export const getAlerts = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALERTS, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_ALERTS,
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

export const getAlertsForInverterPanel = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALERTS, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_ALERTS_FOR_INVERTER_PANEL,
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

export const getHistoryAlerts = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALERTS, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_HISTORY_ALERTS,
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

export const updateAlertById = ({ data, params, isHistory }) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_ALERTS, data)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          if (isHistory) {
            dispatch(getHistoryAlerts(params))
          } else {
            dispatch(getAlerts(params))
          }
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const updateFirebaseMessages = ({ data }) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_FIREBASE_MESSAGE,
      data
    })
  }
}

export const markAllReadFirebaseMessages = ({ data }) => {
  return (dispatch) => {
    dispatch({
      type: MARK_ALL_READ,
      data
    })
  }
}

export const markAsReadMessageById = ({ id }) => {
  return (dispatch) => {
    dispatch({
      type: MARK_AS_READ,
      data: { id }
    })
  }
}

export const getNotifications = ({ params }) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALERTS, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_NOTIFICATIONS,
            data: response.data.data,
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

export const markAsRead = ({ data }) => {
  return async (dispatch) => {
    await axios
      .post(API_POST_ALERTS, data)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch(markAllReadFirebaseMessages({ data: [] }))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const getAlertNotes = ({ params }) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALERT_NOTES, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_ALERT_NOTES,
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

export const addAlertNote = ({ data }) => {
  return async (dispatch) => {
    await axios
      .post(API_POST_ALERT_NOTE, data)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch(getAlertNotes({
            state: [STATE.ACTIVE].toString(),
            rowsPerPage: -1
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
