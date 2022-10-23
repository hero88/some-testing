import {
  GET_ACCOUNT_INFO,
  GET_GROUP,
  SET_IS_FETCHED_PERMISSION,
  SET_TOKEN_TIME_OUT,
  SET_USER_PERMISSIONS,
  UPDATE_ACCOUNT_AVATAR,
  UPDATE_ACCOUNT_INFO,
  UPDATE_ACCOUNT_INFO_FROM_SETTING,
  UPDATE_GENERAL_SETTING
} from '@constants/actions'
import { CO2_REDUCTION_RATE, SESSION_TIMEOUT, STANDARD_COAL_RATE, TREES_SAVED_RATE } from '@constants/common'

// **  Initial State
const initialState = {
  userData: {},
  sessionTimeout: false,
  interval: {},
  timeout: {},
  group: [],
  generalSetting: {
    language: 'vi',
    theme: 'dark',
    treesSavedRate: TREES_SAVED_RATE,
    co2ReductionRate: CO2_REDUCTION_RATE,
    standardCoalRate: STANDARD_COAL_RATE,
    sessionTimeout: SESSION_TIMEOUT
  },
  isFetchedPermision: false,
  isTokenTimeOut: false,
  permissions: []
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        userData: action.data,
        [action.config.storageTokenKeyName]: action[action.config.storageTokenKeyName],
        [action.config.storageRefreshTokenKeyName]: action[action.config.storageRefreshTokenKeyName],
        sessionTimeout: false
      }
    case 'LOGOUT': {
      const obj = { ...action }
      delete obj.type
      return { ...state, userData: {}, ...obj }
    }
    case GET_ACCOUNT_INFO:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: action.data
        },
        [action.config.storageTokenKeyName]: action[action.config.storageTokenKeyName],
        [action.config.storageRefreshTokenKeyName]: action[action.config.storageRefreshTokenKeyName]
      }
    case UPDATE_ACCOUNT_INFO:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: {
            ...state.userData?.user,
            ...action.data
          }
        }
      }
    case UPDATE_ACCOUNT_INFO_FROM_SETTING:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: {
            ...state.userData?.user,
            ...action.data
          }
        }
      }
    case UPDATE_ACCOUNT_AVATAR:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: {
            ...state.userData?.user,
            avatar: action.avatar,
            fileName: action.fileName
          }
        }
      }
    case GET_GROUP:
      return {
        ...state,
        group: action.group
      }
    case UPDATE_GENERAL_SETTING:
      return {
        ...state,
        generalSetting: {
          ...state.generalSetting,
          ...action.data
        }
      }
    case SET_TOKEN_TIME_OUT:
      return { ...state, isTokenTimeOut: action.value }
    case SET_USER_PERMISSIONS:
      return { ...state, permissions: action.payload }
    case SET_IS_FETCHED_PERMISSION:
      return { ...state, isFetchedPermision: action.payload }

    default:
      return state
  }
}

export default authReducer
