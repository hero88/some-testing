import axios from 'axios'
import _orderBy from 'lodash/orderBy'
import {
  GET_PROJECTS_QUANTITY_REPORT,
  GET_PROJECTS_OPERATIONAL_REPORT,
  API_GET_GENERAL_REPORT,
  GET_GENERAL_REPORT, CLEAR_GENERAL_REPORT, CLEAR_OPERATION_REPORT, CLEAR_YIELD_REPORT
} from '@constants/index'
import { API_GET_PROJECTS_QUANTITY_REPORT, API_GET_PROJECTS_OPERATIONAL_REPORT } from '@constants/api'
import { showToast } from '@utils'

export const getProjectsReport = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_PROJECTS_QUANTITY_REPORT, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          const sumData = {
            projectId: 'projectTotalRow',
            totalYieldInverter: response.data?.summaryData?.totalYieldInverter || 0,
            totalYieldMeter: response.data?.summaryData?.totalYieldMeter || 0,
            totalYieldTheory: response.data?.summaryData?.totalYieldTheory || 0,
            diffTotalYieldInverterAndMeter: response.data?.summaryData?.diffTotalYieldInverterAndMeter || 0,
            totalYieldProduction: response.data?.summaryData?.totalYieldProduction || 0,
            saleToEVN: response.data?.summaryData?.saleToEVN || 0,
            saleToCustomer: response.data?.summaryData?.saleToCustomer || 0,
            performance: response.data?.summaryData?.performance || 0,
            cf: response.data?.summaryData?.cf || 0,
            sunshine: response.data?.summaryData?.sunshine || 0,
            pFromEvn: response.data?.summaryData?.pFromEvn || 0,
            qFromEvn: response.data?.summaryData?.qFromEvn || 0,
            cosphi: response.data?.summaryData?.cosphi || 0,
            fineCost: response.data?.summaryData?.fineCost || 0,
            totalYieldAtOffPeakHoursSolar: response.data?.summaryData?.totalYieldAtOffPeakHoursSolar || 0,
            totalYieldAtOffPeakHoursGrid: response.data?.summaryData?.totalYieldAtOffPeakHoursGrid || 0,
            totalYieldDecreasedDeviceError: response.data?.summaryData?.totalYieldDecreasedDeviceError || 0,
            totalYieldDecreasedOtherError: response.data?.summaryData?.totalYieldDecreasedOtherError || 0,
            totalYieldDecreasedEvnCut: response.data?.summaryData?.totalYieldDecreasedEvnCut || 0,
            totalYieldDecreasedByLocation: response.data?.summaryData?.totalYieldDecreasedByLocation || 0,
            installWattageAc: response.data?.summaryData?.installWattageAc || 0,
            installWattageDc: response.data?.summaryData?.installWattageDc || 0,
            name: 'Total',
            code: '',
            type: '',
            status: '',
            wattageAC: response.data?.summaryData?.installWattageAc || 0,
            wattageDC: response.data?.summaryData?.installWattageDc || 0,
            startDate: '',
            electricityCode: '',
            provinceCode: '',
            customerName: '',
            customerCode: ''
          }
          dispatch({
            type: GET_PROJECTS_QUANTITY_REPORT,
            data: _orderBy(response.data.data, ['code'], ['asc']),
            total: response.data.totalRow,
            summaryData: sumData,
            summaryYearData: response.data.summaryYearData,
            params
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        dispatch({
          type: GET_PROJECTS_QUANTITY_REPORT,
          data: [],
          total: 0,
          params
        })
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const getProjectsOperateReport = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_PROJECTS_OPERATIONAL_REPORT, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          const sumData = {
            reportDate: '',
            id: 'projectTotalRow',
            code: '',
            name: 'Total',
            type: '',
            status: '',
            startDate: '',
            wattageAC: response.data?.summaryData?.totalWattageAC || 0,
            wattageDC: response.data?.summaryData?.totalWattageDC || 0,
            electricityCode: '',
            provinceCode: '',
            customerName: '',
            customerCode: '',
            totalErrors: response.data?.summaryData?.totalErrors || 0,
            totalWarning: response.data?.summaryData?.totalWarning || 0,
            totalNoted: response.data?.summaryData?.totalNoted || 0,
            meters: [],
            inverters: [],
            panels: [],
            system: []
          }

          dispatch({
            type: GET_PROJECTS_OPERATIONAL_REPORT,
            data: _orderBy(response.data.data, ['code'], ['asc']),
            total: response.data.totalRow,
            summaryDataOR: sumData,
            params
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        dispatch({
          type: GET_PROJECTS_OPERATIONAL_REPORT,
          data: [],
          total: 0,
          params
        })
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const getGeneralReport = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_GENERAL_REPORT, { params })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          dispatch({
            type: GET_GENERAL_REPORT,
            data: response.data.data,
            total: response.data.totalRow,
            params
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const clearProjectOperationReport = () => {
  return dispatch => dispatch({
    type: CLEAR_OPERATION_REPORT,
    data: []
  })
}

export const clearYieldReport = () => {
  return dispatch => dispatch({
    type: CLEAR_YIELD_REPORT,
    data: []
  })
}

export const clearGeneralReport = () => {
  return dispatch => dispatch({
    type: CLEAR_GENERAL_REPORT,
    data: []
  })
}
