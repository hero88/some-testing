// ** Import 3rd components
import { Button, Form, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

// ** Import custom components
import { renderItems } from '@src/views/settings/common'
import { ReactComponent as TreeIcon } from '@src/assets/images/svg/settings/tree-saved.svg'
import { ReactComponent as CO2Icon } from '@src/assets/images/svg/settings/co2-saved.svg'
import { ReactComponent as CoalIcon } from '@src/assets/images/svg/settings/coal-saved.svg'
import { ReactComponent as ClockIcon } from '@src/assets/images/svg/settings/clock.svg'
import {
  CO2_REDUCTION_RATE,
  PLACEHOLDER,
  SESSION_TIMEOUT,
  STANDARD_COAL_RATE,
  TREES_SAVED_RATE
} from '@constants/common'
import axios from 'axios'
import { API_GET_GENERAL_SETTING, API_POST_GENERAL_SETTING, API_PUT_GENERAL_SETTING } from '@constants/api'
import { showToast } from '@utils'
import { useDispatch, useSelector } from 'react-redux'
import { UPDATE_GENERAL_SETTING } from '@constants/actions'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { useWindowSize } from '@hooks/useWindowSize'

const ConfigurationSetting = ({ intl }) => {
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const [width] = useWindowSize()
  const { auth: { generalSetting } } = useSelector(state => state)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const configurations = [
    {
      id: 'settingTreesSavedRate',
      name: 'treesSavedRate',
      icon: <TreeIcon/>,
      color: 'light-success',
      title: 'Trees saved rate',
      label: 'Setting trees saved rate',
      unit: `${intl.formatMessage({ id: 'Tree'})}/kWh`,
      defaultValue: 0,
      placeholder: PLACEHOLDER.TREES_SAVED_RATE,
      inputType: 'number',
      isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_CONFIGURATION_SETTING),
      isShow: true,
      step: 0.0001
    },
    {
      id: 'settingCO2ReductionRate',
      name: 'co2ReductionRate',
      icon: <CO2Icon/>,
      color: 'light-success',
      title: 'CO2 reduction rate',
      label: 'Setting CO2 reduction rate',
      unit: 'kg/kWh',
      defaultValue: 0,
      placeholder: PLACEHOLDER.CO2_REDUCTION_RATE,
      inputType: 'number',
      isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_CONFIGURATION_SETTING),
      isShow: true,
      step: 0.0001
    },
    {
      id: 'settingStandardCoalRate',
      name: 'standardCoalRate',
      icon: <CoalIcon/>,
      color: 'light-success',
      title: 'Standard coal rate',
      label: 'Setting standard coal rate',
      unit: 'kg/kWh',
      defaultValue: 0,
      placeholder: PLACEHOLDER.STANDARD_COAL_RATE,
      inputType: 'number',
      isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_CONFIGURATION_SETTING),
      isShow: true,
      step: 0.0001
    },
    {
      id: 'settingSessionTimeout',
      name: 'sessionTimeout',
      icon: <ClockIcon/>,
      color: 'light-danger',
      title: 'Session timeout',
      label: 'Setting session timeout',
      unit: intl.formatMessage({ id: 'minutes' }),
      defaultValue: 0,
      placeholder: PLACEHOLDER.SESSION_TIMEOUT,
      inputType: 'number',
      isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_CONFIGURATION_SETTING),
      isShow: true,
      step: 0.0001
    }
  ]

  const {
    handleSubmit,
    control,
    errors,
    register,
    reset,
    watch
  } = useForm({
    mode: 'onChange'
  })

  useEffect(async () => {
    await axios
      .get(API_GET_GENERAL_SETTING, { params: { userId: userData?.id } })
      .then(async (response) => {
        if (response?.data?.data) {
          const { treesSavedRate, co2ReductionRate, standardCoalRate, sessionTimeout } = response.data.data

          dispatch({
            type: UPDATE_GENERAL_SETTING,
            data: {
              treesSavedRate: Number(treesSavedRate),
              co2ReductionRate: Number(co2ReductionRate),
              standardCoalRate: Number(standardCoalRate),
              sessionTimeout: Number(sessionTimeout)
            }
          })

          reset({
            treesSavedRate: Number(treesSavedRate),
            co2ReductionRate: Number(co2ReductionRate),
            standardCoalRate: Number(standardCoalRate),
            sessionTimeout: Number(sessionTimeout)
          })
        }
      })
      .catch(async (err) => {
        await axios
          .post(API_POST_GENERAL_SETTING, {
            treesSavedRate: TREES_SAVED_RATE,
            co2ReductionRate: CO2_REDUCTION_RATE,
            standardCoalRate: STANDARD_COAL_RATE,
            sessionTimeout: SESSION_TIMEOUT
          })
          .catch((err) => {
            showToast('error', `${err.response ? err.response.data.message : err.message}`)
          })
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }, [])

  const onSubmit = async (data) => {
    const submitData =
      ability.can('manage', USER_ABILITY.CAN_UPDATE_CONFIGURATION_SETTING)
        ? {
          treesSavedRate: Number(data.treesSavedRate),
          co2ReductionRate: Number(data.co2ReductionRate),
          standardCoalRate: Number(data.standardCoalRate),
          sessionTimeout: Number(data.sessionTimeout)
        }
        : { sessionTimeout: Number(data.sessionTimeout) }

    await axios
      .put(API_PUT_GENERAL_SETTING, submitData)
      .then(async (response) => {
        if (response?.data?.data) {
          const { treesSavedRate, co2ReductionRate, standardCoalRate, sessionTimeout } = response.data.data
          dispatch({
            type: UPDATE_GENERAL_SETTING,
            data: {
              treesSavedRate: Number(treesSavedRate),
              co2ReductionRate: Number(co2ReductionRate),
              standardCoalRate: Number(standardCoalRate),
              sessionTimeout: Number(sessionTimeout)
            }
          })
          showToast('success', `${response.data.message}`)
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }

  const onReset = () => {
    reset({
      treesSavedRate: generalSetting.treesSavedRate,
      co2ReductionRate: generalSetting.co2ReductionRate,
      standardCoalRate: generalSetting.standardCoalRate,
      sessionTimeout: generalSetting.sessionTimeout
    })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='configuration-setting'>
      <Row>
        {renderItems({
          items: configurations,
          intl,
          control,
          errors,
          register,
          watch,
          isWrap: width < 770
        })}
      </Row>

      { (ability.can('manage', USER_ABILITY.CAN_UPDATE_CONFIGURATION_SETTING)) &&
        <div className='group-button'>
          <Button.Ripple color='primary' className='mr-2' type='submit'>
            <FormattedMessage id='Save'/>
          </Button.Ripple>
          <Button.Ripple color='secondary' onClick={onReset}>
            <FormattedMessage id='Cancel'/>
          </Button.Ripple>
        </div>
      }
    </Form>
  )
}

ConfigurationSetting.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ConfigurationSetting)
