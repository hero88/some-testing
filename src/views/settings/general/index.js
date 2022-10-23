// ** Import 3rd components
import { Button, Form, Row } from 'reactstrap'
import React, { useContext, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

// ** Import custom components
import { renderItems } from '@src/views/settings/common'
import axios from 'axios'
import { API_GET_GENERAL_SETTING, API_POST_GENERAL_SETTING, API_PUT_GENERAL_SETTING } from '@constants/api'
import { showToast } from '@utils'
import { useSkin } from '@hooks/useSkin'
import { IntlContext } from '@src/utility/context/Internationalization'
import { ReactComponent as LanguageIcon } from '@src/assets/images/svg/settings/language.svg'
import { ReactComponent as ThemeIcon } from '@src/assets/images/svg/settings/theme.svg'
import { useWindowSize } from '@hooks/useWindowSize'

const GeneralSetting = ({ intl }) => {
  // eslint-disable-next-line no-unused-vars
  const [skin, setSkin] = useSkin()
  // ** Context
  const intlContext = useContext(IntlContext)

  const [width] = useWindowSize()

  const userData = JSON.parse(localStorage.getItem('userData'))
  const languageOptions = [
      { value: 'EN', label: 'English' },
      { value: 'VI', label: 'Vietnamese' }
    ],
    themeOptions = [
      { value: 'LIGHT', label: 'Light mode' },
      { value: 'DARK', label: 'Dark mode' }
    ],
    settings = [
      {
        id: 'settingLanguage',
        name: 'defaultLanguage',
        icon: <LanguageIcon/>,
        color: 'light-success',
        title: 'Default language',
        label: 'Setting default language for all pages',
        options: languageOptions,
        defaultValue: languageOptions[1],
        unit: '',
        inputType: 'select',
        isShow: true
      },
      {
        id: 'settingTheme',
        name: 'theme',
        icon: <ThemeIcon/>,
        color: 'light-primary',
        title: 'Theme',
        label: 'Select a theme',
        options: themeOptions,
        defaultValue: themeOptions[1],
        unit: '',
        inputType: 'select',
        isShow: true
      }
    ]

  const { handleSubmit, control, reset, watch } = useForm({
    mode: 'onChange'
  })

  useEffect(async () => {
    await axios
      .get(API_GET_GENERAL_SETTING, { params: { userId: userData?.id } })
      .then(async (response) => {
        if (response?.data?.data) {
          const { defaultLanguage, theme } = response.data.data
          const languageIndex = languageOptions.findIndex((item) => item.value === defaultLanguage)
          const themeIndex = themeOptions.findIndex((item) => item.value === theme)

          reset({
            defaultLanguage: languageOptions[languageIndex],
            theme: themeOptions[themeIndex]
          })
        }
      })
      .catch(async (err) => {
        await axios
          .post(API_POST_GENERAL_SETTING, {
            defaultLanguage: languageOptions[1].value,
            theme: themeOptions[1].value
          })
          .catch((err) => {
            showToast('error', `${err.response ? err.response.data.message : err.message}`)
          })
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }, [])

  const onSubmit = async (data) => {
    await axios
      .put(API_PUT_GENERAL_SETTING, {
        defaultLanguage: data.defaultLanguage.value,
        theme: data.theme.value
      })
      .then(async (response) => {
        if (response?.data?.data) {
          await setSkin(data.theme.value?.toLowerCase())
          await intlContext.switchLanguage(data.defaultLanguage.value?.toLowerCase())
          showToast('success', `${response.data.message}`)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }

  const onReset = () => {
    reset({})
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='configuration-setting'>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Row>
        {renderItems({
          items: settings,
          intl,
          control,
          watch,
          isWrap: width < 770
        })}
      </Row>
      <div className='group-button'>
        <Button.Ripple color='primary' className='mr-2' type='submit'>
          <FormattedMessage id='Save'/>
        </Button.Ripple>
        <Button.Ripple color='secondary' onClick={onReset}>
          <FormattedMessage id='Cancel'/>
        </Button.Ripple>
      </div>
    </Form>
  )
}

GeneralSetting.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(GeneralSetting)
