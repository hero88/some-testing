import { ROWS_PER_PAGE_DEFAULT } from '@constants/index'
import { FETCH_COMPANY_REQUEST, SET_OPERATION_UNIT_PARAMS, SET_SELECTED_OPERATION_UNIT } from '@constants/actions'

// ** Initial State
const initialState = {
  data: [],
  total: 0,
  selectedCompany: {},
  params: {
    pagination: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      currentPage: 1
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMPANY_REQUEST:
      return {
        ...state,
        data: action?.data ? action.data : state.data,
        params: action.params,
        total: action.total
      }
    case SET_SELECTED_OPERATION_UNIT:
      return {
        ...state,
        selectedCompany: action.payload
      }
    case SET_OPERATION_UNIT_PARAMS:
      return {
        ...state,
        params: action.payload
      }
    default:
      return state
  }
}

export default reducer
