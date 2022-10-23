// ** Initial State
import { ROWS_PER_PAGE_DEFAULT } from '@constants/common'
import {
  GET_ALERT_NOTES,
  GET_ALERTS, GET_ALERTS_FOR_INVERTER_PANEL,
  GET_HISTORY_ALERTS,
  GET_NOTIFICATIONS,
  LOGOUT,
  MARK_ALL_READ,
  MARK_AS_READ,
  UPDATE_FIREBASE_MESSAGE
} from '@constants/actions'

const initialState = {
  active: {
    data: [],
    total: 1,
    params: {
      page: 1,
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      order: 'createDate desc',
      state: '*',
      fk: '["users", "devices"]'
    },
    allData: [],
    firebaseMessages: []
  },
  history: {
    data: [],
    total: 1,
    params: {
      page: 1,
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      order: 'createDate desc',
      state: '*',
      fk: '["users", "devices"]'
    },
    allData: []
  },
  activeAlertForInverter: {
    data: [],
    total: 1,
    params: {
      page: 1,
      rowsPerPage: 20,
      order: 'createDate desc',
      state: '*',
      fk: '["users", "devices"]'
    },
    allData: [],
    firebaseMessages: []
  },
  alertNotes: []
}

const AlertReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALERTS:
      return {
        ...state,
        active: {
          ...state.active,
          allData: action?.allData ? action.allData : state.active.allData,
          data: action?.data ? action.data : state.active.data,
          total: action.total,
          params: action.params ? { ...state.active.params, ...action.params } : state.active.params
        }
      }

    case GET_ALERTS_FOR_INVERTER_PANEL:
      return {
        ...state,
        activeAlertForInverter: {
          ...state.active,
          allData: action?.allData ? action.allData : state.activeAlertForInverter.allData,
          data: action?.data ? action.data : state.activeAlertForInverter.data,
          total: action.total,
          params: action.params
                  ? { ...state.activeAlertForInverter.params, ...action.params }
                  : state.activeAlertForInverter.params
        }
      }

    case GET_HISTORY_ALERTS:
      return {
        ...state,
        history: {
          ...state.history,
          allData: action?.allData ? action.allData : state.history.allData,
          data: action?.data ? action.data : state.history.data,
          total: action.total,
          params: action.params ? { ...state.history.params, ...action.params } : state.history.params
        }
      }

    case UPDATE_FIREBASE_MESSAGE:
      return {
        ...state,
        active: {
          ...state.active,
          firebaseMessages: [action.data, ...state.active.firebaseMessages]
        }
      }

    case MARK_ALL_READ:
      return {
        ...state,
        active: {
          ...state.active,
          firebaseMessages: []
        }
      }

    case MARK_AS_READ: {
      const tempMessages = [...state.active.firebaseMessages]
      const foundMessageIndex = tempMessages.findIndex((item) => item.id === action?.data?.id)

      tempMessages.splice(foundMessageIndex, 1)

      return {
        ...state,
        active: {
          ...state.active,
          firebaseMessages: [...tempMessages]
        }
      }
    }

    case GET_NOTIFICATIONS:
      return {
        ...state,
        active: {
          ...state.active,
          firebaseMessages: action?.data ? action.data : state.active.firebaseMessages,
          total: action.total
        }
      }

    case GET_ALERT_NOTES:
      return {
        ...state,
        alertNotes: action.data
      }

    case LOGOUT: {
      return {
        ...initialState
      }
    }

    default:
      return state
  }
}

export default AlertReducer
