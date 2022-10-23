import {
  API_CREATE_PROJECT,
  API_DELETE_PROJECTS,
  API_GET_ALL_PROJECT,
  API_GET_NEW_PROJECT,
  API_GET_PROJECT_BY_CUSTOMER_ID,
  API_GET_PROJECT_BY_ID,
  API_GET_PROJECT_BY_ROOF_VENDOR_ID,
  API_GET_PROJECT_BY_UNIT_COMPANY_ID,
  API_UPDATE_PROJECT
} from '@src/utility/constants'
import axios from 'axios'
import { FETCH_PROJECT_REQUEST, SET_SELECTED_BILLING_PROJECT } from '@constants/actions'
import { showToast } from '@src/utility/Utils'
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

export const getListProject = (params = {}) => {
  return async (dispatch) => {
    const { pagination = {}, searchValue, ...rest } = params
    const payload = {
      ...rest,
      limit: pagination.rowsPerPage,
      offset: pagination.rowsPerPage * (pagination.currentPage - 1)
    }
    if (searchValue?.trim()) {
      payload.searchValue = {
        value: searchValue,
        fields: ['name', 'code', 'companyName'],
        type: 'contains'
      }
 
    }
    await axios
      .post(API_GET_NEW_PROJECT, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_PROJECT_REQUEST,
            data: response.data.data,
            total: response.data.count,
            params
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}

export const postProject = ({ params, callback }) => {
  return async () => {
    await axios
      .post(API_CREATE_PROJECT, params)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          showToast('success', <FormattedMessage id="Create new data successfully" />)
          if (callback) callback(response.data.data)
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        showToast('error', <FormattedMessage id="Failed to create data. Please try again" />)
      })
  }
}

export const putProject = ({ params, callback }) => {
  return async () => {
    await axios
      .put(API_UPDATE_PROJECT, params)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          showToast('success', <FormattedMessage id="Data is updated successfully" />)
          callback?.()
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        showToast('error', <FormattedMessage id="Failed to update data. Please try again" />)
      })
  }
}

export const getBillingProjectById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_PROJECT_BY_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_BILLING_PROJECT,
              payload
            })
          }
          callback?.(response.data.data)
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        showToast('error', err.toString())
      })
  }
}

export const deleteBillingProjectById = ({ id, callback }) => {
  return async () => {
    await axios
      .delete(`${API_DELETE_PROJECTS}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Delete info success" />)

          callback?.(response.data.data)
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data delete failed, please try again" />)
      })
  }
}

export const getListProjectByCustomerId = ({ payload, callback }) => {
  return async () => {
    const { customerId, pagination, params } = payload
    const query = `${API_GET_PROJECT_BY_CUSTOMER_ID}/${customerId}`
    const URLParamsObject = {
      ...params,
      limit: pagination.rowsPerPage,
      offset: pagination.rowsPerPage * (pagination.currentPage - 1)
    }

    await axios
      .get(`${query}`, { params: URLParamsObject })
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          callback?.(response.data)
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}
export const getListProjectByRoofVendorId = ({ payload, callback }) => {
  return async () => {
    const { roofVendorId, pagination, params } = payload
    const URLParamsObject = {
      ...params,
      limit: pagination.rowsPerPage,
      offset: pagination.rowsPerPage * (pagination.currentPage - 1)
    }

    await axios
      .get(`${API_GET_PROJECT_BY_ROOF_VENDOR_ID}/${roofVendorId}`, { params: URLParamsObject })
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          callback?.(response.data)
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const getListProjectByCompanyUnitId = ({ payload, callback }) => {
  return async () => {
    const { operationUnitId, pagination, params } = payload
    const URLParamsObject = {
      ...params,
      limit: pagination.rowsPerPage,
      offset: pagination.rowsPerPage * (pagination.currentPage - 1)
    }

    await axios
      .get(`${API_GET_PROJECT_BY_UNIT_COMPANY_ID}/${operationUnitId}`, { params: URLParamsObject })
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          callback?.(response.data)
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }
}

export const getProjects = () => {
  return async (dispatch) => {


    await axios
      .get(API_GET_ALL_PROJECT)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_PROJECT_REQUEST,
            data: response.data.data,
            total: response.data.count
          })
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}
