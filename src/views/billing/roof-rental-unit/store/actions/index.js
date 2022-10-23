import {
  API_ADD_CONTACT,
  API_CREATE_ROOF_VENDOR,
  API_DELETE_ROOF_VENDORS,
  API_GET_ALL_ROOF_VENDOR,
  API_GET_CONTACT_BY_ROOF_VENDOR_ID,
  API_GET_ROOF_VENDOR,
  API_GET_ROOF_VENDOR_BY_ID,
  API_UPDATE_ROOF_VENDOR
} from '@src/utility/constants'
import { FETCH_ROOF_RENTAL_UNIT_REQUEST, SET_CONTACT, SET_SELECTED_ROOF_VENDOR } from '@src/utility/constants/actions'
import axios from 'axios'
import { showToast } from '@src/utility/Utils'
import { handleCRUDOfContacts } from '@src/views/billing/contact/util'
import { get } from 'lodash'
import { FormattedMessage } from 'react-intl'

export const getAllRoofVendor = () => {
  return async (dispatch) => {
    await axios
      .get(API_GET_ALL_ROOF_VENDOR)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data) {
          dispatch({
            type: FETCH_ROOF_RENTAL_UNIT_REQUEST,
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

export const getRoofVendor = (params) => {
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
        fields: ['name', 'code', 'phone', 'taxCode', 'address', 'phone'],
        type: 'contains'
      }
    }
    await axios
      .post(API_GET_ROOF_VENDOR, payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.data) {
          dispatch({
            type: FETCH_ROOF_RENTAL_UNIT_REQUEST,
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

export const deleteBillingRoofRentalUnit = ({ id, callback }) => {
  return async () => {
    await axios
      .delete(`${API_DELETE_ROOF_VENDORS}/${id}`)
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

export const getRoofVendorById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_ROOF_VENDOR_BY_ID}/${id}`)
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

export const postRoofVendors = ({ params, callback }) => {
  return async () => {
    const { contacts, ...roofVendor } = params
    await axios
      .post(API_CREATE_ROOF_VENDOR, roofVendor)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          const roofVendorId = response.data?.data?.id
          // eslint-disable-next-line no-unused-vars
          const addRoofVendorContact = contacts.map(({ id, ...contact }) =>
            // eslint-disable-next-line implicit-arrow-linebreak
            axios.post(API_ADD_CONTACT, {
              ...contact,
              position: contact.position || '',
              roofVendorId,
              state: 'ACTIVE'
            })
          )
          Promise.all(addRoofVendorContact)
            .then(() => {
              showToast('success', <FormattedMessage id="Create info success" />)
              callback?.(false)
            })
            .catch((err) => {
              console.log('err', err)
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
export const putRoofVendors = ({ params, callback }) => {
  return async () => {
    const { contacts, ...roofVendor } = params

    await axios
      .put(API_UPDATE_ROOF_VENDOR, params)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          const contactsModifyRes = handleCRUDOfContacts({ contacts, roofVendorId: roofVendor.id })
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


export const getRoofVendorWithContactsById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    const getRoofVendorByIdReq = axios.get(`${API_GET_ROOF_VENDOR_BY_ID}/${id}`)
    const getContactsByCusIdReq = axios.get(`${API_GET_CONTACT_BY_ROOF_VENDOR_ID}/${id}`)
    Promise.all([getRoofVendorByIdReq, getContactsByCusIdReq])
      .then(([RoofVendorRes, contactRes]) => {
        if (
          RoofVendorRes.status === 200 &&
          RoofVendorRes.data?.data &&
          contactRes.status === 200 &&
          contactRes.data?.data
        ) {
          const payload = {
            ...RoofVendorRes.data?.data,
            contacts: contactRes.data?.data
          }
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_ROOF_VENDOR,
              payload: RoofVendorRes.data?.data
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
      })
  }
}
