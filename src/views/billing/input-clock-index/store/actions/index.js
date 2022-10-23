import {
  API_DELETE_INPUT_CLOCK_INDEX,
  API_GET_BLLING_DATA_BY_ID,
  API_GET_INPUT_CLOCK_INDEX,
  API_UPDATE_INPUT_CLOCK_INDEX,
  FETCH_INPUT_CLOCK_INDEX,
  SET_SELECTED_INPUT_CLOCK_INDEX
} from '@src/utility/constants'
import { showToast } from '@src/utility/Utils'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'

export const getInputClockIndex = (params = {}) => {
  return async (dispatch) => {
    const { pagination = {}, ...rest } = params
    const payload = {
      ...rest,
      limit: pagination.rowsPerPage,
      offset: pagination.rowsPerPage * (pagination.currentPage - 1)
    }

    await axios
      .post(API_GET_INPUT_CLOCK_INDEX, payload)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          dispatch({
            type: FETCH_INPUT_CLOCK_INDEX,
            data: response.data.data || [],
            total: response.data.count || 0,
            params
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

export const deleteManualInputIndex = ({ id, callback }) => {
  return async () => {
    await axios
      .delete(`${API_DELETE_INPUT_CLOCK_INDEX}/${id}`)
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

export const addManualInputIndex = ({ payload, callback }) => {
  return async () => {
    await axios
      .put(`${API_UPDATE_INPUT_CLOCK_INDEX}`, payload)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          showToast('success', <FormattedMessage id="Create new data successfully" />)
          callback?.()
        } else {
          showToast('error', <FormattedMessage id="Failed to create data. Please try again" />)
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="Failed to create data. Please try again" />)
      })
  }
}
export const updateManualInputIndex = ({ payload, oldPayload, callback }) => {
  return async () => {
    if (Number(oldPayload.id) !== Number(payload.id)) {
      const [uptNewIndex, delOldIndex] = await Promise.all([
        axios.put(`${API_UPDATE_INPUT_CLOCK_INDEX}`, payload),
        axios.delete(`${API_DELETE_INPUT_CLOCK_INDEX}/${oldPayload?.id}`)
      ]).catch((err) => {
        console.log('err', err)
        showToast('error', <FormattedMessage id="Failed to update data. Please try again" />)
      })
      if (
        uptNewIndex.status === 200 &&
        uptNewIndex?.data?.data &&
        delOldIndex.status === 200 &&
        delOldIndex.data?.data
      ) {
        showToast('success', <FormattedMessage id="Data is updated successfully" />)
        callback?.()
      } else {
        showToast('error', <FormattedMessage id="Failed to update data. Please try again" />)
      }
    } else {
      await axios
        .put(`${API_UPDATE_INPUT_CLOCK_INDEX}`, payload)
        .then((response) => {
          if (response.status === 200 && response.data?.data) {
            showToast('success', <FormattedMessage id="Data is updated successfully" />)
            callback?.()
          } else {
            showToast('error', <FormattedMessage id="Failed to update data. Please try again" />)
          }
        })
        .catch(() => {
          showToast('error', <FormattedMessage id="Failed to update data. Please try again" />)
        })
    }

    // await axios
    //   .put(`${API_UPDATE_INPUT_CLOCK_INDEX}`, payload)
    //   .then((response) => {
    //     if (response.status === 200 && response.data?.data) {
    //       showToast('success', <FormattedMessage id="Create new data successfully" />)
    //       callback?.()
    //     } else {
    //       showToast('error', <FormattedMessage id="Failed to create data. Please try again" />)
    //     }
    //   })
    //   .catch(() => {
    //     showToast('error', <FormattedMessage id="Failed to create data. Please try again" />)
    //   })
  }
}
export const getManualInputIndexById = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_BLLING_DATA_BY_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data?.data) {
          if (isSavedToState) {
            dispatch({
              type: SET_SELECTED_INPUT_CLOCK_INDEX,
              payload: response.data?.data
            })
          }
          callback?.(response.data?.data)
        } else {
          showToast('error', <FormattedMessage id="Something went wrong" />)
          callback?.()
        }
      })
      .catch(() => {
        showToast('error', <FormattedMessage id="Something went wrong" />)
        callback?.()
      })
  }
}
