import { ROWS_PER_PAGE_DEFAULT } from '@constants/index'
// haimn check
import { FETCH_USER_ROLE_REQUEST, RESET_USER_ROLE, SELECTED_ROLE } from '@constants/actions'

// ** Initial State
const initialState = {
  data: [],
  total: 0,
  selectedRole: {},
  params: {
    pagination: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      currentPage: 1
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_ROLE_REQUEST:
      return {
        ...state,
        data: action?.data ? action.data : state.data,
        total: action?.total ? action?.total : state.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
      case SELECTED_ROLE:
        return {
          ...state,
          selectedRole: action?.payload ? action?.payload : state?.payload
        }
      case RESET_USER_ROLE:
        return {
          ...state,
          params: action.payload
        }
    default:
      return state
  }
}

export default reducer
