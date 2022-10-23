import _orderBy from 'lodash/orderBy'
import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_USERS,
  INACTIVATE_USER,
  ADD_USER,
  EDIT_USER,
  SET_SELECTED_USER,
  GET_USER_BY_ID,
  SORT_USERS,
  SET_USER_DATA,
  ACTIVATE_USER,
  ROWS_PER_PAGE_DEFAULT,
  GET_USERS_ACTIVITIES,
  GET_USERS_ACTIVITIES_REPORT
} from '@constants/index'
import { filterData } from '@utils'

// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    order: 'createDate desc',
    state: '*',
    fk: '["customers", "projects", "group"]'
  },
  paramsActivities: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    state: '*',
    fk: '*'
  },
  allData: [],
  activitiesData: [],
  selectedUser: null,
  activitiesDataReportData: []
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        allData: action?.allData ? action.allData : state.allData,
        data: action?.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_USER_BY_ID:
      return {
        ...state,
        selectedUser: action.user
      }
    case INACTIVATE_USER: {
      const allDataResult = state.allData.map((item) => (item.id === action.id ? { ...item, activated: false } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(
          filterData({
            data: allDataResult,
            params: state.params,
            searchKeys: ['username', 'fullName', 'phones']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case ACTIVATE_USER: {
      const allDataResult = state.allData.map((item) => (item.id === action.id ? { ...item, activated: true } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(
          filterData({
            data: allDataResult,
            params: state.params,
            searchKeys: ['username', 'fullName', 'phones']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case ADD_USER: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.user], [orders[0]], [orders[1]])

      return {
        ...state,
        allData: newData,
        data: paginateArray(
          filterData({
            data: newData,
            params: state.params,
            searchKeys: ['username', 'fullName', 'phones']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case EDIT_USER: {
      const editedData = state.allData.map((data) => (data.id === action.user.id ? { ...action.user } : data))

      return {
        ...state,
        allData: editedData,
        data: paginateArray(
          filterData({
            data: editedData,
            params: state.params,
            searchKeys: ['username', 'fullName', 'phones']
          }),
          state?.params?.rowsPerPage,
          state?.params?.page
        )
      }
    }
    case SET_SELECTED_USER: {
      return {
        ...state,
        selectedUser: action.user
      }
    }
    case SORT_USERS: {
      return {
        ...state,
        data: action.users
      }
    }
    case SET_USER_DATA: {
      return {
        ...state,
        data: action.users,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    case GET_USERS_ACTIVITIES:
      return {
        ...state,
        allData: action?.allData ? action.allData : state.allData,
        activitiesData: action?.data ? action.data : state.data,
        totalActivities: action.total,
        paramsActivities: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_USERS_ACTIVITIES_REPORT:
      return {
        ...state,
        activitiesDataReportData: action?.data ? action.data : state.data
      }
    default:
      return state
  }
}

export default DataTablesReducer
