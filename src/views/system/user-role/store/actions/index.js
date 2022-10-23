import {
  API_GET_ROLE_BY_USER_ID,
  API_GET_USER_ROLE,
  API_POST_USER_ROLE,
  GET_ROLE_PERMISION_BY_ROLE_ID
} from '@src/utility/constants'
import { FETCH_USER_ROLE_REQUEST, SELECTED_ROLE, SET_SELECTED_ROOF_VENDOR } from '@src/utility/constants/actions'
import { showToast } from '@src/utility/Utils'
import axios from 'axios'
import { get } from 'lodash'
import { FormattedMessage } from 'react-intl'

export const getPermisionRoleByRoleId = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${GET_ROLE_PERMISION_BY_ROLE_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_ROOF_VENDOR,
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

export const getListUserRole = (params = {}) => {
  return async (dispatch) => {
    const { pagination = {}, searchValue, filterValue, ...rest } = params
    const payload = {
      ...rest,
      rowsPerPage: pagination.rowsPerPage,
      page: pagination.currentPage,
      sortBy: rest?.sortBy ? rest?.sortBy : 'createDate',
      sortDirection: rest?.sortDirection ? rest?.sortDirection : 'DESC'
    }
    payload.filterValue = { name: searchValue, roleId: filterValue }

    await axios
      .post(API_GET_USER_ROLE, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_USER_ROLE_REQUEST,
            data: response?.data?.data,
            total: response?.data?.totalRow,
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

export const postUserRole = (payload) => {
  return async () => {
    await axios
      .post(`${API_POST_USER_ROLE}`, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          showToast('success', <FormattedMessage id="Data is updated successfully" />)
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

export const getRoleByUserId = ({ id }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_ROLE_BY_USER_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          dispatch({
            type: SELECTED_ROLE,
            payload
          })
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}
