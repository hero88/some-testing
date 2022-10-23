import { API_GET_CONTACT_BY_CUSTOMER_ID, API_GET_CONTACT_BY_ROOF_VENDOR_ID, SET_CONTACT } from '@src/utility/constants'
import { showToast } from '@src/utility/Utils'
import axios from 'axios'

export const getContactListByCustomerId = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    try {
      const contactRes = await axios.get(`${API_GET_CONTACT_BY_CUSTOMER_ID}/${id}`, { isNotCount: true })
      if (contactRes.status === 200 && contactRes.data?.data) {
        if (isSavedToState) {
          dispatch({
            type: SET_CONTACT,
            payload: contactRes.data?.data
          })
        }
        callback?.(contactRes.data?.data)
      }
    } catch (error) {
      console.log('error', error)
      showToast('error', error.toString())
    }
  }
}

export const getContactListByRoofVendorId = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    try {
      const contactRes = await axios.get(`${API_GET_CONTACT_BY_ROOF_VENDOR_ID}/${id}`, { isNotCount: true })
      if (contactRes.status === 200 && contactRes.data?.data) {
        if (isSavedToState) {
          dispatch({
            type: SET_CONTACT,
            payload: contactRes.data?.data
          })
        }
        callback?.(contactRes.data?.data)
      }
    } catch (error) {
      console.log('error', error)
      showToast('error', error.toString())
    }
  }
}
