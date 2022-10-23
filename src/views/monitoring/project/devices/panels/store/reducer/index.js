import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_PANELS,
  INACTIVATE_PANEL,
  ADD_PANEL,
  EDIT_PANEL,
  SET_SELECTED_PANEL,
  GET_PANEL_BY_ID,
  SET_PANEL_DATA,
  ACTIVATE_PANEL,
  ROWS_PER_PAGE_DEFAULT,
  LOGOUT,
  GET_PANEL_TYPES
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
  selectedPanel: null,
  types: []
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PANELS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total ? action.total : state.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_PANEL_BY_ID:
      return {
        ...state,
        selectedPanel: action.panel
      }
    case INACTIVATE_PANEL: {
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
    case ACTIVATE_PANEL: {
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
    case ADD_PANEL: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.panel], [orders[0]], [orders[1]])

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
    case EDIT_PANEL: {
      const editedData = state.allData.map((data) => (data.id === action?.panel?.id ? { ...action.panel } : data))
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
    case SET_SELECTED_PANEL: {
      return {
        ...state,
        selectedPanel: action.panel
      }
    }
    case SET_PANEL_DATA: {
      return {
        ...state,
        data: action.panels,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    case GET_PANEL_TYPES : {
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
