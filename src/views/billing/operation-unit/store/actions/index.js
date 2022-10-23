import {
  API_GET_OPERATION_UNIT,
  API_CREATE_OPERATION_UNIT,
  API_DELETE_OPERATING_COMPANY,
  API_GET_OPERATION_UNIT_BY_ID,
  API_UPDATE_OPERATION_UNIT
} from '@src/utility/constants'
import axios from 'axios'
import { FETCH_COMPANY_REQUEST, SET_SELECTED_OPERATION_UNIT } from '@constants/actions'
import { get } from 'lodash'
import { showToast } from '@src/utility/Utils'
import { FormattedMessage } from 'react-intl'

export const postOperationUnit = ({ params, callback }) => {
  return async () => {
    await axios
      .post(API_CREATE_OPERATION_UNIT, params)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          showToast('success', <FormattedMessage id="Create new data successfully" />)
          callback?.()
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="Failed to create data. Please try again" />)
      })
  }
}
export const putOperationUnit = ({ params, callback }) => {
  return async () => {
    await axios
      .put(API_UPDATE_OPERATION_UNIT, params)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          showToast('success', <FormattedMessage id="Update info success" />)
          callback?.()
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data update failed, please try again" />)
      })
  }
}

export const getListOperationUnit = (params = {}) => {
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
        fields: ['name', 'code', 'taxCode', 'address', 'phone'],
        type: 'contains'
      }
    }

    await axios
      .post(API_GET_OPERATION_UNIT, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_COMPANY_REQUEST,
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

export const deleteOperationUnit = ({ id, callback }) => {
  return async () => {
    await axios
      .delete(`${API_DELETE_OPERATING_COMPANY}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Delete info success" />)

          callback?.()
        } else {
          // throw new Error(response.data?.message)
          showToast('error', response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data delete failed, please try again" />)
      })
  }
}

export const getOperationUnitById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_OPERATION_UNIT_BY_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_OPERATION_UNIT,
              payload
            })
          }
          callback?.(response.data.data)
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}
