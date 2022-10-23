//** React Imports
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// ** Configs
import themeConfig from '@configs/themeConfig'
import { toggleSkin } from '@store/actions/layout'

export const useSkin = () => {
  const dispatch = useDispatch()
  // ** State
  const [skin, setSkin] = useState(() => {
    try {
      // ** Get from local storage by key
      const item = window.localStorage.getItem('skin')
      // ** Parse stored json or if none return initialValue
      return item ? item : themeConfig.layout.skin
    } catch (error) {
      // ** If error also return initialValue
      console.log(error)
      return themeConfig.layout.skin
    }
  })

  // ** Return a wrapped version of useState's setter function
  const setValue = (value) => {
    try {
      // ** Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(skin) : value
      // ** Set state
      setSkin(valueToStore)
      dispatch(toggleSkin(valueToStore))
      // ** Save to local storage
      if (valueToStore) {
        window.localStorage.setItem('skin', valueToStore)
      }
    } catch (error) {
      // ** A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  useEffect(() => {
    // ** Get Body Tag
    const element = window.document.body

    // ** Define classnames for skins
    const classNames = {
      dark: 'dark-layout',
      bordered: 'bordered-layout',
      'semi-dark': 'semi-dark-layout'
    }

    // ** Remove all classes from Body on mount
    element.classList.remove(...element.classList)

    // ** If skin is not light add skin class
    if (skin !== 'light') {
      element.classList.add(classNames[skin])
    }
  }, [skin])

  return [skin, setValue]
}
