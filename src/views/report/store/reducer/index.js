import {
  ROWS_PER_PAGE_DEFAULT,
  GET_PROJECTS_QUANTITY_REPORT,
  GET_PROJECTS_OPERATIONAL_REPORT, GET_GENERAL_REPORT, CLEAR_GENERAL_REPORT, CLEAR_OPERATION_REPORT, CLEAR_YIELD_REPORT
} from '@constants/index'

// ** Initial State
const initialState = {
  data: [],
  summaryData: {},
  total: 1,
  params: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT
    // state: '*',
    // fk: '["customers", "projects", "group"]'
  },
  allData: [],
  dataOR: [],
  summaryDataOR: {},
  totalOR: 1,
  paramsOR: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    fromDate: '',
    toDate: '',
    projectIds: ''
  },
  generalReportData: [],
  generalReportParam: {
    page: 1,
    rowsPerPage: ROWS_PER_PAGE_DEFAULT,
    fromDate: '',
    toDate: '',
    projectIds: ''
  },
  generalReportTotal: 1
}

const ReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECTS_QUANTITY_REPORT:
      return {
        ...state,
        allData: action?.allData ? action.allData : state.allData,
        data: action?.data ? action.data : state.data,
        total: action.total,
        params: action.params ? { ...state.params, ...action.params } : state.params,
        summaryData: action.summaryData,
        summaryYearData: action.summaryYearData
      }
    case GET_PROJECTS_OPERATIONAL_REPORT:
      return {
        ...state,
        dataOR: action?.data ? action.data : state.dataOR,
        totalOR: action?.total ? action.total : state.totalOR,
        paramsOR: action.params ? { ...state.paramsOR, ...action.params } : state.paramsOR,
        summaryDataOR: action.summaryDataOR
      }
    case GET_GENERAL_REPORT:
      return {
        ...state,
        generalReportData: action?.data ? action.data : state.generalReportData,
        generalReportTotal: action?.total ? action.total : state.generalReportTotal,
        generalReportParam: action.params ? { ...state.generalReportParam, ...action.params } : state.generalReportParam
      }
    case CLEAR_OPERATION_REPORT:
      return {
        ...state,
        dataOR: action.data || []
      }
    case CLEAR_YIELD_REPORT:
      return {
        ...state,
        data: action.data || []
      }
    case CLEAR_GENERAL_REPORT:
      return {
        ...state,
        generalReportData: action.data || []
      }
    default:
      return state
  }
}

export default ReportReducer
