import {
  Badge,
  Card,
  Col,
  Row
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { ReactComponent as SungrowLogo } from '@src/assets/images/svg/sungrow-logo.svg'
import { ReactComponent as SMALogo } from '@src/assets/images/svg/Logo_SMA.svg'
import { DEVICE_STATUS, DEVICE_TYPE, TYPE_MODEL } from '@constants/project'
import { numberToFixed, numberWithCommas, showToast } from '@utils'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import _orderBy from 'lodash/orderBy'
import moment from 'moment'
import DropdownArrow from '@src/views/monitoring/devices/inverter/DropdownArrow'
import {
  getLatestMonitoringInverterById,
  getPanelsByInverterIds
} from '@src/views/monitoring/devices/inverter/store/actions'
import { useQuery } from '@hooks/useQuery'
import PieChart from '@src/views/monitoring/devices/inverter/PieChart'
import { ROUTER_URL } from '@constants/router'

import { getInverterById } from '@src/views/monitoring/project/devices/inverters/store/actions'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import ButtonPagination from '@src/views/common/buttons/ButtonPagination'
import { API_GET_SYSTEM_ALERT_SETTING } from '@constants/api'
import { SW_STATUS } from '@constants/common'
import { useWindowSize } from '@hooks/useWindowSize'

const boolKeys = ['inverterOverheatActive']

const InverterPanel = () => {
  const {
      inverter: { selectedInverter },
      monitoringInverter: { latestData, panels },
      customerProject: { selectedProject }
    } = useSelector((state) => state),
    dispatch = useDispatch(),
    query = useQuery(),
    projectId = query.get('projectId'),
    deviceId = query.get('deviceId'),
    typeModel = query.get('typeModel')

  const [width] = useWindowSize()
  const initInverterParam = {
    dcPower: undefined,
    acPower: undefined,
    powerPercentage: 0,
    efficiency: undefined,
    temperature: undefined,
    dailyYield: undefined,
    phaseACurrent: undefined,
    phaseBCurrent: undefined,
    phaseCCurrent: undefined,
    phaseAVoltage: undefined,
    phaseBVoltage: undefined,
    phaseCVoltage: undefined,
    frequency: undefined,
    reactivePower: undefined,
    insulationResistance: undefined
  }
  // State
  const [inverterParam, setInverterParam] = useState(initInverterParam),
    [settingData, setSettingData] = useState({}),
    [buttonsPerPage, setButtonsPerPage] = useState(3),
    [isValidTime, setIsValidTime] = useState(false)

  const mPPTCurrentKeys = [
    'mPPT1Current',
    'mPPT2Current',
    'mPPT3Current',
    'mPPT4Current',
    'mPPT5Current',
    'mPPT6Current',
    'mPPT7Current',
    'mPPT8Current',
    'mPPT9Current',
    'mPPT10Current',
    'mPPT11Current',
    'mPPT12Current'
  ]

  const fetchLatestMonitoringData = (param) => {
    const initParam = {
      deviceId,
      rowsPerPage: 1,
      order: 'createDate desc',
      monitoringType: typeModel === TYPE_MODEL.SMA.toString(10) ? 'smaInverter' : 'sungrowInverter'
    }

    dispatch(getLatestMonitoringInverterById({
      ...initParam,
      ...param
    }))
  }

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

  // Component did mount
  useEffect(async () => {
    await Promise.all([
      fetchLatestMonitoringData(),
      dispatch(getInverterById({ id: deviceId, fk: '*' })),
      dispatch(getPanelsByInverterIds(deviceId))
    ])
  }, [deviceId])

  useEffect(() => {
    if (projectId) {
      dispatch(
        getProjectById({
          id: projectId,
          fk: JSON.stringify(['users', 'devices', 'contacts', 'customer'])
        })
      )

      fetchAlertSetting({ projectId })
    }
  }, [projectId])

  useEffect(() => {
    const latestTimeDiff = latestData?.[0] ? moment().diff(latestData[0].createDate, 'seconds', true) : null
    const currentTime = moment()

    const tempIsValidTime = (
        (
          currentTime.hours() >= 6 && currentTime.hours() <= 20
        ) && latestTimeDiff > 0 && latestTimeDiff <= 600
      )
      || (
        (
          currentTime.hours() < 6 || currentTime.hours() > 20
        ) && latestTimeDiff > 0 && latestTimeDiff <= 4200
      )
    setIsValidTime(tempIsValidTime)

    if (latestData?.length > 0 && tempIsValidTime) {
      if (selectedInverter?.typeModel === TYPE_MODEL.SMA) {
        setInverterParam({
          dcPower: latestData[0]?.sumPowerDc?.value,
          acPower: latestData[0]?.sumActivePower?.value,
          powerPercentage: latestData[0]?.sumPowerDc?.value > 0
            ? numberWithCommas(latestData[0]?.sumActivePower?.value / latestData[0]?.sumPowerDc?.value * 100)
            : 0,
          efficiency: 0,
          temperature: latestData[0]?.averageInternalTemperature?.value,
          dailyYield: selectedInverter?.dailyYield,
          phaseACurrent: latestData[0]?.sumCurrentLineInverter?.value,
          phaseBCurrent: latestData[0]?.sumCurrentlineConductorL2Inverter?.value,
          phaseCCurrent: latestData[0]?.sumCurrentlineConductorL3Inverter?.value,
          phaseAVoltage: latestData[0]?.averageVoltageLineConductorL1ToN?.value,
          phaseBVoltage: latestData[0]?.averageVoltageLineConductorL2ToN?.value,
          phaseCVoltage: latestData[0]?.averageVoltageLineConductorL3ToN?.value,
          frequency: latestData[0]?.averagePowerFrequency?.value,
          reactivePower: latestData[0]?.totalReactivePower?.value,
          insulationResistance: latestData[0]?.arrayInsulationResistance?.value
        })
      } else {
        setInverterParam({
          dcPower: latestData[0]?.totalDcPower?.value,
          acPower: latestData[0]?.totalActivePower?.value,
          powerPercentage: latestData[0]?.totalPowerDc?.value > 0
            ? numberWithCommas(latestData[0]?.todayActivePower?.value / latestData[0]?.totalPowerDc?.value * 100)
            : 0,
          efficiency: latestData[0]?.internalAirTemperature?.value,
          temperature: latestData[0]?.internalAirTemperature?.value,
          dailyYield: selectedInverter?.dailyYield,
          phaseACurrent: latestData[0]?.phaseACurrent?.value,
          phaseBCurrent: latestData[0]?.phaseBCurrent?.value,
          phaseCCurrent: latestData[0]?.phaseCCurrent?.value,
          phaseAVoltage: latestData[0]?.phaseAVoltage?.value,
          phaseBVoltage: latestData[0]?.phaseBVoltage?.value,
          phaseCVoltage: latestData[0]?.phaseCVoltage?.value,
          frequency: latestData[0]?.gridFrequency?.value,
          reactivePower: latestData[0]?.totalReactivePower?.value,
          insulationResistance: latestData[0]?.arrayInsulationResistance?.value
        })
      }
    } else {
      setInverterParam(initInverterParam)
    }
  }, [latestData, deviceId])

  const renderPVs = ({ mpptIndex, numberStringsPerMPPT }) => {
    const strings = []
    for (let i = 1; i <= numberStringsPerMPPT; i++) {
      strings.push(<DropdownArrow
        key={i}
        name={`string${i}`}
        panels={panels.filter(panel => Number(panel.array) === i && panel.panelMPPTPosition === mpptIndex)}
      />)
    }

    return strings
  }

  const renderStrings = ({ numberStringsPerMPPT }) => {
    const strings = []
    for (let i = 1; i <= numberStringsPerMPPT; i++) {
      strings.push(<span key={i}>String {i}</span>)
    }

    return strings
  }

  useEffect(() => {
    if (width) {
      setButtonsPerPage(Math.floor((
        width - 1000
      ) / 100))
    }
  }, [width])

  return (
    <>
      {
        selectedProject?.devices?.length > 0 &&
        <div className='group float-right'>
          <ButtonPagination
            devices={_orderBy(
              selectedProject.devices.filter(device => device.typeDevice === DEVICE_TYPE.INVERTER),
              inverter => inverter.name,
              'asc'
            )}
            projectId={projectId}
            deviceId={deviceId}
            deviceType={DEVICE_TYPE.INVERTER}
            pathName={ROUTER_URL.PROJECT_INVERTER_DETAIL}
            perPage={buttonsPerPage}
          />
        </div>
      }
      <Card className='custom-width p-1'>
        {/* INVERTER DETAIL DIAGRAM */}
        <div className='group'>
          <div className='col2'>
            {(
              <Col className='inverter-currents__list'>
                {
                  latestData &&
                  latestData.length > 0 &&
                  mPPTCurrentKeys.map((key, index) => {
                    if ((
                      index < 9 || latestData[0][`mPPT${index + 1}Current`]?.value >= 0
                    ) && index < selectedInverter?.inverterType?.numberOfMPPT) {
                      const stringOddNumber = (
                          index * 2
                        ) + 1,
                        stringEvenNumber = (
                          index * 2
                        ) + 2

                      const stringOddValue = numberWithCommas(latestData[0][`string${stringOddNumber}Current`]?.value),
                        stringOddUnit = latestData[0][`string${stringOddNumber}Current`]?.unit || 'A'

                      const stringEvenValue = numberWithCommas(latestData[0][`string${stringEvenNumber}Current`]?.value),
                        stringEvenUnit = latestData[0][`string${stringEvenNumber}Current`]?.unit || 'A'

                      return (
                        <Row key={index}>
                          <div className='textPV'>
                            {
                              renderPVs({
                                mpptIndex: index + 1,
                                numberStringsPerMPPT: selectedInverter?.inverterType?.numberOfStringPerMPPT
                              })
                            }
                          </div>
                          <aside className='text-string'>
                            {
                              renderStrings({
                                numberStringsPerMPPT: selectedInverter?.inverterType?.numberOfStringPerMPPT
                              })
                            }
                          </aside>
                          <aside
                            className='arrow-inverter cursor-pointer'
                            style={{
                              backgroundImage: `url(${require(`@src/assets/images/svg/monitoring/ic_${selectedInverter?.inverterType?.numberOfStringPerMPPT}_strings.svg`).default})`
                            }}
                          >
                            {
                              selectedInverter?.typeModel === TYPE_MODEL.SUNGROW && isValidTime &&
                              <>
                                <span className='text-up'>
                                  {`${stringOddValue} ${stringOddUnit}`}
                                </span>
                                <span className='text-in'>
                                  {`${stringEvenValue} ${stringEvenUnit}`}
                                </span>
                              </>
                            }
                            {
                              isValidTime &&
                              <>
                                <span className='text-right'>
                                  {`${numberToFixed(latestData[0][`mPPT${index + 1}Current`]?.value)
                                  || 0}`} {`${latestData[0][key]?.unit || 'A'}`}
                                </span>
                                <span className='text-right-down'>
                                  {`${numberToFixed(latestData[0][`mPPT${index + 1}Voltage`]?.value)
                                  || 0}`} {`${latestData[0][key]?.unit || 'V'}`}
                                </span>
                              </>
                            }

                            <span className='text-last text-body'>MPPT{index + 1}</span>
                          </aside>
                        </Row>
                      )
                    }

                    return null
                  })
                }
              </Col>
            )}
          </div>
          <div className='col3'>
            <span>{numberWithCommas(inverterParam.dcPower / 1000)} kWp</span>
          </div>
          <div className='col4 inverter-currents__branch'>
            <div>
              {selectedInverter?.typeModel === TYPE_MODEL.SMA ? (
                <span>
                  <SMALogo/>
                </span>
              ) : (
                <span>
                  <SungrowLogo/>
                </span>
              )}
            </div>
            <Badge
              color={selectedInverter?.status === DEVICE_STATUS.INACTIVE ? 'danger' : 'success'}
              className='run'
            >
              {selectedInverter?.status === DEVICE_STATUS.INACTIVE ? 'OFF' : 'RUN'}
            </Badge>
            <div className='progress'>
              <PieChart percentage={inverterParam.powerPercentage}/>
              <div className='inner-circle'>
                <div className='center-text'>
                  <span className='text-gradient'>{inverterParam.powerPercentage}%</span>
                </div>
                <div className='sub-text'>
                  AC/DC
                </div>
              </div>
            </div>
            <div className='performance'>
              <aside className='one'>
                <label><FormattedMessage id='Efficiency'/></label>
                <span className='number'>{numberWithCommas(selectedInverter?.instantPerformance)}%</span>
              </aside>
              <div className='d-flex justify-content-between'>
                <aside
                  className={classnames(
                    'half',
                    {
                      'over-heat': settingData.inverterOverheatActive
                        && settingData.inverterOverheatValue <= inverterParam.temperature
                    }
                  )}
                >
                  <span className='number'>{numberWithCommas(inverterParam.temperature)}ºC</span>
                </aside>
                <aside className='half'>
                  <span className='number'>{numberWithCommas(inverterParam.dailyYield / 1000)}</span>
                  <span className='unit'>kWh</span>
                </aside>
              </div>
            </div>
          </div>
          <div className='col5 line-group'>
            <span className='left-red1'>{numberWithCommas(inverterParam.phaseACurrent)} A</span>
            <span className='left-red2'>{numberWithCommas(inverterParam.phaseAVoltage)} V</span>
            <span className='left-yellow1'>{numberWithCommas(inverterParam.phaseBCurrent)} A</span>
            <span className='left-yellow2'>{numberWithCommas(inverterParam.phaseBVoltage)} V</span>
            <span className='left-blue1'>{numberWithCommas(inverterParam.phaseCCurrent)} A</span>
            <span className='left-blue2'>{numberWithCommas(inverterParam.phaseBVoltage)} V</span>
            <aside className='right-blue'>
              <span>{numberWithCommas(inverterParam.acPower / 1000)} kW</span>
              <span>{numberWithCommas(inverterParam.frequency)} Hz</span>
              <span>{numberWithCommas(inverterParam.reactivePower / 1000)} kVAr</span>
              <span>{numberWithCommas(inverterParam.insulationResistance)} kΩ</span>
            </aside>
          </div>
        </div>
      </Card>
    </>
  )
}

InverterPanel.propTypes = {}

export default InverterPanel
