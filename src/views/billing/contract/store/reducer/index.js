import { SET_CONTRACT_OF_BILLING_PROJECT, SET_SELECTED_CONTRACT } from '@constants/actions'

// ** Initial State
const initialState = {
  data: [],
  selectedContract: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONTRACT_OF_BILLING_PROJECT:
      return {
        ...state,
        data: action.payload || []
      }
    case SET_SELECTED_CONTRACT:
      return {
        ...state,
        selectedContract: action.payload[0] || []
      }

    default:
      return state
  }
}

export default reducer
