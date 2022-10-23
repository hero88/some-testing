import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_SETTINGS_PROJECTS,
  INACTIVATE_SETTINGS_PROJECT,
  ADD_SETTINGS_PROJECT,
  EDIT_SETTINGS_PROJECT,
  SORT_PROJECTS,
  SET_SETTINGS_SELECTED_PROJECT,
  SET_SETTINGS_PROJECT_DATA,
  ACTIVATE_SETTINGS_PROJECT,
  ROWS_PER_PAGE_DEFAULT,
  GET_SETTINGS_AUTO_PROJECTS,
  PENDING_STATUS,
  GET_SETTINGS_PENDING_APPROVE_PROJECTS,
  GET_SETTING_TOTAL_REQUESTS
} from '@constants/index'
import _orderBy from 'lodash/orderBy'
import { filterData } from '@utils'

// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    order: 'createDate desc',
    state: '*',
    pending: JSON.stringify([PENDING_STATUS.NORMAL, PENDING_STATUS.ADD, PENDING_STATUS.DELETE])
  },
  allData: [],
  selectedProject: {},
  autoCreateProject: {
    data: [],
    total: 1,
    params: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      order: 'createDate desc',
      state: '*'
    },
    allData: []
  },
  pendingProject: {
    data: [],
    total: 1,
    params: {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      order: 'createDate desc',
      state: '*'
    },
    allData: []
  }
}

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS_PROJECTS:
      return {
        ...state,
        allData: action.allData ? action.allData : state.allData,
        data: action.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case INACTIVATE_SETTINGS_PROJECT: {
      const allDataResult = state.allData.map(item => (item.id === action.id ? { ...item, activated: false } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filterData({
          data: allDataResult,
          params: state.params,
          searchKeys: ['name', 'investor', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case ACTIVATE_SETTINGS_PROJECT: {
      const allDataResult = state.allData.map(item => (item.id === action.id ? { ...item, activated: true } : item))

      return {
        ...state,
        allData: allDataResult,
        data: paginateArray(filterData({
          data: allDataResult,
          params: state.params,
          searchKeys: ['name', 'investor', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case ADD_SETTINGS_PROJECT: {
      const orders = state?.params?.order.split(' ')
      const newData = _orderBy([...state.allData, action.project], [orders[0]], [orders[1]])

      return {
        ...state,
        allData: newData,
        data: paginateArray(filterData({
          data: newData,
          params: state.params,
          searchKeys: ['name', 'investor', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case EDIT_SETTINGS_PROJECT: {
      const editedData = state.allData.map(data => (data.id === action.project.id ? { ...action.project } : data))

      return {
        ...state,
        allData: editedData,
        data: paginateArray(filterData({
          data: editedData,
          params: state.params,
          searchKeys: ['name', 'investor', 'phones', 'locations']
        }), state?.params?.rowsPerPage, state?.params?.page)
      }
    }
    case SORT_PROJECTS:
      return {
        ...state,
        data: action.projects
      }
    case SET_SETTINGS_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: action.project
      }
    case SET_SETTINGS_PROJECT_DATA: {
      return {
        ...state,
        data: action.projects,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }
    case GET_SETTINGS_AUTO_PROJECTS: {
      return {
        ...state,
        autoCreateProject: {
          ...state.autoCreateProject,
          allData: action.allData,
          data: action.data,
          total: action.total,
          params: action.params ? { ...state.params, ...action.params } : state.params
        }
      }
    }
    case GET_SETTINGS_PENDING_APPROVE_PROJECTS: {
      return {
        ...state,
        pendingProject: {
          ...state.pendingProject,
          data: action.data,
          total: action.total,
          params: action.params ? { ...state.params, ...action.params } : state.params
        }
      }
    }
    case GET_SETTING_TOTAL_REQUESTS: {
      return {
        ...state,
        pendingProject: {
          ...state.pendingProject,
          total: action.total
        }
      }
    }
    default:
      return state
  }
}

export default DataTablesReducer
