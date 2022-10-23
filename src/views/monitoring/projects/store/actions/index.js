import axios from 'axios'
import {
  GET_PROJECTS,
  REMOVE_PROJECT,
  ADD_PROJECT,
  GET_WEATHER_INFO,
  SET_SELECTED_PROJECT,
  GET_PROJECT_BY_ID,
  API_GET_PROJECT_BY_CUSTOMER,
  GET_ALL_PROJECTS,
  API_PUT_PROJECT,
  SET_PROJECT_DATA,
  API_GET_ELECTRICITY,
  GET_ELECTRICITY,
  API_GET_INDUSTRIAL_AREAS,
  GET_INDUSTRIAL_AREAS,
  API_GET_INVESTORS,
  GET_INVESTORS,
  API_GET_PROJECT_MONITORING,
  GET_PROJECT_MONITORING,
  ADD_CHART_PARAM,
  REMOVE_CHART_PARAM,
  CHANGE_CHART_DATE_PICKER,
  GET_PROJECT_CHART_DATA,
  CHANGE_CHART_TYPE,
  API_GET_MONITORING_PROJECT_CHART,
  API_GET_CHART_FILTER_TEMPLATE,
  GET_CHART_FILTER_TEMPLATE,
  API_POST_CHART_FILTER_TEMPLATE,
  API_DELETE_CHART_FILTER_TEMPLATE, UPDATE_CURRENT_CHART_TEMPLATE
} from '@constants/index'
import { API_GET_PROJECT, API_GET_PROJECTS } from '@constants/api'
import { showToast } from '@utils'
import moment from 'moment'
import _isNumber from 'lodash/isNumber'

// ** Get table Data
export const getProjects = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_PROJECTS, { params })
      .then((response) => {
        dispatch({
          type: GET_PROJECTS,
          data: response.data.data,
          total: response.data.totalRow,
          summaryData: response.data.summaryData,
          params
        })
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get table Data
export const getAllProjects = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_PROJECTS, { params })
      .then((response) => {
        dispatch({
          type: GET_ALL_PROJECTS,
          allData: response.data.data,
          total: response.data.totalRow
        })
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get project by Id
export const getProjectById = (params) => {
  return async (dispatch) => {
    if (params?.id) {
      await axios.get(API_GET_PROJECT, { params }).then((response) => {
        dispatch({
          type: GET_PROJECT_BY_ID,
          project: response.data.data
        })
      })
    }
  }
}

// ** Remove project data by ID
export const removeProject = (id) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_PROJECT,
      projectId: id
    })
  }
}

// ** Add new project
export const addProject = (project) => {
  return (dispatch) => {
    dispatch({
      type: ADD_PROJECT,
      project
    })
  }
}

// ** Edit project
export const editProject = (project) => {
  return async (dispatch) => {
    await axios
      .put(API_PUT_PROJECT, {
        ...project
      })
      .then((response) => {
        if (response.data && response.data.status && response.data.data) {
          showToast('success', response.data.message)

          dispatch({
            type: SET_SELECTED_PROJECT,
            project: { ...response.data.data }
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

// ** Get weather information
export const getWeatherInfo = ({ latitude, longitude }) => {
  const baseURL = new URL(`${process.env.REACT_APP_WEATHER_BASE_URL}/onecall`)
  const params = {
    lat: latitude,
    lon: longitude,
    units: 'metric',
    exclude: 'hourly, minutely',
    appid: process.env.REACT_APP_OPEN_WEATHER_MAP_PRIVATE_KEY
  }
  baseURL.search = new URLSearchParams(params).toString()

  // Because Open weather map don't support OPTIONS request
  // Use Fetch for simple request
  return async (dispatch) => {
    try {
      const result = await fetch(baseURL, { method: 'GET' })
      result.json().then((data) => {
        return dispatch({
          type: GET_WEATHER_INFO,
          payload: data
        })
      })
    } catch (e) {
      console.error('[getWeatherInfo] - Error: ', e.message)
    }
  }
}

// ** Set selected project
export const setSelectedProject = (project) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_PROJECT,
      project
    })
  }
}

// ** Get project by Customer id
export const getProjectsByCustomer = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_PROJECT_BY_CUSTOMER, { params })
      .then((response) => {
        dispatch({
          type: GET_PROJECTS,
          allData: response.data.data,
          data: response.data.data,
          total: response.data.totalRow,
          params
        })
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Set project data
export const setProjectData = (projects, params, total) => {
  return (dispatch) => {
    dispatch({
      type: SET_PROJECT_DATA,
      projects,
      params,
      total
    })
  }
}

// ** Get electricity
export const getElectricity = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ELECTRICITY, { params })
      .then((response) => {
        dispatch({
          type: GET_ELECTRICITY,
          data: response.data.data
        })
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get industrial area
export const getIndustrialAreas = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_INDUSTRIAL_AREAS, { params })
      .then((response) => {
        dispatch({
          type: GET_INDUSTRIAL_AREAS,
          data: response.data.data
        })
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// ** Get investors
export const getInvestors = (params) => {
  return async (dispatch) => {
    await axios
      .get(API_GET_INVESTORS, { params })
      .then((response) => {
        dispatch({
          type: GET_INVESTORS,
          data: response.data.data
        })
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// Get project monitoring by ID
export const getProjectMonitoringById = (params) => {
  return async (dispatch) => {
    await axios.get(API_GET_PROJECT_MONITORING, { params }).then((response) => {
      dispatch({
        type: GET_PROJECT_MONITORING,
        projectMonitoring: {
          ...response.data.data,
          lastUpdate: response.data.ts
        }
      })
    })
  }
}

// Add chart param
export const addChartParam = (data) => {
  return (dispatch) => {
    dispatch({
      type: ADD_CHART_PARAM,
      data
    })
  }
}

// Remove chart param
export const removeChartParam = (data) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_CHART_PARAM,
      data
    })
  }
}

// Set query time for chart
export const changeChartDatePicker = (data) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_CHART_DATE_PICKER,
      data
    })
  }
}

// Update chart type
export const changeChartType = (data) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_CHART_TYPE,
      data
    })
  }
}

