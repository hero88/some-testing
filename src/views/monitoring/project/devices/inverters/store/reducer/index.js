import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_INVERTERS,
  INACTIVATE_INVERTER,
  ADD_INVERTER,
  EDIT_INVERTER,
  SET_SELECTED_INVERTER,
  GET_INVERTER_BY_ID,
  SET_INVERTER_DATA,
  ACTIVATE_INVERTER,
  ROWS_PER_PAGE_DEFAULT,
  LOGOUT,
  GET_INVERTER_TYPES,
  SEND_COMMAND_TO_INVERTER
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
    order: 'name asc',
    state: '*'
  },
  allData: [],
  selectedInverter: null,
  types: []
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_COMMAND_TO_INVERTER:
      return {

      }
    case GET_INVERTERS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total ? action.total : state.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_INVERTER_BY_ID:
      return {
        ...state,
        selectedInverter: action.inverter
      }
    case INACTIVATE_INVERTER: {
      const allDataResult = state.allData.map((item) => (item.id === action.id ? { ...item, activated: false } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(
          filterData({
            data: allDataResult,
            params: state.params,
            searchKeys: ['name', 'serialNumber']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case ACTIVATE_INVERTER: {
      const allDataResult = state.allData.map((item) => (item.id === action.id ? { ...item, activated: true } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(
          filterData({
            data: allDataResult,
            params: state.params,
            searchKeys: ['name', 'serialNumber']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case ADD_INVERTER: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.inverter], [orders[0]], [orders[1]])

      return {
        ...state,
        allData: newData,
        data: paginateArray(
          filterData({
            data: newData,
            params: state.params,
            searchKeys: ['name', 'serialNumber']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case EDIT_INVERTER: {
      const editedData = state.allData.map((data) => (data.id === action.inverter.id ? { ...action.inverter } : data))
      return {
        ...state,
        allData: editedData,
        data: paginateArray(
          filterData({
            data: editedData,
            params: state.params,
            searchKeys: ['name', 'serialNumber']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case SET_SELECTED_INVERTER: {
      return {
        ...state,
        selectedInverter: action.inverter
      }
    }
    case SET_INVERTER_DATA: {
      return {
        ...state,
        data: action.inverters,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    case GET_INVERTER_TYPES: {
      return {
        ...state,
        types: action.data
      }
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

export default DataTablesReducer
