import axios from 'axios'
import {
  GET_PANELS,
  SET_SELECTED_PANEL,
  GET_PANEL_BY_ID,
  DEVICE_TYPE,
  SET_PANEL_DATA,
  ADD_PANEL,
  EDIT_PANEL,
  INACTIVATE_PANEL,
  ACTIVATE_PANEL,
  STATE,
  API_GET_PANEL_TYPES,
  GET_PANEL_TYPES
} from '@constants/index'
import {
  API_DELETE_PANEL,
  API_GET_PANEL,
  API_GET_PANELS,
  API_POST_PANEL,
  API_PUT_PANEL
} from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getPanels = params => {
  return async dispatch => {
    await axios.get(API_GET_PANELS, {
      params: {
        ...params,
        typeDevice: DEVICE_TYPE.PANEL
      }
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_PANELS,
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
export const getAllPanels = params => {
  return async dispatch => {
    await axios.get(API_GET_PANELS, {
      params: {
        ...params,
        typeDevice: DEVICE_TYPE.PANEL
      }
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_PANELS,
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

// ** Get panel by ID
export const getPanelById = params => {
  return async dispatch => {
    await axios.get(API_GET_PANEL, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_PANEL_BY_ID,
          panel: response.data.data
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Add new panel
export const addPanel = (panel, params) => {
  return async dispatch => {
    await axios.post(API_POST_PANEL, {
      ...panel,
      typeDevice: DEVICE_TYPE.PANEL,
      state: STATE.ACTIVE
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: ADD_PANEL,
          panel: response.data.data
        })
        dispatch(getPanels({
          ...params,
          order: 'createDate desc'
        }))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Edit panel
export const editPanel = (panel, params) => {
  return async dispatch => {
    await axios.put(API_PUT_PANEL, {
      ...panel,
      typeDevice: DEVICE_TYPE.PANEL
    }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: EDIT_PANEL,
          panel: response.data.data
        })
        dispatch(getPanels(params))
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
      type: SET_SELECTED_PANEL,
      panel
    })
  }
}

// ** Remove panel data by ID
export const removePanel = (id, params) => {
  return async dispatch => {
    await axios.put(API_DELETE_PANEL, { id, state: STATE.INACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: INACTIVATE_PANEL,
          id
        })
        dispatch(getPanels(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Delete panel data by ID
export const deletePanel = ({ data, params, successCBFunc }) => {
  return async dispatch => {
    await axios.delete(API_DELETE_PANEL, { data }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        successCBFunc()
        dispatch(getPanels(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** reActivePanel
export const reActivePanel = (panel, params) => {
  return async dispatch => {
    await axios.put(API_PUT_PANEL, panel).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: ACTIVATE_PANEL,
          id: panel.id
        })
        dispatch(getPanels(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Set panel data
export const setPanelData = (panels, params, total) => {
  return dispatch => {
    dispatch({
      type: SET_PANEL_DATA,
      panels,
      params,
      total
    })
  }
}

// ** Get panel (PV) type
export const getPanelTypes = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_PANEL_TYPES, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_PANEL_TYPES,
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
