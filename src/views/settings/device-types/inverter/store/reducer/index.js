import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_DEVICE_TYPE_INVERTERS,
  ADD_DEVICE_TYPE_INVERTER,
  EDIT_DEVICE_TYPE_INVERTER,
  SET_SELECTED_DEVICE_TYPE_INVERTER,
  INACTIVE_DEVICE_TYPE_INVERTER,
  ROWS_PER_PAGE_DEFAULT
} from '@constants/index'
import _orderBy from 'lodash/orderBy'
import { filterData } from '@utils'

// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    order: 'createDate desc',
    state: 'ACTIVE'
  },
  allData: [],
  selectedInverter: null
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DEVICE_TYPE_INVERTERS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }

    case INACTIVE_DEVICE_TYPE_INVERTER: {
      const allDataResult = state.allData.map(item => (item.id === action.id ? { ...item, activated: false } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filterData({
          data: allDataResult,
          params: state.params,
          searchKeys: ['inverterModel', 'manufacturer', 'power', 'numberOfMPPT', 'numberOfStringPerMPPT']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }

    case ADD_DEVICE_TYPE_INVERTER: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.inverter], [orders[0]], [orders[1]])
      return {
        ...state,
        allData: newData,
        data: paginateArray(filterData({
          data: newData,
          params: state.params,
          searchKeys: ['inverterModel', 'manufacturer', 'power', 'numberOfMPPT', 'numberOfStringPerMPPT']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    
    case EDIT_DEVICE_TYPE_INVERTER: {
      const editedData = state.allData.map(data => (data.id === action.inverter.id ? { ...action.inverter } : data))
      return {
        ...state,
        allData: editedData,
        data: paginateArray(filterData({
          data: editedData,
          params: state.params,
          searchKeys: ['inverterModel', 'manufacturer', 'power', 'numberOfMPPT', 'numberOfStringPerMPPT']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    
    case SET_SELECTED_DEVICE_TYPE_INVERTER: {
      return {
        ...state,
        selectedInverter: action.inverter
      }
    }

    default:
      return state
  }
}

export default DataTablesReducer
