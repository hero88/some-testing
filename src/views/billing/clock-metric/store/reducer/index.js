import { ROWS_PER_PAGE_DEFAULT } from '@constants/index'
import { FETCH_METER_METRIC_REQUEST, FETCH_METER_REQUEST, RESET_DATA_METER_METRIC_REQUEST } from '@constants/actions'

// ** Initial State
const initialState = {
  data: [],
  meterMetric: [],
  total: 0,
  params: {
    pagination: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      currentPage: 1
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_METER_REQUEST:
      return {
        ...state,
        data: action?.payload?.data ? action.payload.data : state.data
      }
    case FETCH_METER_METRIC_REQUEST:
      return {
        ...state,
        meterMetric: action?.data ? action?.data : state.data,
        params: action?.payload,
        total: action?.totalRow
      }
    case RESET_DATA_METER_METRIC_REQUEST:
      return {
        ...state,
        params: action.payload,
        meterMetric: []
      }
    default:
      return state
  }
}

export default reducer
