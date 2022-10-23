import { CHANGE_LANGUAGE, COUNT_REQUEST, TOGGLE_SKIN } from '@constants/actions'
// ** Handles Layout Content Width (full / boxed)
export const handleContentWidth = (value) => (dispatch) => dispatch({ type: 'HANDLE_CONTENT_WIDTH', value })

// ** Handles Menu Collapsed State (Bool)
export const handleMenuCollapsed = (value) => (dispatch) => dispatch({ type: 'HANDLE_MENU_COLLAPSED', value })

// ** Handles Menu Hidden State (Bool)
export const handleMenuHidden = (value) => (dispatch) => dispatch({ type: 'HANDLE_MENU_HIDDEN', value })

// ** Handles RTL (Bool)
export const handleRTL = (value) => (dispatch) => dispatch({ type: 'HANDLE_RTL', value })

// ** Toggle skin
export const toggleSkin = (value) => (dispatch) => dispatch({ type: TOGGLE_SKIN, value })

// ** Count request
export const countRequest = (value) => (dispatch) => dispatch({ type: COUNT_REQUEST, value })

// ** Change language
export const changeLanguage = (value) => (dispatch) => dispatch({ type: CHANGE_LANGUAGE, value })
