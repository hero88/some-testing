import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_METERS,
  INACTIVATE_METER,
  ADD_METER,
  EDIT_METER,
  SET_SELECTED_METER,
  GET_METER_BY_ID,
  SET_METER_DATA,
  ACTIVATE_METER,
  ROWS_PER_PAGE_DEFAULT,
  LOGOUT
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
  selectedMeter: null
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_METERS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total ? action.total : state.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_METER_BY_ID:
      return {
        ...state,
        selectedMeter: action.meter
      }
    case INACTIVATE_METER: {
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
    case ACTIVATE_METER: {
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
    case ADD_METER: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.meter], [orders[0]], [orders[1]])

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
    case EDIT_METER: {
      const editedData = state.allData.map((data) => (data.id === action.meter.id ? { ...action.meter } : data))
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
    case SET_SELECTED_METER: {
      return {
        ...state,
        selectedMeter: action.meter
      }
    }
    case SET_METER_DATA: {
      return {
        ...state,
        data: action.meters,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
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
