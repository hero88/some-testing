import {
  API_ADD_CONTACT,
  API_ADD_CUSTOMER_V2,
  API_DELETE_CUSTOMER_V2,
  API_GET_ALL_CUSTOMERS,
  //API_GET_ALL_CUSTOMER,
  API_GET_CONTACT_BY_CUSTOMER_ID,
  API_GET_CUSTOMER_BY_ID,
  API_GET_LIST_CUSTOMER,
  API_GET_LIST_CUSTOMER_BY_PROJECT_ID,
  API_UPDATE_CUSTOMER_V2
} from '@src/utility/constants'
import { FETCH_CUSTOMERS_REQUEST } from '@src/utility/constants/actions'
import { showToast } from '@src/utility/Utils'
import axios from 'axios'
import { SET_SELECTED_BILLING_CUSTOMER, SET_CONTACT } from '@constants/actions'
import { handleCRUDOfContacts } from '@src/views/billing/contact/util'
import { FormattedMessage } from 'react-intl'

export const getListCustomer = (params) => {
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
        fields: ['fullName', 'code', 'taxCode', 'address', 'phone', 'note'],
        type: 'contains'
      }
    }
    await axios
      .post(API_GET_LIST_CUSTOMER, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_CUSTOMERS_REQUEST,
            data: response.data.data,
            total: response.data.count,
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

export const postCustomer = ({ params, callback }) => {
  return async () => {
    const { contacts, ...customerPayload } = params
    await axios
      .post(API_ADD_CUSTOMER_V2, { ...customerPayload, provinceCode: 'HCM' })
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const customerId = response.data?.data?.id

          // eslint-disable-next-line no-unused-vars
          const addCusContactReq = contacts.map(({ id, ...contact }) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            axios.post(API_ADD_CONTACT, { ...contact, customerId, state: 'ACTIVE' })
          )
          Promise.all(addCusContactReq)
            .then(() => {
              showToast('success', <FormattedMessage id="Create info success" />)
              callback?.()
            })
            .catch(() => {
              showToast('error', <FormattedMessage id="data create failed, please try again" />)
            })
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data create failed, please try again" />)
      })
  }
}

export const putCustomer = ({ params, callback }) => {
  return async () => {
    const { contacts, ...customerPayload } = params
    await axios
      .put(API_UPDATE_CUSTOMER_V2, { ...customerPayload, provinceCode: 'HCM' })
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const contactsModifyRes = handleCRUDOfContacts({ contacts, customerId: customerPayload.id })
          return Promise.all(contactsModifyRes)
            .then(() => {
              showToast('success', <FormattedMessage id="Update info success" />)
              callback?.()
            })
            .catch(() => {
              showToast('error', <FormattedMessage id="data update failed, please try again" />)
            })
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data update failed, please try again" />)
      })
  }
}

export const deleteCustomer = ({ id, callback }) => {
  return async () => {
    await axios
      .delete(`${API_DELETE_CUSTOMER_V2}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Delete info success" />)

          callback?.()
        } else {
          showToast('error', response.data?.message)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="data delete failed, please try again" />)
      })
  }
}

export const getCustomerWithContactsById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    const getCustomerByIdReq = axios.get(`${API_GET_CUSTOMER_BY_ID}/${id}`)
    const getContactsByCusIdReq = axios.get(`${API_GET_CONTACT_BY_CUSTOMER_ID}/${id}`)

    Promise.all([getCustomerByIdReq, getContactsByCusIdReq])
      .then(([customerRes, contactRes]) => {
        if (
          customerRes.status === 200 &&
          customerRes.data?.data &&
          contactRes.status === 200 &&
          contactRes.data?.data
        ) {
          const payload = {
            ...customerRes.data?.data,
            contacts: contactRes.data?.data
          }
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_BILLING_CUSTOMER,
              payload: customerRes.data?.data
            })
            dispatch({
              type: SET_CONTACT,
              payload: contactRes.data?.data
            })
          }
          callback?.(payload)
        } else {
          throw new Error('Something went wrong')
        }
      })
      .catch((err) => {
        console.log('err', err)
        callback?.()
      })
  }
}

export const getListCustomerByProjectId = ({ id }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_LIST_CUSTOMER_BY_PROJECT_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_CUSTOMERS_REQUEST,
            data: response.data.data,
            total: response.data.count
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

export const getAllCustomer = () => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALL_CUSTOMERS)

      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_CUSTOMERS_REQUEST,
            data: response.data.data,
            total: response.data.count
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
