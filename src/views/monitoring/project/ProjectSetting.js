import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Row, Col, Input } from 'reactstrap'
import { renderItems } from '@src/views/settings/common'
import { useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { API_GET_SYSTEM_ALERT_SETTING, API_POST_SYSTEM_ALERT_SETTING, API_GET_SENSOR } from '@constants/api'
import { GET_SENSOR } from '@constants/index'
import axios from 'axios'
import { showToast } from '@utils'
import { SW_STATUS } from '@constants/common'
import { useDispatch, useSelector } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { useWindowSize } from '@hooks/useWindowSize'

import Select from 'react-select'
import { editProject } from '@src/views/monitoring/projects/store/actions'
import { useQuery } from '@hooks/useQuery'

const boolKeys = ['inverterOverheatActive', 'lowEfficiencyActive', 'lowEffOfEachInverterActive', 'zeroExportActive']

const ProjectSetting = ({ intl }) => {
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      sensorSetting: { data: sensorData },
      customerProject: { selectedProject }
    } = useSelector((store) => store),
    query = useQuery(),
    projectId = query.get('projectId')

  const [width] = useWindowSize()

  const [settingData, setSettingData] = useState({
      lowEfficiencyActive: false,
      lowEfficiencyValue: 0,
      lowEffOfEachInverterActive: false,
      lowEffOfEachInverterValue: 0,
      inverterOverheatActive: false,
      inverterOverheatValue: 0,
      zeroExportActive: false,
      zeroExportValue: 0
    }),
    [sensorOptions, setSensorOptions] = useState([]),
    [selectedSensor, setSelectedSensor] = useState(null),
    [pendingTimeLimit, setPendingTimeLimit] = useState(0),
    resendGroups = [
      {
        id: 'inverterOverheatValue',
        name: 'inverterOverheatValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'inverterOverheatActive',
        swName: 'inverterOverheatActive',
        swDefaultValue: settingData.inverterOverheatActive,
        color: 'light-success',
        title: 'Inverter overheat',
        label: 'Inverter overheat alert setting',
        unit: '°C',
        inputType: 'number',
        defaultValue: settingData.inverterOverheatValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'lowEfficiencyValue',
        name: 'lowEfficiencyValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'lowEfficiencyActive',
        swName: 'lowEfficiencyActive',
        swDefaultValue: settingData.lowEfficiencyActive,
        color: 'light-success',
        title: 'Low efficiency',
        label: 'Low efficiency alert setting',
        unit: '%',
        inputType: 'number',
        defaultValue: settingData.lowEfficiencyValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'lowEffOfEachInverterValue',
        name: 'lowEffOfEachInverterValue',
        switch: true,
        isDisableSwitch: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        swId: 'lowEffOfEachInverterActive',
        swName: 'lowEffOfEachInverterActive',
        swDefaultValue: settingData.lowEffOfEachInverterActive,
        color: 'light-success',
        title: 'Low efficiency of each inverter of project alert',
        label: 'Low efficiency of each inverter of project alert setting',
        multiSelect: true,
        unit: '%',
        inputType: 'number',
        defaultValue: settingData.lowEffOfEachInverterValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING),
        isShow: true
      },
      {
        id: 'manageZeroExport',
        name: 'manageZeroExport',
        switch: true,
        // isDisableSwitch: ability.can('manage', USER_ABILITY.MANAGE_ZERO_EXPORT),
        swId: 'manageZeroExport',
        swName: 'manageZeroExport',
        swDefaultValue: settingData.zeroExportActive,
        color: 'light-success',
        title: 'Zero export of the project',
        label: 'Zero export of the project setting',
        multiSelect: true,
        unit: '%',
        inputType: 'select',
        defaultValue: settingData.zeroExportValue,
        isReadOnly: ability.cannot('manage', USER_ABILITY.MANAGE_ZERO_EXPORT),
        isShow: true
      }
    ]

  const { handleSubmit, control, errors, register, reset, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      pendingTimeLimit: selectedProject?.pendingTimeLimit,
      ...setSettingData
    }
  })

  // Fetch Alert Setting
  const fetchAlertSetting = async ({ projectId }) => {
    await axios
      .get(API_GET_SYSTEM_ALERT_SETTING, { params: { projectId } })
      .then((response) => {
        if (response?.data?.data?.length > 0) {
          const convertedData = { ...response.data.data[0] }
          boolKeys.forEach((key) => {
            convertedData[key] = convertedData[key] === SW_STATUS.YES
          })

          setSettingData((currentData) => ({
            ...currentData,
            ...convertedData
          }))

          reset({ ...convertedData })
        }
      })
      .catch((err) => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
  }

  // Dispatch sensor list
  useEffect(() => {
    const getSensors = async () => {
      await axios
        .get(API_GET_SENSOR)
        .then((response) => {
          if (response.data && response.data.status && response.data.data) {
            dispatch({
              type: GET_SENSOR,
              data: response.data.data
            })
          } else {
            throw new Error(response.data.message)
          }
        })
        .catch((err) => {
          showToast('error', `${err.response ? err.response.data.message : err.message}`)
        })
    }
    getSensors()
    fetchAlertSetting({ projectId })
  }, [])

  // Set sensor options for creatableSelect
  useEffect(() => {
    if (sensorData && sensorData.length > 0) {
      setSensorOptions(
        sensorData.map((sensor) => ({
          label: sensor?.name,
          value: sensor?.dtuId
        }))
      )

      if (selectedProject?.sensorDtuId) {
        const currentSensor = sensorData.find((sensor) => sensor.dtuId === selectedProject.sensorDtuId)

        if (currentSensor) {
          setSelectedSensor({
            label: currentSensor.name,
            value: currentSensor.dtuId
          })
        }
      }
    }

    setPendingTimeLimit(selectedProject?.pendingTimeLimit || 0)
  }, [sensorData, selectedProject])

  // ** update sensor for project when select in sensor dropdown list
  const onChangeSelect = (option) => {
    if (option) {
      setSelectedSensor({ label: option.label, value: option.value })
    } else {
      setSelectedSensor(null)
    }
  }

  // submit form
  const onSubmit = async (data) => {
    const convertedData = { ...data }
    boolKeys.forEach((key) => {
      if (convertedData[key]) {
        convertedData[key] = SW_STATUS.YES
      } else {
        convertedData[key] = SW_STATUS.NO
      }
    })

    await Promise.all([
      dispatch(
        editProject({
          id: selectedProject.id,
          sensorDtuId: selectedSensor ? selectedSensor.value : '',
          pendingTimeLimit
        })
      ),
      axios
        .post(API_POST_SYSTEM_ALERT_SETTING, { ...convertedData, projectId })
        .then((response) => {
          if (response?.data?.data) {
            showToast('success', `${response.data.message}`)
            const convertedData = { ...response.data.data }
            boolKeys.forEach((key) => {
              convertedData[key] = convertedData[key] === SW_STATUS.YES
            })
            setSettingData((currentData) => ({
              ...currentData,
              ...convertedData
            }))
          }
        })
        .catch((err) => {
          showToast('error', `${err.response ? err.response.data.message : err.message}`)
        })
    ])
  }

  const onReset = () => {
    reset({})
    setPendingTimeLimit(selectedProject?.pendingTimeLimit)
    setSelectedSensor(sensorOptions.find((sensor) => sensor.value === selectedProject?.sensorDtuId) || null)
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className="system-alert-setting">
        <Row className="mb-3">
          <Col md={6}>
            <h5 className="mb-1 font-weight-bolder">
              <FormattedMessage id="Radiation sensor reference " />
            </h5>
            <Select
              name="sensor"
              isClearable
              isDisabled={ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING)}
              defaultValue={selectedSensor}
              value={selectedSensor}
              options={sensorOptions}
              className="react-select--project line-select"
              classNamePrefix="select"
              placeholder={<FormattedMessage id="Select sensor" />}
              onChange={onChangeSelect}
            />
          </Col>
          <Col md={6}>
            <h5 className="mb-1 font-weight-bolder">
              <FormattedMessage id="Pending time limit" />
              &nbsp; (<FormattedMessage id="minutes" />)
            </h5>
            <Input
              type="number"
              min={0}
              step={1}
              readOnly={ability.cannot('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING)}
              id="pendingTimeLimit"
              name="pendingTimeLimit"
              value={pendingTimeLimit}
              onChange={(e) => setPendingTimeLimit(e.target.value)}
            />
          </Col>
        </Row>
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
        {ability.can('manage', USER_ABILITY.CAN_UPDATE_SYSTEM_ALERT_SETTING) && (
          <div className="group-button">
            <Button.Ripple color="primary" className="mr-2" type="submit">
              <FormattedMessage id="Save" />
            </Button.Ripple>
            <Button.Ripple color="secondary" onClick={onReset}>
              <FormattedMessage id="Cancel" />
            </Button.Ripple>
          </div>
        )}
      </Form>
    </div>
  )
}

ProjectSetting.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ProjectSetting)
