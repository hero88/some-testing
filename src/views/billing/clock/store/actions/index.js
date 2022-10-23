import { API_GET_ALL_CLOCK_BY_CONTRACT_ID } from '@src/utility/constants'
import axios from 'axios'
import { SET_CLOCK } from '@constants/actions'
import { showToast } from '@src/utility/Utils'
import { get } from 'lodash'

export const getAllClockByContractId = ({ id, isSavedToState, callback }) => {
  return async (dispatch) => {
    await axios
      .get(`${API_GET_ALL_CLOCK_BY_CONTRACT_ID}/${id}`)
      .then((response) => {
        if (response.status === 200 && response.data.data) {
          const payload = get(response, 'data.data', {})
          if (isSavedToState) {
            dispatch({
              type: SET_CLOCK,
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
