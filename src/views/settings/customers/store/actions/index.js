import axios from 'axios'
import {
  GET_CUSTOMERS,
  SET_SELECTED_CUSTOMER,
  GET_CUSTOMER_BY_ID,
  SORT_CUSTOMERS,
  SET_CUSTOMER_DATA,
  ADD_CUSTOMER,
  EDIT_CUSTOMER,
  INACTIVATE_CUSTOMER,
  ACTIVATE_CUSTOMER, STATE,
  API_DELETE_CUSTOMER
} from '@constants/index'
import {
  API_GET_CUSTOMER,
  API_GET_CUSTOMERS,
  API_POST_CUSTOMER,
  API_PUT_CUSTOMER
} from '@constants/api'
import { showToast } from '@utils'

// ** Get table Data
export const getCustomers = params => {
  return async dispatch => {
    await axios.get(API_GET_CUSTOMERS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_CUSTOMERS,
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

// ** Get table Data
export const getAllCustomers = params => {
  return async dispatch => {
    await axios.get(API_GET_CUSTOMERS, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_CUSTOMERS,
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

// ** Get customer by ID
export const getCustomerById = params => {
  return async dispatch => {
    await axios.get(API_GET_CUSTOMER, { params }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: GET_CUSTOMER_BY_ID,
          customer: response.data.data
        })
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Add new customer
export const addCustomer = (customer, params) => {
  return async dispatch => {
    await axios.post(API_POST_CUSTOMER, { ...customer, state: STATE.ACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: ADD_CUSTOMER,
          customer: response.data.data
        })
        dispatch(getCustomers(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Edit customer
export const editCustomer = (customer, params) => {
  return async dispatch => {
    await axios.put(API_PUT_CUSTOMER, customer).then(response => {
      if (response.data && response.data.status && response.data.data) {
        showToast('success', response.data.message)
        dispatch({
          type: EDIT_CUSTOMER,
          customer: response.data.data
        })
        dispatch(getCustomers(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Set selected customer
export const setSelectedCustomer = (customer) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_CUSTOMER,
      customer
    })
  }
}

// ** Update customerId
export const updateRelativeCustomer = (customer) => {
  return async () => {
    await axios.put(API_PUT_CUSTOMER, {
      ...customer
    })
  }
}

// ** Inactivate customer data by ID
export const inactivateCustomer = (id, params) => {
  return async dispatch => {
    await axios.put(API_PUT_CUSTOMER, { id, state: STATE.INACTIVE }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: INACTIVATE_CUSTOMER,
          id
        })
        dispatch(getCustomers(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Delete user data by ID
export const deleteCustomer = ({ data, params, successCBFunc }) => {
  return async dispatch => {
    await axios.delete(API_DELETE_CUSTOMER, { data }).then(response => {
      if (response.data && response.data.status && response.data.data) {
        successCBFunc()
        dispatch(getCustomers(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** reActivateCustomer
export const reActivateCustomer = (customer, params) => {
  return async dispatch => {
    await axios.put(API_PUT_CUSTOMER, { ...customer, state: STATE.ACTIVE }).then((response) => {
      if (response.data && response.data.status && response.data.data) {
        dispatch({
          type: ACTIVATE_CUSTOMER,
          id: customer.id
        })
        dispatch(getCustomers(params))
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      showToast('error', `${err.response ? err.response.data.message : err.message}`)
    })
  }
}

// ** Sort customer
export const sortCustomers = (customers) => {
  return dispatch => {
    dispatch({
      type: SORT_CUSTOMERS,
      customers
    })
  }
}

// ** Set customer data
export const setCustomerData = (customers, params, total) => {
  return dispatch => {
    dispatch({
      type: SET_CUSTOMER_DATA,
      customers,
      params,
      total
    })
  }
}
