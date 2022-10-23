// ** React Imports
import { useState, createContext } from 'react'

// ** Intl Provider Import
import { IntlProvider } from 'react-intl'

// ** Third party components
import PropTypes from 'prop-types'

// ** Core Language Data
import messagesEn from '@assets/data/locales/en.json'
import messagesVn from '@assets/data/locales/vi.json'

// ** User Language Data
import userMessagesEn from '@src/assets/data/locales/en.json'
import userMessagesVn from '@src/assets/data/locales/vi.json'

// ** Menu msg obj
const menuMessages = {
  en: { ...messagesEn, ...userMessagesEn },
  vi: { ...messagesVn, ...userMessagesVn }
}

// ** Create Context
const Context = createContext()

const IntlProviderWrapper = ({ children }) => {
  const language = localStorage.getItem('language') || 'vi'

  // ** States
  const [locale, setLocale] = useState(language)
  const [messages, setMessages] = useState(menuMessages[language])

  // ** Switches Language
  const switchLanguage = (lang) => {
    setLocale(lang)
    setMessages(menuMessages[lang])

    if (lang) {
      localStorage.setItem('language', lang)
    }
  }

  return (
    <Context.Provider value={{ locale, switchLanguage }}>
      <IntlProvider key={locale} locale={locale} messages={messages} defaultLocale="en" onError={() => {}}>
        {children}
      </IntlProvider>
    </Context.Provider>
  )
}

IntlProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired
}

export { IntlProviderWrapper, Context as IntlContext }
