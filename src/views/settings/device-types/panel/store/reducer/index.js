import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_DEVICE_TYPE_PANELS,
  ADD_DEVICE_TYPE_PANEL,
  EDIT_DEVICE_TYPE_PANEL,
  SET_SELECTED_DEVICE_TYPE_PANEL,
  INACTIVE_DEVICE_TYPE_PANEL,
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
  selectedPanel: null
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DEVICE_TYPE_PANELS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }

    case INACTIVE_DEVICE_TYPE_PANEL: {
      const allDataResult = state.allData.map(item => (item.id === action.id ? { ...item, activated: false } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filterData({
          data: allDataResult,
          params: state.params,
          searchKeys: ['panelModel', 'manufacturer', 'ppv', 'spv', 'eff', 'ambTemp']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
  
    case ADD_DEVICE_TYPE_PANEL: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.panel], [orders[0]], [orders[1]])
      return {
        ...state,
        allData: newData,
        data: paginateArray(filterData({
          data: newData,
          params: state.params,
          searchKeys: ['panelModel', 'manufacturer', 'ppv', 'spv', 'eff', 'ambTemp']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    
    case EDIT_DEVICE_TYPE_PANEL: {
      const editedData = state.allData.map(data => (data.id === action.panel.id ? { ...action.panel } : data))
      return {
        ...state,
        allData: editedData,
        data: paginateArray(filterData({
          data: editedData,
          params: state.params,
          searchKeys: ['panelModel', 'manufacturer', 'ppv', 'spv', 'eff', 'ambTemp']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case SET_SELECTED_DEVICE_TYPE_PANEL: {
      return {
        ...state,
        selectedPanel: action.panel
      }
    }
    
    default:
      return state
  }
}

export default DataTablesReducer
