import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Row } from 'reactstrap'
import { renderItems } from '@src/views/settings/common'
import { useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { API_GET_SYSTEM_ALERT_SETTING, API_POST_SYSTEM_ALERT_SETTING } from '@constants/api'
import axios from 'axios'
import { showToast } from '@utils'
import {SW_STATUS } from '@constants/common'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { useWindowSize } from '@hooks/useWindowSize'

const boolKeys = [
  'resendAlertActive',
  'inverterOfflineActive',
  'unstableNetworkActive',
  'lowCosPhiActive',
  'meterOfflineActive',
  'pushToOperatorActive',
  'faultEventOfEachInverterActive',
  'diffBtwInverterAndMeterActive',
  'asyncInverterActive',
  'yieldAtLowCostTimeActive',
  'haveDiffYieldBtwProjectActive',
  'verificationTimeActive',
  'pvSensorOverheatActive',
  'inverterStringAlertActive'
]

const SystemAlertSetting = ({ intl }) => {
  const ability = useContext(AbilityContext)
  const { handleSubmit, control, errors, register, reset, watch } = useForm({
    mode: 'onChange'
  })

  const [width] = useWindowSize()

  const [settingData, setSettingData] = useState({
      resendAlertActive: false,
      resendAlertValue: 0,
      inverterOfflineActive: false,
      inverterOfflineValue: 0,
      unstableNetworkActive: false,
      unstableNetworkValue: 0,
      lowCosPhiActive: false,
      lowCosPhiValue: 0,
      meterOfflineActive: false,
      meterOfflineValue: 0,
      pushToOperatorActive: false,
      pushToOperatorValue: 0,
      faultEventOfEachInverterActive: false,
      faultEventOfEachInverterValue: 0,
      diffBtwInverterAndMeterActive: false,
      diffBtwInverterAndMeterValue: 0,
      asyncInverterActive: false,
      asyncInverterValue: 0,
      yieldAtLowCostTimeActive: false,
      yieldAtLowCostTimeValue: 0,
      haveDiffYieldBtwProjectActive: false,
      haveDiffYieldBtwProjectValue: 0,
      verificationTimeActive: false,
      verificationTimeValue: 0,
      pvSensorOverheatActive: false,
      pvSensorOverheatValue: 0,
      inverterStringAlertActive: false,
      inverterStringAlertValue: 0
    }),
    resendGroups = [
      {
        id: 'resendAlertValue',
        name: 'resendAlertValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'resendAlertActive',
        swName: 'resendAlertActive',
        swDefaultValue: settingData.resendAlertActive,
        color: 'light-success',
        title: 'Resend alert',
        label: 'Setting resend alert',
        unit: intl.formatMessage({ id: 'minutes' }),
        inputType: 'number',
        defaultValue: settingData.resendAlertValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'inverterOfflineValue',
        name: 'inverterOfflineValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'inverterOfflineActive',
        swName: 'inverterOfflineActive',
        swDefaultValue: settingData.inverterOfflineActive,
        color: 'light-success',
        title: 'Inverter offline',
        label: 'Setting inverter offline',
        unit: intl.formatMessage({ id: 'minutes' }),
        inputType: 'number',
        defaultValue: settingData.inverterOfflineValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'pushToOperatorValue',
        name: 'pushToOperatorValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'pushToOperatorActive',
        swName: 'pushToOperatorActive',
        swDefaultValue: settingData.pushToOperatorActive,
        color: 'light-success',
        title: 'Push notification to operator',
        label: 'Setting notification to operator',
        multiSelect: true,
        unit: intl.formatMessage({ id: 'minutes' }),
        inputType: '',
        defaultValue: settingData.pushToOperatorValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'meterOfflineValue',
        name: 'meterOfflineValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'meterOfflineActive',
        swName: 'meterOfflineActive',
        swDefaultValue: settingData.meterOfflineActive,
        color: 'light-success',
        title: 'Meter offline alert',
        label: 'Setting meter offline alert',
        unit: intl.formatMessage({ id: 'minutes' }),
        inputType: 'number',
        defaultValue: settingData.meterOfflineValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'unstableNetworkValue',
        name: 'unstableNetworkValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'unstableNetworkActive',
        swName: 'unstableNetworkActive',
        swDefaultValue: settingData.unstableNetworkActive,
        color: 'light-success',
        title: 'Unstable network / data interrupted',
        label: 'Setting unstable network / data interrupted',
        unit: intl.formatMessage({ id: 'minutes' }),
        inputType: 'number',
        defaultValue: settingData.unstableNetworkValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'lowCosPhiValue',
        name: 'lowCosPhiValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'lowCosPhiActive',
        swName: 'lowCosPhiActive',
        swDefaultValue: settingData.lowCosPhiActive,
        color: 'light-success',
        title: 'Low cos phi alert',
        label: 'Setting low cos phi alert',
        unit: ' ',
        inputType: 'number',
        defaultValue: settingData.lowCosPhiValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'faultEventOfEachInverterValue',
        name: 'faultEventOfEachInverterValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'faultEventOfEachInverterActive',
        swName: 'faultEventOfEachInverterActive',
        swDefaultValue: settingData.faultEventOfEachInverterActive,
        color: 'light-success',
        title: 'Faults/events for each type of inverters',
        label: 'Setting faults/events for each type of inverters',
        multiSelect: true,
        unit: '',
        inputType: '',
        defaultValue: settingData.faultEventOfEachInverterValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'yieldAtLowCostTimeValue',
        name: 'yieldAtLowCostTimeValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'yieldAtLowCostTimeActive',
        swName: 'yieldAtLowCostTimeActive',
        swDefaultValue: settingData.yieldAtLowCostTimeActive,
        color: 'light-success',
        title: 'Having yield at low cost time alert',
        label: 'Setting having yield at low cost time alert',
        multiSelect: true,
        unit: 'kWh',
        inputType: 'number',
        defaultValue: settingData.yieldAtLowCostTimeValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'diffBtwInverterAndMeterValue',
        name: 'diffBtwInverterAndMeterValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'diffBtwInverterAndMeterActive',
        swName: 'diffBtwInverterAndMeterActive',
        swDefaultValue: settingData.diffBtwInverterAndMeterActive,
        color: 'light-success',
        title: 'Different between meter and inverter alert',
        label: 'Setting different between meter and inverter alert',
        multiSelect: true,
        unit: '%',
        inputType: 'number',
        defaultValue: settingData.diffBtwInverterAndMeterValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'asyncInverterValue',
        name: 'asyncInverterValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'asyncInverterActive',
        swName: 'asyncInverterActive',
        swDefaultValue: settingData.asyncInverterActive,
        color: 'light-success',
        title: 'Async inverters alert',
        label: 'Setting async inverters alert',
        multiSelect: true,
        unit: '%',
        inputType: 'number',
        defaultValue: settingData.asyncInverterValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'haveDiffYieldBtwProjectValue',
        name: 'haveDiffYieldBtwProjectValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'haveDiffYieldBtwProjectActive',
        swName: 'haveDiffYieldBtwProjectActive',
        swDefaultValue: settingData.haveDiffYieldBtwProjectActive,
        color: 'light-success',
        title: 'Having different yield between projects of industrial area',
        label: 'Setting having different yield between projects of industrial area',
        multiSelect: true,
        unit: '%',
        inputType: 'number',
        defaultValue: settingData.haveDiffYieldBtwProjectValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'verificationTimeValue',
        name: 'verificationTimeValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'verificationTimeActive',
        swName: 'verificationTimeActive',
        swDefaultValue: settingData.verificationTimeActive,
        color: 'light-success',
        title: 'Inspection date is expired alert',
        label: 'Setting inspection date is expired alert',
        multiSelect: true,
        unit: intl.formatMessage({ id: 'days' }),
        inputType: 'number',
        defaultValue: settingData.verificationTimeValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'pvSensorOverheatValue',
        name: 'pvSensorOverheatValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'pvSensorOverheatActive',
        swName: 'pvSensorOverheatActive',
        swDefaultValue: settingData.pvSensorOverheatActive,
        color: 'light-success',
        title: 'Panel sensor overheat',
        label: 'Setting panel sensor overheat',
        multiSelect: true,
        unit: '°C',
        inputType: 'number',
        defaultValue: settingData.pvSensorOverheatValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'inverterStringAlertValue',
        name: 'inverterStringAlertValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'inverterStringAlertActive',
        swName: 'inverterStringAlertActive',
        swDefaultValue: settingData.inverterStringAlertActive,
        color: 'light-success',
        title: 'Inverter String alert',
        label: 'Setting inverter String alert',
        multiSelect: true,
        unit: 'A',
        inputType: 'number',
        defaultValue: settingData.inverterStringAlertValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true,
        minValue: 0.2
      }
    ]

  const fetchAlertSetting = async ({ projectId }) => {
    await axios
      .get(API_GET_SYSTEM_ALERT_SETTING, { params: { projectId } })
      .then((response) => {
        if (response?.data?.data?.length > 0) {
          const convertedData = { ...response.data.data[0] }
          boolKeys.forEach((key) => {
            convertedData[key] = convertedData[key] === SW_STATUS.YES
          })

          setSettingData((currentData) => (
            {
              ...currentData,
              ...convertedData
            }
          ))

          reset({
            ...convertedData
          })
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }

  const onSubmit = async (data) => {
    const convertedData = { ...data }
    boolKeys.forEach((key) => {
      if (convertedData[key]) {
        convertedData[key] = SW_STATUS.YES
      } else {
        convertedData[key] = SW_STATUS.NO
      }
    })

    await axios
      .post(API_POST_SYSTEM_ALERT_SETTING, { ...convertedData, projectId: 0 })
      .then((response) => {
        if (response?.data?.data) {
          showToast('success', `${response.data.message}`)
          const convertedData = { ...response.data.data }
          boolKeys.forEach((key) => {
            convertedData[key] = convertedData[key] === SW_STATUS.YES
          })
          setSettingData((currentData) => (
            {
              ...currentData,
              ...convertedData
            }
          ))
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }

  const onReset = () => {
    reset({})
  }

  // Component did mount
  useEffect(async () => {
    await Promise.all([fetchAlertSetting({ projectId: 0 })])
  }, [])

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='system-alert-setting'>
      <Row>
        {renderItems({
          items: resendGroups,
          intl,
          control,
          errors,
          register,
          watch,
          isWrap: width < 770
        })}
      </Row>
      {
        ability.can('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING) &&
        <div className='group-button'>
          <Button.Ripple color='primary' className='mr-2' type='submit'>
            <FormattedMessage id='Save' />
          </Button.Ripple>
          <Button.Ripple color='secondary' onClick={onReset}>
            <FormattedMessage id='Cancel' />
          </Button.Ripple>
        </div>
      }
    </Form>
  )
}

SystemAlertSetting.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(SystemAlertSetting)
