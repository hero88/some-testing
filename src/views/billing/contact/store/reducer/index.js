import { SET_CONTACT } from '@constants/actions'

// ** Initial State
const initialState = {
  contacts: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONTACT:
      return {
        ...state,
        contacts: action.payload
      }

    default:
      return state
  }
}

export default reducer
