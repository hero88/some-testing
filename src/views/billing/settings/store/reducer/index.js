import { ROWS_PER_PAGE_DEFAULT } from '@constants/index'
import {
  FETCH_SETTINGS_REQUEST,
  SET_BILLING_SETTING_PARAMS,
  SET_SELECTED_BILLING_SETTING,
  SET_SETTING_BY_CODE
} from '@constants/actions'

// ** Initial State
const initialState = {
  data: [],
  total: 0,
  selectedSetting: {},
  params: {
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    currentPage: 1
  },
  setting: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SETTINGS_REQUEST:
      return {
        ...state,
        data: action?.data ? action.data : state.data,
        params: action.params,
        total: action.total
      }
    case SET_SELECTED_BILLING_SETTING:
      return {
        ...state,
        selectedSetting: action.payload
      }
    case SET_BILLING_SETTING_PARAMS:
      return {
        ...state,
        params: action.payload
      }
    case SET_SETTING_BY_CODE:
      return {
        ...state,
        setting: {
          ...state.setting,
          [action.key]: action.payload
        }
      }
    default:
      return state
  }
}

export default reducer
