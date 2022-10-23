import { ROWS_PER_PAGE_DEFAULT } from '@constants/index'
import { FETCH_CUSTOMERS_REQUEST, SET_CUSTOMER_PARAMS, SET_SELECTED_BILLING_CUSTOMER } from '@constants/actions'
import { cloneDeep } from 'lodash'

// ** Initial State
const initialState = {
  data: [],
  total: 0,
  params: {
    pagination: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      currentPage: 1
    }
  },
  selectedCustomer: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CUSTOMERS_REQUEST:
      return {
        ...state,
        data: action?.data ? action.data : state.data,
        params: action.params,
        total: action.total
      }
    case SET_SELECTED_BILLING_CUSTOMER:
      return {
        ...state,
        selectedCustomer: cloneDeep(action.payload)
      }
    case SET_CUSTOMER_PARAMS:
      return {
        ...state,
        params: action.payload
      }
    default:
      return state
  }
}

export default reducer
