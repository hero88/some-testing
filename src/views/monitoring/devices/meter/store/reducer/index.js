import {
  GET_MONITORING_METERS,
  SET_SELECTED_MONITORING_METER,
  GET_MONITORING_METER_BY_ID,
  SET_MONITORING_METER_DATA,
  ROWS_PER_PAGE_DEFAULT
} from '@constants/index'

// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    order: 'createDate desc',
    state: '*'
  },
  allData: [],
  selectedMeter: null
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONITORING_METERS:
      return {
        ...state,
        allData: action?.allData ? action.allData : state.allData,
        data: action?.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_MONITORING_METER_BY_ID:
      return {
        ...state,
        selectedMeter: action.meter
      }
    case SET_SELECTED_MONITORING_METER: {
      return {
        ...state,
        selectedMeter: action.meter
      }
    }
    case SET_MONITORING_METER_DATA: {
      return {
        ...state,
        data: action.meters,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    default:
      return state
  }
}

export default DataTablesReducer
