import { SET_CLOCK } from '@constants/actions'

// ** Initial State
const initialState = {
  clocks: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLOCK:
      return {
        ...state,
        clocks: action.payload
      }

    default:
      return state
  }
}

export default reducer
