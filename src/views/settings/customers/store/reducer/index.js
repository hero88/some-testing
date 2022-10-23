import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_CUSTOMERS,
  INACTIVATE_CUSTOMER,
  ADD_CUSTOMER,
  EDIT_CUSTOMER,
  SET_SELECTED_CUSTOMER,
  GET_CUSTOMER_BY_ID,
  SORT_CUSTOMERS,
  SET_CUSTOMER_DATA,
  ACTIVATE_CUSTOMER,
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
    state: '*'
  },
  allData: [],
  selectedCustomer: null
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMERS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_CUSTOMER_BY_ID:
      return {
        ...state,
        selectedCustomer: { ...action.customer }
      }
    case INACTIVATE_CUSTOMER: {
      const allDataResult = state.allData.map(item => (item.id === action.id ? { ...item, activated: false } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filterData({
          data: allDataResult,
          params: state.params,
          searchKeys: ['fullName', 'emails', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case ACTIVATE_CUSTOMER: {
      const allDataResult = state.allData.map(item => (item.id === action.id ? { ...item, activated: true } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filterData({
          data: allDataResult,
          params: state.params,
          searchKeys: ['fullName', 'emails', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case ADD_CUSTOMER: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.customer], [orders[0]], [orders[1]])

      return {
        ...state,
        allData: newData,
        data: paginateArray(filterData({
          data: newData,
          params: state.params,
          searchKeys: ['fullName', 'emails', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case EDIT_CUSTOMER: {
      const editedData = state.allData.map(data => (data.id === action.customer.id ? { ...action.customer } : data))

      return {
        ...state,
        allData: editedData,
        data: paginateArray(filterData({
          data: editedData,
          params: state.params,
          searchKeys: ['fullName', 'emails', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case SET_SELECTED_CUSTOMER: {
      return {
        ...state,
        selectedCustomer: action.customer
      }
    }
    case SORT_CUSTOMERS: {
      return {
        ...state,
        data: action.customers
      }
    }
    case SET_CUSTOMER_DATA: {
      return {
        ...state,
        data: action.customers,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    default:
      return state
  }
}

export default DataTablesReducer
