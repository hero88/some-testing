import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_INVERTERS,
  INACTIVATE_INVERTER,
  ADD_INVERTER,
  EDIT_INVERTER,
  SET_SELECTED_INVERTER,
  GET_INVERTER_BY_ID,
  SET_DEVICE_DATA,
  ROWS_PER_PAGE_DEFAULT, GET_DEVICES
} from '@constants/index'

// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    order: 'serialNumber asc',
    state: '*'
  },
  allData: [],
  selectedDevice: null,
  devices: []
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INVERTERS:
      return {
        ...state,
        allData: action.allData,
        data: action.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_INVERTER_BY_ID:
      return {
        ...state,
        selectedInverter: action.inverter
      }
    case INACTIVATE_INVERTER: {
      const { q = '', perPage = 10, page = 1 } = state.params
      const queryLowered = q.toLowerCase()
      const allDataResult = state.allData.filter(item => item.id !== action.projectId)
      const filteredData = allDataResult.filter(
        item =>
          /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
          item.id.toLowerCase().includes(queryLowered) ||
          item.name.toLowerCase().includes(queryLowered) ||
          item.inverter.toLowerCase().includes(queryLowered) ||
          item.investor.toLowerCase().includes(queryLowered) ||
          item.address.toLowerCase().includes(queryLowered) ||
          item.phone.toLowerCase().includes(queryLowered)
      )

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filteredData, perPage, page)
      }
    }
    case ADD_INVERTER: {
      const newData = [...state.allData, action.project]

      return {
        ...state,
        allData: newData,
        data: paginateArray(newData, state.params.perPage, state.params.page)
      }
    }
    case EDIT_INVERTER: {
      const editedData = state.allData.map(data => (data.id === action.project.id ? { ...action.project } : data))
      return {
        ...state,
        allData: editedData,
        data: paginateArray(editedData, state.params.perPage, state.params.page)
      }
    }
    case SET_SELECTED_INVERTER: {
      return {
        ...state,
        selectedInverter: action.inverter
      }
    }
    case SET_DEVICE_DATA: {
      return {
        ...state,
        data: action.devices,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    case GET_DEVICES: {
      return {
        ...state,
        devices: action.data
      }
    }
    default:
      return state
  }
}

export default DataTablesReducer
