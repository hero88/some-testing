import axios from 'axios'
import {
  ACTIVATE_SETTINGS_PROJECT,
  ADD_SETTINGS_PROJECT,
  API_GET_AUTO_CREATE_PROJECT,
  API_GET_PENDING_APPROVE_PROJECT,
  API_POST_AUTO_CREATE_PROJECT,
  API_POST_SYSTEM_ALERT_SETTING,
  API_PUT_AUTO_CREATE_PROJECT,
  EDIT_SETTINGS_PROJECT,
  GET_PROJECTS, GET_SETTING_TOTAL_REQUESTS,
  GET_SETTINGS_AUTO_PROJECTS,
  GET_SETTINGS_PENDING_APPROVE_PROJECTS,
  GET_SETTINGS_PROJECTS,
  INACTIVATE_SETTINGS_PROJECT,
  SET_SETTINGS_PROJECT_DATA,
  SET_SETTINGS_SELECTED_PROJECT,
  SORT_PROJECTS, STATE 
} from '@constants/index'
import {
  API_DELETE_PROJECT,
  API_GET_PROJECTS,
  API_POST_PROJECT,
  API_PUT_PROJECT
} from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getProjects = params => {
  return async dispatch => {
    await axios.get(API_GET_PROJECTS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_SETTINGS_PROJECTS,
          data: response.data.data,
          total: response.data.totalRow,
          params
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Get all data
export const getAllProjects = params => {
  return async dispatch => {
    await axios.get(API_GET_PROJECTS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_SETTINGS_PROJECTS,
          allData: response.data.data,
          total: response.data.totalRow
        })
        dispatch({
          type: GET_PROJECTS,
          allData: response.data.data,
          total: response.data.totalRow
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

/**
 * Create project setting
 * @param convertedData
 * @param projectId
 */
export const createProjectSetting = ({convertedData, projectId}) => {
  axios
    .post(API_POST_SYSTEM_ALERT_SETTING, { ...convertedData, projectId })
    .catch((err) => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
}

// ** Add new project
export const addProject = (project, params, isAddDevice) => {
  return async (dispatch) => {
    await axios.post(API_POST_PROJECT, { ...project, state: STATE.ACTIVE }).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)

        if (response.data.data?.state === STATE.ACTIVE) {
          if (isAddDevice) {
            dispatch({
              type: SET_SETTINGS_SELECTED_PROJECT,
              project: { ...response.data.data, isAddDevice }
            })
          }

          dispatch({
            type: ADD_SETTINGS_PROJECT,
            project: response.data.data
          })
        }

        Promise.all([
          createProjectSetting({
            convertedData: {
              inverterOverheatActive: "NO",
              inverterOverheatValue: "0"
            },
            projectId: response.data.data?.id
          }),
          dispatch(getProjects({
            ...params,
            state: '*'
          }))
        ])
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Edit project
export const editProject = (project, params, isAddDevice) => {
  return async dispatch => {
    await axios.put(API_PUT_PROJECT, project).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)

        if (isAddDevice) {
          dispatch({
            type: SET_SETTINGS_SELECTED_PROJECT,
            project: { ...response.data.data, isAddDevice }
          })
        }

        dispatch({
          type: EDIT_SETTINGS_PROJECT,
          project: response.data.data
        })
        dispatch(getProjects({
          ...params,
          state: '*'
        }))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Update userId, customerId
export const updateRelativeProject = (project) => {
  return async () => {
    await axios.put(API_PUT_PROJECT, project)
  }
}

// ** Inactivate project data by ID
export const deleteProject = ({ data, params, successCBFunc }) => {
  return async dispatch => {
    await axios.delete(API_DELETE_PROJECT, { data }).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        if (successCBFunc) {
          successCBFunc()
        }
        dispatch({
          type: INACTIVATE_SETTINGS_PROJECT,
          id: data.id
        })
        dispatch(getProjects({
          ...params,
          state: '*'
        }))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Inactivate project data by ID
export const inactivateProject = (id, params) => {
  return async dispatch => {
    await axios.put(API_PUT_PROJECT, { id, state: STATE.INACTIVE }).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: INACTIVATE_SETTINGS_PROJECT,
          id
        })
        dispatch(getProjects({
          ...params,
          state: '*'
        }))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** reActivateProject
export const reActivateProject = (project, params) => {
  return async dispatch => {
    await axios.put(API_PUT_PROJECT, { ...project, state: STATE.ACTIVE }).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: ACTIVATE_SETTINGS_PROJECT,
          id: project.id
        })
        dispatch(getProjects({
          ...params,
          state: '*'
        }))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Sort project
export const sortProjects = (projects) => {
  return dispatch => {
    dispatch({
      type: SORT_PROJECTS,
      projects
    })
  }
}

// ** Set selected project
export const setSelectedProject = (project) => {
  return dispatch => {
    dispatch({
      type: SET_SETTINGS_SELECTED_PROJECT,
      project
    })
  }
}

// ** Set project data
export const setProjectData = (projects, params, total) => {
  return dispatch => {
    dispatch({
      type: SET_SETTINGS_PROJECT_DATA,
      projects,
      params,
      total
    })
  }
}

// ** Get table Data
export const getSettingAutoCreateProjects = params => {
  return async dispatch => {
    await axios.get(API_GET_AUTO_CREATE_PROJECT, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_SETTINGS_AUTO_PROJECTS,
          data: response.data.data,
          total: response.data.totalRow,
          params
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Auto create project
export const createProjectAutomatically = (project, params) => {
  return async (dispatch) => {
    await axios.post(
      API_POST_AUTO_CREATE_PROJECT,
      project
    ).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)

        Promise.all([
          dispatch(getSettingAutoCreateProjects(params)),
          dispatch(getProjects({
            ...params,
            state: '*'
          })),
          createProjectSetting({
            convertedData: {
              inverterOverheatActive: "NO",
              inverterOverheatValue: "0"
            },
            projectId: response.data.data?.id
          })
        ])
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Get table Data
export const updateAutoCreateProject = ({ data, params, setSelectedProjects }) => {
  return async dispatch => {
    await axios.put(API_PUT_AUTO_CREATE_PROJECT, data).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch(getSettingAutoCreateProjects(params))

        if (setSelectedProjects) {
          setSelectedProjects([])
        }
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Get table project request data
export const getProjectRequests = params => {
  return async dispatch => {
    await axios.get(API_GET_PENDING_APPROVE_PROJECT, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_SETTINGS_PENDING_APPROVE_PROJECTS,
          data: response.data.data,
          total: response.data.totalRow,
          params
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Get request total for badges
export const getTotalProjectRequests = (params) => {
  return async dispatch => {
    await axios.get(API_GET_PENDING_APPROVE_PROJECT, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_SETTING_TOTAL_REQUESTS,
          total: response.data.totalRow
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}
