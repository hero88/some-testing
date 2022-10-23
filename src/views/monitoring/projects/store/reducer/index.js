import { paginateArray } from '@src/@fake-db/utils'
import {
  GET_PROJECTS,
  REMOVE_PROJECT,
  ADD_PROJECT,
  EDIT_PROJECT,
  GET_WEATHER_INFO,
  SET_SELECTED_PROJECT,
  GET_PROJECT_BY_ID,
  GET_ALL_PROJECTS,
  SET_PROJECT_DATA,
  LOGOUT,
  GET_ELECTRICITY,
  GET_INDUSTRIAL_AREAS,
  GET_INVESTORS,
  GET_PROJECT_MONITORING,
  ADD_CHART_PARAM,
  REMOVE_CHART_PARAM,
  CHANGE_CHART_DATE_PICKER,
  GET_PROJECT_CHART_DATA,
  CHANGE_CHART_TYPE,
  GET_CHART_FILTER_TEMPLATE,
  UPDATE_CURRENT_CHART_TEMPLATE,
  RESET_CHART_FILTER,
  ROWS_PER_PAGE_DEFAULT
} from '@constants/index'
import moment from 'moment'

// ** Initial State
const initialState = {
  data: [],
  summaryData: {},
  total: 1,
  params: {
    rowsPerPage: ROWS_PER_PAGE_DEFAULT
  },
  allData: [],
  weather: null,
  selectedProject: {},
  electricity: [],
  industrialAreas: [],
  investors: [],
  projectMonitoring: {},
  chart: {
    dataObj: {},
    paramData: [],
    fromDate: moment().startOf('d').format('YYYY-MM-DD'),
    toDate: moment().endOf('d').format('YYYY-MM-DD'),
    seconds: 300,
    timeStep: 5,
    timeUnit: 'minutes',
    templates: [],
    currentTemplate: {}
  }
}

const ProjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECTS:
      return {
        ...state,
        data: action.data ? action.data : state.data,
        summaryData: action.summaryData ? action.summaryData : state.summaryData,
        total: action.total >= 0 ? action.total : state.total,
        params: action.params ? { ...state.params, ...action.params } : state.params
      }
    case GET_ALL_PROJECTS:
      return {
        ...state,
        allData: action.allData,
        total: action.total
      }
    case GET_PROJECT_BY_ID:
      return {
        ...state,
        selectedProject: action.project
      }
    case REMOVE_PROJECT: {
      const { q = '', perPage = 10, page = 1 } = state.params
      const queryLowered = q.toLowerCase()
      const allDataResult = state.allData.filter((item) => item.id !== action.projectId)
      const filteredData = allDataResult.filter(
        (item) =>
          /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
          item.id.toLowerCase().includes(queryLowered) ||
          item.name.toLowerCase().includes(queryLowered) ||
          item.customer.toLowerCase().includes(queryLowered) ||
          item.investor.toLowerCase().includes(queryLowered) ||
          item.address.toLowerCase().includes(queryLowered) ||
          item.phone.toLowerCase().includes(queryLowered)
      )

      return {
        ...state,
        allData: [...allDataResult],
        data: paginateArray(filteredData, perPage, page)
      }
    }
    case ADD_PROJECT: {
      const newData = [...state.allData, action.project]

      return {
        ...state,
        allData: newData,
        data: paginateArray(newData, state.params.perPage, state.params.page)
      }
    }
    case EDIT_PROJECT: {
      const editedData = state.allData.map((data) => (
        data.id === action.project.id ? { ...action.project } : data
      ))
      return {
        ...state,
        allData: editedData,
        data: paginateArray(editedData, state.params.perPage, state.params.page)
      }
    }

    case GET_WEATHER_INFO:
      return {
        ...state,
        weather: { ...action.payload }
      }

    case SET_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: { ...action.project }
      }

    case SET_PROJECT_DATA: {
      return {
        ...state,
        data: action.projects,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        total: action.total
      }
    }

    case GET_ELECTRICITY: {
      return {
        ...state,
        electricity: action.data
      }
    }

    case GET_INDUSTRIAL_AREAS: {
      return {
        ...state,
        industrialAreas: action.data
      }
    }

    case GET_INVESTORS: {
      return {
        ...state,
        investors: action.data
      }
    }

    case GET_PROJECT_MONITORING: {
      return {
        ...state,
        projectMonitoring: action.projectMonitoring
      }
    }

    case ADD_CHART_PARAM: {
      return {
        ...state,
        chart: {
          ...state.chart,
          paramData: [...state.chart.paramData, action.data]
        }
      }
    }

    case REMOVE_CHART_PARAM: {
      const currentParamIndex = state.chart.paramData.findIndex(param => param.paramId === action?.data?.paramId)
      const currentParamData = state.chart.paramData
      const currentChartData = state.chart.dataObj

      currentParamData.splice(currentParamIndex, 1)
      delete currentChartData[action.data.paramId]

      return {
        ...state,
        chart: {
          ...state.chart,
          paramData: [...currentParamData],
          dataObj: { ...currentChartData }
        }
      }
    }

    case CHANGE_CHART_DATE_PICKER: {
      return {
        ...state,
        chart: {
          ...state.chart,
          ...action.data
        }
      }
    }

    case CHANGE_CHART_TYPE: {
      const currentParamData = state.chart.paramData
      const currentParamIndex = currentParamData.findIndex(param => param.paramId === action?.data?.paramId)

      if (currentParamIndex > -1) {
        currentParamData[currentParamIndex] = action.data
      }

      return {
        ...state,
        chart: {
          ...state.chart,
          paramData: [...currentParamData]
        }
      }
    }

    case GET_PROJECT_CHART_DATA: {
      return {
        ...state,
        chart: {
          ...state.chart,
          dataObj: {
            ...state.chart.dataObj,
            ...action.data
          }
        }
      }
    }

    case GET_CHART_FILTER_TEMPLATE: {
      return {
        ...state,
        chart: {
          ...state.chart,
          templates: action.data
        }
      }
    }

    case UPDATE_CURRENT_CHART_TEMPLATE: {
      return {
        ...state,
        chart: {
          ...state.chart,
          currentTemplate: action.data,
          paramData: action?.data?.data
        }
      }
    }

    case RESET_CHART_FILTER: {
      return {
        ...state,
        chart: {
          dataObj: {},
          paramData: [],
          fromDate: moment().startOf('d').format('YYYY-MM-DD'),
          toDate: moment().endOf('d').format('YYYY-MM-DD'),
          seconds: 300,
          timeStep: 5,
          timeUnit: 'minutes',
          templates: [],
          currentTemplate: {}
        }
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

export default ProjectReducer