// Get monitoring data by device id and graph key
export const getProjectChartData = (param) => {
  return (dispatch) => {
    axios
      .get(API_GET_MONITORING_PROJECT_CHART, {
        params: {
          ...param,
          fields: Array.isArray(param.fields) ? param.fields.join(',') : ''
        }
      })
      .then((response) => {
        if (response?.data?.data?.length) {
          const tempData = response.data.data
          const result = {
            timeLabel: []
          }

          result.timeLabel = tempData.map(data => data.date)

          param.fields.forEach(field => {
            let tempChartData = tempData.map(data => (_isNumber(data[field]) ? data[field] / param.multiply : null))

            // Recalculate dailyYield if it's lost
            if (field === 'dailyYield') {
              let lastValidValue = 0

              tempChartData = tempChartData?.map((value, index, originData) => {
                const currentTimeLabel = moment(result.timeLabel[index], 'DD/MM/YYYY HH:mm:ss')

                // Reset lastValidValue in multiple date
                if (currentTimeLabel.hour() === 0) {
                  lastValidValue = 0
                }

                // Check for lost daily yield
                if (value > 0 && value < lastValidValue && lastValidValue < originData[index + 1]) {
                  return (lastValidValue + originData[index + 1]) / 2
                }

                if (value > 0 && value < lastValidValue) {
                  return lastValidValue
                }

                // Reassign last valid value in day
                if (value > 0 && value >= lastValidValue) {
                  lastValidValue = value
                }

                return value
              })
            }

            // Assign data to result
            if (param.deviceId) {
              result[`${param.deviceId}_${field}`] = tempChartData
            } else {
              result[`project_${field}`] = tempChartData
            }
          })

          dispatch({
            type: GET_PROJECT_CHART_DATA,
            data: result,
            key: param.paramId
          })
        } else {
          dispatch({
            type: GET_PROJECT_CHART_DATA,
            data: {},
            key: param.paramId
          })
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// Get chart filter templates
export const getChartFilterTemplates = (param) => {
  return (dispatch) => {
    axios
      .get(API_GET_CHART_FILTER_TEMPLATE, {
        params: {
          ...param
        }
      })
      .then((response) => {
        if (response?.data?.data?.length) {
          dispatch({
            type: GET_CHART_FILTER_TEMPLATE,
            data: response.data.data
          })
        } else {
          dispatch({
            type: GET_CHART_FILTER_TEMPLATE,
            data: []
          })
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// Set current template
export const setCurrentTemplate = (template) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CURRENT_CHART_TEMPLATE,
      data: template
    })
  }
}

// Get chart filter templates
export const addChartFilterTemplate = (template) => {
  return (dispatch) => {
    axios
      .post(API_POST_CHART_FILTER_TEMPLATE, template)
      .then((response) => {
        if (response?.data?.status) {
          dispatch(getChartFilterTemplates({ userId: template.userId, projectId: template.projectId }))
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// Update chart filter templates
export const updateChartFilterTemplate = (template) => {
  return (dispatch) => {
    axios
      .put(API_POST_CHART_FILTER_TEMPLATE, template)
      .then((response) => {
        if (response?.data?.status) {
          dispatch(getChartFilterTemplates({ userId: template.userId, projectId: template.projectId }))
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

// Delete chart filter templates
export const deleteChartFilterTemplate = (template) => {
  return (dispatch) => {
    axios
      .delete(API_DELETE_CHART_FILTER_TEMPLATE, { data: { id: template.id } })
      .then((response) => {
        if (response?.data?.status) {
          dispatch(getChartFilterTemplates({ userId: template.userId }))
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}
