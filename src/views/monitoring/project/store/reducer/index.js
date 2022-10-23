import { GET_SENSOR } from '@constants/index'
// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    page: 1,
    order: 'createDate desc',
    state: 'ACTIVE'
  },
  allData: [],
  selectedInverter: null
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SENSOR:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }

    default:
      return state
  }
}

export default DataTablesReducer
