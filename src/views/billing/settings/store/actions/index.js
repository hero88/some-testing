import {
  API_CREATE_BILLING_SETTING_VALUE,
  API_DELETE_BILLING_SETTING_VALUE,
  API_GET_BILLING_SETTING_BY_ID,
  API_GET_BILLING_SETTING_VALUE_BY_CODE,
  API_GET_BILLING_SETTING_VALUE_BY_SETTING_ID,
  API_GET_LIST_BILLING_SETTING,
  API_UPDATE_BILLING_SETTING,
  API_UPDATE_BILLING_SETTING_VALUE
} from '@src/utility/constants'
import axios from 'axios'
import { FETCH_SETTINGS_REQUEST, SET_SELECTED_BILLING_SETTING, SET_SETTING_BY_CODE } from '@constants/actions'
import { get } from 'lodash'
import { GENERAL_STATUS } from '@src/utility/constants/billing'
import { showToast } from '@src/utility/Utils'
import { FormattedMessage } from 'react-intl'

export const postSettingsValue = ({ params, callback }) => {
  return async () => {
    await axios
      .post(API_CREATE_BILLING_SETTING_VALUE, params)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Create info success" />)
          callback?.()
        } else {
          console.log('err')
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        showToast('error', <FormattedMessage id="data create failed, please try again" />)
      })
  }
}
export const putSettingsValue = ({ params, callback }) => {
  return async () => {
    await axios
      .put(API_UPDATE_BILLING_SETTING_VALUE, params)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Update info success" />)
          callback?.()
        } else {
          console.log('err')
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        showToast('error', <FormattedMessage id="data update failed, please try again" />)
      })
  }
}
export const putSettings = ({ params, callback }) => {
  return async () => {
    await axios
      .put(API_UPDATE_BILLING_SETTING, params)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Update info success" />)
          callback?.()
        } else {
          console.log('err')
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        showToast('error', <FormattedMessage id="data update failed, please try again" />)
      })
  }
}

export const deleteSettingsValue = ({ id, callback }) => {
  return async () => {
    await axios
      .delete(`${API_DELETE_BILLING_SETTING_VALUE}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Delete info success" />)

          callback?.()
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data delete failed, please try again" />)
      })
  }
}

export const getListBillingSetting = (params = {}, callback) => {
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
        fields: ['name', 'code'],
        type: 'contains'
      }
    }

    await axios
      .post(API_GET_LIST_BILLING_SETTING, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_SETTINGS_REQUEST,
            data: response.data.data,
            total: response.data.count,
            params
          })
          callback?.()
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}

export const getBillingSettingById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_BILLING_SETTING_BY_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_BILLING_SETTING,
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

export const getBillingSettingValueBySettingId = ({ id, callback }) => {
  return async () => {
    await axios
      .get(`${API_GET_BILLING_SETTING_VALUE_BY_SETTING_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          callback?.(response.data.data)
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        callback?.()
      })
  }
}

export const getSettingValuesByCode = ({ code, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_BILLING_SETTING_VALUE_BY_CODE}/${code}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          if (isSavedToState) {
            dispatch({
              type: SET_SETTING_BY_CODE,
              key: code,
              payload: (response.data.data?.values || [])
                .filter((item) => item.state === GENERAL_STATUS.ACTIVE)
                .map((item) => ({ value: item.value, label: item.value }))
            })
          }
          callback?.(response.data.data)
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
        callback?.()
      })
  }
}
