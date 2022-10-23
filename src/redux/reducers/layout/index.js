// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig'
import { CHANGE_LANGUAGE, COUNT_REQUEST, TOGGLE_SKIN } from '@constants/actions'

// ** Returns Initial Menu Collapsed State
const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem('menuCollapsed')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

const initialSkin = () => {
  const skin = window.localStorage.getItem('skin')

  return skin ? skin : themeConfig.layout.skin
}

// ** Initial State
const initialState = {
  isRTL: themeConfig.layout.isRTL,
  menuCollapsed: initialMenuCollapsed(),
  menuHidden: themeConfig.layout.menu.isHidden,
  contentWidth: themeConfig.layout.contentWidth,
  skin: initialSkin(),
  language: 'vi',
  requestCount: 0
}

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_CONTENT_WIDTH':
      return { ...state, contentWidth: action.value }
    case 'HANDLE_MENU_COLLAPSED':
      window.localStorage.setItem('menuCollapsed', action.value)
      return { ...state, menuCollapsed: action.value }
    case 'HANDLE_MENU_HIDDEN':
      return { ...state, menuHidden: action.value }
    case 'HANDLE_RTL':
      return { ...state, isRTL: action.value }
    case TOGGLE_SKIN:
      return { ...state, skin: action.value }
    case COUNT_REQUEST:
      return { ...state, requestCount: action.value }
    case CHANGE_LANGUAGE:
      return { ...state, language: action.value }
    default:
      return state
  }
}

export default layoutReducer
