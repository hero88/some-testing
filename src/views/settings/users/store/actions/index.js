import axios from 'axios'
import {
  GET_USERS,
  SET_SELECTED_USER,
  GET_USER_BY_ID,
  SORT_USERS,
  SET_USER_DATA,
  EDIT_USER,
  ADD_USER,
  INACTIVATE_USER,
  ACTIVATE_USER,
  STATE,
  GET_USERS_ACTIVITIES,
  GET_USERS_ACTIVITIES_REPORT,
  API_DELETE_USER
} from '@constants/index'
import {
  API_GET_USER_INFO,
  API_GET_USERS,
  API_POST_USER_INFO,
  API_PUT_USER_INFO,
  API_GET_USERS_ACTIVITIES
} from '@constants/api'
import { showToast } from '@utils'
import { updateAccountInfoFromSetting } from '@store/actions/auth'

// ** Get table Data
export const getUsers = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_USERS, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_USERS,
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

// ** Get all data
export const getAllUsers = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_USERS, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_USERS,
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

// ** Get user by ID
export const getUserById = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_USER_INFO, params)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_USER_BY_ID,
            user: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', err.message)
      })
  }
}

// ** Add new project
export const addUser = (user, params) => {
  return async (dispatch) => {
    await axios
      .post(API_POST_USER_INFO, {
        ...user,
        state: STATE.ACTIVE
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)
          dispatch({
            type: ADD_USER,
            user: response.data.data
          })
        } else {
          throw new Error(response.data.message)
        }

        dispatch(getUsers({ ...params, state: '*' }))
      })
      .catch((err) => {
        showToast('error', err.message)
      })
  }
}

// ** Edit user
export const editUser = (user, params, userDataId, isNotReload) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_USER_INFO, {
        ...user
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          if (!isNotReload) {
            showToast('success', response.data.message)
            dispatch({
              type: EDIT_USER,
              user: response.data.data
            })
            if (user.id === userDataId) {
              dispatch(updateAccountInfoFromSetting(response.data.data))
            }

            dispatch(getUsers({ ...params, state: '*' }))
          }
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', err.message)
      })
  }
}

// ** Set selected user
export const setSelectedUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_USER,
      user
    })
  }
}

// ** Update customerId
export const updateRelativeUser = (user) => {
  return async () => {
    await axios.put(API_PUT_USER_INFO, {
      ...user
    })
  }
}

// ** Inactivate user data by ID
export const inactivateUser = (id, params) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_USER_INFO, { id, state: STATE.INACTIVE })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: INACTIVATE_USER,
            id
          })
        } else {
          throw new Error(response.data.message)
        }

        dispatch(getUsers({ ...params, state: '*' }))
      })
      .catch((err) => {
        showToast('error', err.message)
      })
  }
}

// ** Delete user data by ID
export const deleteUser = ({ data, params, successCBFunc }) => {
  return async dispatch => {
    await axios.delete(API_DELETE_USER, { data }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        successCBFunc()
        dispatch(getUsers(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** reActivateUser
export const reActivateUser = (user, params) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_USER_INFO, { ...user, state: STATE.ACTIVE })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: ACTIVATE_USER,
            id: user.id
          })

          dispatch(getUsers({ ...params, state: '*' }))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', err.message)
      })
  }
}

// ** Sort user
export const sortUsers = (users) => {
  return (dispatch) => {
    dispatch({
      type: SORT_USERS,
      users
    })
  }
}

// ** Set user data
export const setUserData = (users, params, total) => {
  return (dispatch) => {
    dispatch({
      type: SET_USER_DATA,
      users,
      params,
      total
    })
  }
}
// ** Get user activities data
export const getUsersActivities = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_USERS_ACTIVITIES, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_USERS_ACTIVITIES,
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

// ** Get user activities data to export
export const getReportUsersActivities = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_USERS_ACTIVITIES, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_USERS_ACTIVITIES_REPORT,
            data: response.data.data,
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
