import { ROWS_PER_PAGE_DEFAULT } from '@constants/index'
// haimn check
import { FETCH_ROOF_RENTAL_UNIT_REQUEST, SET_ROOF_RENTAL_UNIT_PARAMS, SET_SELECTED_ROOF_VENDOR } from '@constants/actions'

// ** Initial State
const initialState = {
  data: [],
  total: 0,
  selectedRoofVendor: {},
  params: {
    pagination: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      currentPage: 1
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ROOF_RENTAL_UNIT_REQUEST:
      return {
        ...state,
        data: action?.data ? action.data : state.data,
        total: action?.total ? action?.total : state.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case SET_SELECTED_ROOF_VENDOR:
      return {
        ...state,
        selectedRoofVendor: action.payload
      }
    case SET_ROOF_RENTAL_UNIT_PARAMS:
      return {
        ...state,
        params: action.payload
      }
    default:
      return state
  }
}

export default reducer
