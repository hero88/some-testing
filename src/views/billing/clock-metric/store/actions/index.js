import {
  API_FILLTER_METERS,
  API_FILLTER_METERS_METRIC,
  FETCH_METER_METRIC_REQUEST,
  FETCH_METER_REQUEST,
  GET_ALL_CLOCK,
  ROWS_PER_PAGE_DEFAULT
} from '@src/utility/constants'
import axios from 'axios'
import { get } from 'lodash'

export const getClockByCustomerAndProjectId = (params = {}) => {
  return async (dispatch) => {
    const { projectIds, customerIds, ...rest } = params

    const payload = {
      ...rest,
      filterValue: {
        projectId: projectIds,
        customerId: customerIds
      }
    }

    await axios
      .post(API_FILLTER_METERS, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          dispatch({
            type: FETCH_METER_REQUEST,
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

export const getClockMetricBySeri = (params = {}) => {
  return async (dispatch) => {
    const pagination = params?.pagination || {
      rowsPerPage: ROWS_PER_PAGE_DEFAULT,
      currentPage: 1
    }
    const { filterValue, isFilter, ...rest } = params

    const payload = {
      ...rest,
      filterValue,
      rowsPerPage: pagination?.rowsPerPage,
      page: pagination?.currentPage,
      order: isFilter ? 'createDate desc' : rest.order
    }

    await axios
      .post(API_FILLTER_METERS_METRIC, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const data = get(response, 'data.data', [])
          const totalRow = get(response, 'data.totalRow', 0)
          dispatch({
            type: FETCH_METER_METRIC_REQUEST,
            data,
            payload,
            totalRow
          })
        } else {
          throw new Error(response.data?.message)
        }
      })
      .catch((err) => {
        dispatch({
          type: FETCH_METER_METRIC_REQUEST,
          data: [],
          payload
        })
        console.log('err', err)
      })
  }
}

export const getAllClock = () => {
  return async (dispatch) => {
    await axios
      .get(GET_ALL_CLOCK)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data', {})
          dispatch({
            type: FETCH_METER_REQUEST,
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
