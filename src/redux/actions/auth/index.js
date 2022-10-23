// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import {
  GET_ACCOUNT_INFO,
  GET_GROUP,
  SET_USER_PERMISSIONS,
  UPDATE_ACCOUNT_AVATAR,
  UPDATE_ACCOUNT_INFO,
  UPDATE_ACCOUNT_INFO_FROM_SETTING
} from '@constants/actions'
import axios from 'axios'
import {
  API_GET_GROUP,
  API_PERMISSIONS_BY_USER,
  API_POST_MEDIA,
  API_PUT_USER_INFO,
  API_RESET_PASSWORD
} from '@constants/api'
import { showToast } from '@utils'
import { deleteToken } from '@src/firebase'

const config = useJwt.jwtConfig

// ** Handle User Login
export const handleLogin = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN',
      data,
      config,
      [config.storageTokenKeyName]: data[config.storageTokenKeyName],
      [config.storageRefreshTokenKeyName]: data[config.storageRefreshTokenKeyName]
    })

    // ** Add to user, accessToken & refreshToken to localStorage
    localStorage.setItem('userData', JSON.stringify(data.user))
    localStorage.setItem(config.storageTokenKeyName, JSON.stringify(data.accessToken))
    localStorage.setItem(config.storageRefreshTokenKeyName, JSON.stringify(data.refreshToken))
    localStorage.setItem('loginTime', Date.now().toString())
    localStorage.setItem('rememberMe', data.rememberMe)
  }
}

// ** Handle User Logout
export const handleLogout = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'LOGOUT',
      [config.storageTokenKeyName]: null,
      [config.storageRefreshTokenKeyName]: null,
      ...data
    })

    // ** Remove user, accessToken & refreshToken from localStorage
    localStorage.removeItem('userData')
    localStorage.removeItem(config.storageTokenKeyName)
    localStorage.removeItem(config.storageRefreshTokenKeyName)

    // ** Delete firebase token
    deleteToken()
  }
}

export const getAccountInfo = (data) => {
  return (dispatch) => {
    dispatch({
      type: GET_ACCOUNT_INFO,
      data,
      config,
      [config.storageTokenKeyName]: localStorage.getItem(config.storageTokenKeyName),
      [config.storageRefreshTokenKeyName]: localStorage.getItem(config.storageRefreshTokenKeyName)
    })
  }
}

export const updateAccountInfoFromSetting = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_ACCOUNT_INFO_FROM_SETTING,
      data
    })
  }
}

export const updateAccountInfo = (data) => {
  return async (dispatch) => {
    axios
      .put(API_PUT_USER_INFO, data)
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)
          dispatch({
            type: UPDATE_ACCOUNT_INFO,
            data: response.data.data
          })
          localStorage.setItem('userData', JSON.stringify(response.data.data))
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const uploadAvatar = (data) => {
  return async (dispatch) => {
    await axios
      .post(API_POST_MEDIA, data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data && response.data.data[0]) {
          dispatch({
            type: UPDATE_ACCOUNT_AVATAR,
            avatar: response.data.data[0].url,
            fileName: response.data.data[0].fileName
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

export const resetPassword = (data) => {
  return async () => {
    await axios
      .post(API_RESET_PASSWORD, data)
      .then((response) => {
        if (response.data && response.data.status && response.data.message) {
          showToast('success', response.data.message)
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const getGroup = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_GROUP, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.message) {
          dispatch({
            type: GET_GROUP,
            group: response.data.data
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
export const getPermissionsbyUserId = ({ callback }) => {
  return async (dispatch) => {
    await axios
      .get(API_PERMISSIONS_BY_USER)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const resData = response.data.data

          dispatch({
            type: SET_USER_PERMISSIONS,
            payload: resData?.role?.permissions || []
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        dispatch({
          type: SET_USER_PERMISSIONS,
          payload: []
        })
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })

    callback?.()
  }
}
