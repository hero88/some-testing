import { SET_FORM_DIRTY } from '@constants/actions'

// ** Initial State
const initialState = {
  isFormGlobalDirty: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORM_DIRTY:
      return {
        ...state,
        isFormGlobalDirty: action.payload
      }

    default:
      return state
  }
}

export default reducer
