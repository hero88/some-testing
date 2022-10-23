import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  CustomInput,
  Card,
  UncontrolledTooltip, CardBody
} from 'reactstrap'
import * as FileSaver from 'file-saver'
import { clearGeneralReport, getGeneralReport } from '@src/views/report/store/actions'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import ExcelJS from 'exceljs'
import CheckboxTree from '@src/views/report/projects/CheckboxTree'
import { REE_LOGO } from './common'
import { GENERAL_REPORT_TYPE } from '@constants/common'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import { ReactComponent as IconExport } from '@src/assets/images/svg/table/ic-export-2.svg'
import { ReactComponent as IconExportDark } from '@src/assets/images/svg/table/ic-export-2-dark.svg'
import { DatePicker } from 'element-react/next'

const GeneralReportTable2 = ({ intl }) => {
  const systemMeasurementCheckboxes = [
    {
      label: `1. ${intl.formatMessage({ id: 'Project measurement' })}`,
      value: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
      radioName: 'reportTypeRadio',
      isRadio: true,
      multiply: 1,
      children: [
        {
          label: intl.formatMessage({ id: 'All' }),
          value: 'ckbSystemMeasurementAll',
          containerClass: 'pl-0',
          disabledKey: 'reportTypeRadio',
          disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
          multiply: 1,
          children: [
            {
              label: intl.formatMessage({ id: 'Project realtime performance' }),
              value: 'ckbSystemRealtimePerformance',
              key: 'avgInstantPerformance',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
              multiply: 1
            },
            {
              label: intl.formatMessage({ id: 'Radiation and temperature' }),
              value: 'ckbRadiationAndTemperature',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Radiation' }),
                  value: 'ckbRadiation',
                  key: 'irr',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: `${intl.formatMessage({ id: 'Environment temperature' })} (°C)`,
                  value: 'ckbEnvironmentTemperature',
                  key: 'environmentTemperature',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Electrical room temperature' }),
                  value: 'ckbElectricalRoomTemperature',
                  key: 'roomTemp',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Panel temperature' }),
                  value: 'ckbPanelTemperature',
                  key: 'panelTemp',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                }
              ]
            },
            {
              label: intl.formatMessage({ id: 'Power' }),
              value: 'ckbPower',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Realtime power AC' }),
                  value: 'ckbRealtimePowerAC',
                  key: 'sumWattageAc',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Realtime power DC' }),
                  value: 'ckbRealtimePowerDC',
                  key: 'sumWattageDc',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Grid meter receive active power' }),
                  value: 'ckbGridMeterReceiveActivePower',
                  key: 'sumActivePower',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Grid meter receive reactive power' }),
                  value: 'ckbGridMeterReceiveReactivePower',
                  key: 'sumReactivePower',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1000
                }
              ]
            },
            {
              label: intl.formatMessage({ id: 'Frequency' }),
              value: 'ckbFrequency',
              key: 'avgFrequency',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
              multiply: 1
            },
            {
              label: intl.formatMessage({ id: 'Isolation resistance' }),
              value: 'ckbIsolationResistance',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Positive earth isolation resistance' }),
                  value: 'ckbPositiveEarthIsolationResistance',
                  key: 'avgArrayInsulationResistance',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Negative earth isolation resistance' }),
                  value: 'ckbNegativeEarthIsolationResistance',
                  key: 'negativeEarthIsolationResistance',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                }
              ]
            },
            {
              label: intl.formatMessage({ id: 'Voltage and current' }),
              value: 'ckbSystemVoltageAndCurrent',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Project phase A voltage' }),
                  value: 'ckbSystemPhaseAVoltage',
                  key: 'avgVoltageA',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Project phase B voltage' }),
                  value: 'ckbSystemPhaseBVoltage',
                  key: 'avgVoltageB',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Project phase C voltage' }),
                  value: 'ckbSystemPhaseCVoltage',
                  key: 'avgVoltageC',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Project phase A current' }),
                  value: 'ckbSystemPhaseACurrent',
                  key: 'sumCurrentA',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Project phase B current' }),
                  value: 'ckbSystemPhaseBCurrent',
                  key: 'sumCurrentB',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Project phase C current' }),
                  value: 'ckbSystemPhaseCCurrent',
                  key: 'sumCurrentC',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.SYSTEM.toString(10),
                  multiply: 1
                }
              ]
            }
          ]
        }
      ]

    }
  ]
  const inverterMeasurementCheckboxes = [
    {
      label: `2. ${intl.formatMessage({ id: 'Inverter measurement' })}`,
      value: GENERAL_REPORT_TYPE.INVERTER.toString(10),
      radioName: 'reportTypeRadio',
      isRadio: true,
      multiply: 1,
      children: [
        {
          label: intl.formatMessage({ id: 'All' }),
          value: 'ckbInverterMeasurementAll',
          containerClass: 'pl-0',
          disabledKey: 'reportTypeRadio',
          disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
          multiply: 1,
          children: [
            {
              label: intl.formatMessage({ id: 'Inverter realtime performance' }),
              value: 'ckbInverterRealtimePerformance',
              key: 'avgInstantPerformance',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
              multiply: 1
            },
            {
              label: intl.formatMessage({ id: 'Frequency' }),
              value: 'ckbInverterFrequency',
              key: 'frequency',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
              multiply: 1
            },
            {
              label: intl.formatMessage({ id: 'Inverter temperature' }),
              value: 'ckbInverterTemperature',
              key: 'temperature',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
              multiply: 1
            },
            {
              label: intl.formatMessage({ id: 'Power' }),
              value: 'ckbInverterPower',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Realtime power AC' }),
                  value: 'ckbInverterRealtimePowerAC',
                  key: 'wattageAc',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Realtime power DC' }),
                  value: 'ckbInverterRealtimePowerDC',
                  key: 'wattageDc',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1000
                }
              ]
            },
            {
              label: intl.formatMessage({ id: 'Voltage and current' }),
              value: 'ckbInverterVoltageAndCurrent',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Inverter phase A voltage' }),
                  value: 'ckbInverterPhaseAVoltage',
                  key: 'voltageA',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Inverter phase B voltage' }),
                  value: 'ckbInverterPhaseBVoltage',
                  key: 'voltageB',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Inverter phase C voltage' }),
                  value: 'ckbInverterPhaseCVoltage',
                  key: 'voltageC',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Inverter phase A current' }),
                  value: 'ckbInverterPhaseACurrent',
                  key: 'currentA',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Inverter phase B current' }),
                  value: 'ckbInverterPhaseBCurrent',
                  key: 'currentB',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Inverter phase C current' }),
                  value: 'ckbInverterPhaseCCurrent',
                  key: 'currentC',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                }
              ]
            },
            {
              label: intl.formatMessage({ id: 'Isolation resistance' }),
              value: 'ckbInverterIsolationResistance',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Positive earth isolation resistance' }),
                  value: 'ckbInverterPositiveEarthIsolationResistance',
                  key: 'arrayInsulationResistance',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                },
                {
                  label: intl.formatMessage({ id: 'Negative earth isolation resistance' }),
                  value: 'ckbInverterNegativeEarthIsolationResistance',
                  key: 'negativeEarthIsolationResistance',
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.INVERTER.toString(10),
                  multiply: 1
                }
              ]
            }
          ]
        }
      ]
    }
  ]
  const hoursCheckboxes = [
    {
      label: intl.formatMessage({ id: 'Normal hours' }),
      value: 'ckbNormalHours',
      disabledKey: 'reportTypeRadio',
      disabledValue: GENERAL_REPORT_TYPE.METER.toString(10)
    },
    {
      label: intl.formatMessage({ id: 'Peak hours' }),
      value: 'ckbPeakHours',
      disabledKey: 'reportTypeRadio',
      disabledValue: GENERAL_REPORT_TYPE.METER.toString(10)
    },
    {
      label: intl.formatMessage({ id: 'Off-peak hours' }),
      value: 'ckbOffPeakHours',
      disabledKey: 'reportTypeRadio',
      disabledValue: GENERAL_REPORT_TYPE.METER.toString(10)
    },
    {
      label: intl.formatMessage({ id: 'Total hours' }),
      value: 'ckbTotalHours',
      disabledKey: 'reportTypeRadio',
      disabledValue: GENERAL_REPORT_TYPE.METER.toString(10)
    }
  ]
  const meterMeasurementCheckboxes = [
    {
      label: `3. ${intl.formatMessage({ id: 'Meter measurement' })}`,
      value: GENERAL_REPORT_TYPE.METER.toString(10),
      radioName: 'reportTypeRadio',
      isRadio: true,
      multiply: 1,
      children: [
        {
          label: intl.formatMessage({ id: 'All' }),
          value: 'ckbMeterMeasurementAll',
          containerClass: 'pl-0',
          disabledKey: 'reportTypeRadio',
          disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
          multiply: 1,
          children: [
            {
              label: `a. ${intl.formatMessage({ id: 'Choose value' })}`,
              value: 'ckbChooseValue',
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
              multiply: 1,
              children: [
                {
                  label: intl.formatMessage({ id: 'Solar meter active power plus' }),
                  value: 'ckbSolarMeterActivePowerPlus',
                  relativeValues: hoursCheckboxes,
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Solar meter active power minus' }),
                  value: 'ckbSolarMeterActivePowerMinus',
                  relativeValues: hoursCheckboxes,
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Grid meter active power plus' }),
                  value: 'ckbGridMeterActivePowerPlus',
                  relativeValues: hoursCheckboxes,
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
                  multiply: 1000
                },
                {
                  label: intl.formatMessage({ id: 'Grid meter active power minus' }),
                  value: 'ckbGridMeterActivePowerMinus',
                  relativeValues: hoursCheckboxes,
                  disabledKey: 'reportTypeRadio',
                  disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
                  multiply: 1000
                }
              ]
            },
            {
              label: `b. ${intl.formatMessage({ id: 'Choose time' })}`,
              value: 'ckbChooseTime',
              isNotHeader: true,
              disabledKey: 'reportTypeRadio',
              disabledValue: GENERAL_REPORT_TYPE.METER.toString(10),
              children: hoursCheckboxes
            }
          ]
        }
      ]
    }
  ]
  const timeOptions = [
    { value: 5, label: `5 ${intl.formatMessage({ id: 'min' })}` },
    { value: 15, label: `15 ${intl.formatMessage({ id: 'min' })}` },
    { value: 30, label: `30 ${intl.formatMessage({ id: 'min' })}` },
    { value: 60, label: `60 ${intl.formatMessage({ id: 'min' })}` }
  ]

  const dispatch = useDispatch(),
    {
      report: { generalReportData: reportData },
      customerProject: { allData: projectAllData },
      layout: { skin }
    } = useSelector((store) => store),
    [picker, setPicker] = useState(new Date()),
    [modal, setModal] = useState(false),
    [fileName, setFileName] = useState(`DeviceReport_${moment().format('DD/MM/YYYY')}`),
    [fileFormat, setFileFormat] = useState('xlsx'),
    [fromDate, setFromDate] = useState(moment(picker[0]).startOf('d').valueOf()),
    [toDate, setToDate] = useState(moment(picker[1]).startOf('d').valueOf()),
    [systemMeasurementChecked, setSystemMeasurementChecked] = useState({}),
    [inverterMeasurementChecked, setInverterMeasurementChecked] = useState({}),
    [meterMeasurementChecked, setMeterMeasurementChecked] = useState({}),
    [selectedReportType, setSelectedReportType] = useState({}),
    [samplingTime, setSamplingTime] = useState(timeOptions[0])

  const projectCheckboxes = [
    {
      label: intl.formatMessage({ id: 'Project' }),
      value: 'ckbAll',
      radioName: 'projectIdRadio',
      isRadio: true,
      isTextOnly: true,
      containerClass: 'container__all',
      children: projectAllData?.map(project => (
        {
          label: project.name,
          value: project.id?.toString(),
          radioName: 'projectIdRadio',
          isRadio: true
        }
      ))
    }
  ]

  const fetchProjectsReport = async (queryParam) => {
    const initParam = {
      projectIds: [Number(selectedReportType.projectIdRadio)].toString(),
      fromDate: moment(picker).startOf('d').format('YYYY-MM-DD'),
      toDate: moment(picker).endOf('d').format('YYYY-MM-DD'),
      rowsPerPage: -1,
      reportType: Number(selectedReportType.reportTypeRadio),
      interval: samplingTime.value,
      ...queryParam
    }

    await dispatch(getGeneralReport(initParam))
  }

  const onFilter = () => {
    const tempParam = {
      projectIds: '',
      page: 1
    }

    if (selectedReportType.projectIdRadio) {
      tempParam.projectIds = [Number(selectedReportType.projectIdRadio)].toString()
      fetchProjectsReport(tempParam)
    }
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  const addRow = (ws, data, section) => {
    const borderStyles = {
      top: { style: 'medium', color: { argb: 'ffffff' } },
      bottom: { style: 'medium', color: { argb: 'ffffff' } }
    }
    const row = ws.addRow(data)
    row.eachCell({ includeEmpty: true }, (cell) => {
      if (section?.border) {
        cell.border = borderStyles
      }
      if (section?.headerBorder) {
        cell.border = section.headerBorder
      }
      if (section?.alignment) {
        cell.alignment = section.alignment
      }
      if (section?.font) {
        cell.font = section.font
      }
      if (section?.fill) {
        cell.fill = section.fill
      }
      if (section?.numFmt) {
        cell.numFmt = section.numFmt
      }
      cell.protection = {
        locked: true,
        hidden: true
      }
    })
    if (section?.height > 0) {
      row.height = section.height
    }
    return row
  }

  const mappingSystemData = ({ data, selectedKey }) => {
    const tempData = [data.date, data.reportTime]
    const tempKeys = ['date', 'reportTime']
    const multiplySystemKeys = ['sumWattageAc', 'sumWattageDc', 'sumActivePower', 'sumReactivePower']
    const multiplyInverterKeys = ['wattageAc', 'wattageDc']

    switch (selectedReportType.reportTypeRadio) {
      case GENERAL_REPORT_TYPE.SYSTEM.toString(10): {
        Object.keys(selectedKey).forEach(key => {
          if (selectedKey[key] && !key.includes('ckb')) {
            tempData.push(multiplySystemKeys.includes(key) ? data[key] / 1000 : data[key])
            tempKeys.push(key)
          }
        })
        break
      }

      case GENERAL_REPORT_TYPE.INVERTER.toString(10): {
        data.devices.forEach(device => {
          Object.keys(selectedKey).forEach(key => {
            if (selectedKey[key] && !key.includes('ckb')) {
              tempData.push(multiplyInverterKeys.includes(key) ? device[key] / 1000 : device[key])
              tempKeys.push(key)
            }
          })
        })
        break
      }

      case GENERAL_REPORT_TYPE.METER.toString(10): {
        // 16 cases of yield
        // 1. ckbSolarMeterActivePowerPlus
        if (meterMeasurementChecked.ckbSolarMeterActivePowerPlus && meterMeasurementChecked.ckbNormalHours) {
          tempData.push(data.totalYieldNormalHourSolarPlus / 1000)
          tempKeys.push('totalYieldNormalHourSolarPlus')
        }

        if (meterMeasurementChecked.ckbSolarMeterActivePowerPlus && meterMeasurementChecked.ckbPeakHours) {
          tempData.push(data.totalYieldRushHourSolarPlus / 1000)
          tempKeys.push('totalYieldRushHourSolarPlus')
        }

        if (meterMeasurementChecked.ckbSolarMeterActivePowerPlus && meterMeasurementChecked.ckbOffPeakHours) {
          tempData.push(data.totalYieldPeakHourSolarPlus / 1000)
          tempKeys.push('totalYieldPeakHourSolarPlus')
        }

        if (meterMeasurementChecked.ckbSolarMeterActivePowerPlus && meterMeasurementChecked.ckbTotalHours) {
          tempData.push(data.totalYield3HourSolarPlus / 1000)
          tempKeys.push('totalYield3HourSolarPlus')
        }

        // 2. ckbSolarMeterActivePowerMinus
        if (meterMeasurementChecked.ckbSolarMeterActivePowerMinus && meterMeasurementChecked.ckbNormalHours) {
          tempData.push(data.totalYieldNormalHourSolarSub / 1000)
          tempKeys.push('totalYieldNormalHourSolarSub')
        }

        if (meterMeasurementChecked.ckbSolarMeterActivePowerMinus && meterMeasurementChecked.ckbPeakHours) {
          tempData.push(data.totalYieldRushHourSolarSub / 1000)
          tempKeys.push('totalYieldRushHourSolarSub')
        }

        if (meterMeasurementChecked.ckbSolarMeterActivePowerMinus && meterMeasurementChecked.ckbOffPeakHours) {
          tempData.push(data.totalYieldPeakHourSolarSub / 1000)
          tempKeys.push('totalYieldPeakHourSolarSub')
        }

        if (meterMeasurementChecked.ckbSolarMeterActivePowerMinus && meterMeasurementChecked.ckbTotalHours) {
          tempData.push(data.totalYield3HourSolarSub / 1000)
          tempKeys.push('totalYield3HourSolarSub')
        }

        // 3. ckbGridMeterActivePowerPlus
        if (meterMeasurementChecked.ckbGridMeterActivePowerPlus && meterMeasurementChecked.ckbNormalHours) {
          tempData.push(data.totalYieldNormalHourGridPlus / 1000)
          tempKeys.push('totalYieldNormalHourGridPlus')
        }

        if (meterMeasurementChecked.ckbGridMeterActivePowerPlus && meterMeasurementChecked.ckbPeakHours) {
          tempData.push(data.totalYieldRushHourGridPlus / 1000)
          tempKeys.push('totalYieldRushHourGridPlus')
        }

        if (meterMeasurementChecked.ckbGridMeterActivePowerPlus && meterMeasurementChecked.ckbOffPeakHours) {
          tempData.push(data.totalYieldPeakHourGridPlus / 1000)
          tempKeys.push('totalYieldPeakHourGridPlus')
        }

        if (meterMeasurementChecked.ckbGridMeterActivePowerPlus && meterMeasurementChecked.ckbTotalHours) {
          tempData.push(data.totalYield3HourGridPlus / 1000)
          tempKeys.push('totalYield3HourGridPlus')
        }

        // 4. ckbGridMeterActivePowerMinus
        if (meterMeasurementChecked.ckbGridMeterActivePowerMinus && meterMeasurementChecked.ckbNormalHours) {
          tempData.push(data.totalYieldNormalHourGridSub / 1000)
          tempKeys.push('totalYieldNormalHourGridSub')
        }

        if (meterMeasurementChecked.ckbGridMeterActivePowerMinus && meterMeasurementChecked.ckbPeakHours) {
          tempData.push(data.totalYieldRushHourGridSub / 1000)
          tempKeys.push('totalYieldRushHourGridSub')
        }

        if (meterMeasurementChecked.ckbGridMeterActivePowerMinus && meterMeasurementChecked.ckbOffPeakHours) {
          tempData.push(data.totalYieldPeakHourGridSub / 1000)
          tempKeys.push('totalYieldPeakHourGridSub')
        }

        if (meterMeasurementChecked.ckbGridMeterActivePowerMinus && meterMeasurementChecked.ckbTotalHours) {
          tempData.push(data.totalYield3HourGridSub / 1000)
          tempKeys.push('totalYield3HourGridSub')
        }

        break
      }
    }

    return {
      values: tempData,
      keys: tempKeys
    }
  }

  const addRowCustom = ({ ws, data, section, selectedKey }) => {
    const borderStyles = {
      top: { style: 'medium', color: { argb: 'ffffff' } },
      bottom: { style: 'medium', color: { argb: 'ffffff' } }
    }
    const parsedData = mappingSystemData({ data, selectedKey })
    const row = ws.addRow(parsedData.values)

    if (section?.height > 0) {
      row.height = section.height
    }

    parsedData.keys.forEach((item, index) => {
      const cell = row.getCell(index + 1)

      if (section?.border) {
        cell.border = borderStyles
      }
      if (section?.headerBorder) {
        cell.border = section.headerBorder
      }
      if (section?.alignment) {
        cell.alignment = section.alignment
      }
      if (section?.font) {
        cell.font = section.font
      }
      if (section?.fill) {
        cell.fill = section.fill
      }
      if (section?.numFmt) {
        cell.numFmt = section.numFmt
      }
    })
  }

  const mergeCellWithValue = (ws, from, to, value, prop) => {
    ws.mergeCells(`${from}:${to}`)
    ws.getCell(from).value = value
    ws.getCell(from).font = prop?.font
    ws.getCell(from).alignment = prop?.alignment
    ws.getRow(ws.getCell(from)._row._number).height = prop?.height

    if (prop?.fill) {
      ws.getCell(from).fill = prop?.fill
    }
  }

  const checkingHeader = ({ checkboxes, checkedObj }) => {
    const tempHeader = []

    checkboxes.forEach(cb => {
      if (!cb.isNotHeader) {
        if (cb.children?.length > 0) {
          tempHeader.push(...checkingHeader({ checkboxes: cb.children, checkedObj }))
        } else if (checkedObj[cb.key ? cb.key : cb.value]) {
          if (cb.relativeValues?.length > 0) {
            cb.relativeValues.forEach(item => {
              if (checkedObj[item.key ? item.key : item.value]) {
                tempHeader.push(`${cb.label} - ${item.label}`)
              }
            })
          } else {
            tempHeader.push(cb.label)
          }
        }
      }
    })

    return tempHeader
  }

  const renderHeader = ({ reportType, data, reportDates }) => {
    const tempHeader = [
      intl.formatMessage({ id: 'Date' }),
      intl.formatMessage({ id: 'Time' })
    ]

    switch (reportType) {
      case GENERAL_REPORT_TYPE.SYSTEM.toString(10): {
        // System measurement (type 2)
        tempHeader.push(...checkingHeader({
          checkboxes: systemMeasurementCheckboxes,
          checkedObj: systemMeasurementChecked
        }))
        break
      }

      case GENERAL_REPORT_TYPE.INVERTER.toString(10): {
        // Inverter measurement (type 3)
        if (reportDates.length) {
          const reportTimes = Object.keys(data.reports[reportDates[0]])

          if (reportTimes.length) {
            data.reports[reportDates[0]][reportTimes[0]].forEach(() => {
              tempHeader.push(...checkingHeader({
                checkboxes: inverterMeasurementCheckboxes,
                checkedObj: inverterMeasurementChecked
              }))
            })
          }
        }

        break
      }

      case GENERAL_REPORT_TYPE.METER.toString(10): {
        // Meter measurement (type 4)
        tempHeader.push(...checkingHeader({
          checkboxes: meterMeasurementCheckboxes,
          checkedObj: meterMeasurementChecked
        }))
        break
      }
    }

    return tempHeader
  }

  const renderWidth = ({ header }) => {
    const tempWidths = [{ width: 12 }, { width: 14 }]

    header?.forEach((item, index) => {
      if (index < header.length - 2) {
        tempWidths.push({ width: 20 })
      }
    })

    return tempWidths
  }

  const renderSystemSheet = ({ sheetNameValue, wb, project, title, reportType }) => {
    const reportDates = Object.keys(project?.reports)
    const sheetName = `${sheetNameValue}`
    const ws = wb.addWorksheet(sheetName),
      reportDate = `${intl.formatMessage({ id: 'Day' })}: ${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format('-DD/MM/YYYY')
      }`,
      myHeader = renderHeader({ reportType, data: project, reportDates }),
      widths = renderWidth({ header: myHeader })

    // Worksheet view setting (frozen, zoom,...)
    ws.views = [{ zoomScale: 60, zoomScaleNormal: 60 }]

    // Set row 1 height
    const row1 = ws.getRow(1)
    row1.height = 126
    row1.alignment = { horizontal: 'center', vertical: 'middle' }

    // Add image to workbook by filename
    const reeLogo = wb.addImage({
      base64: REE_LOGO,
      extension: 'png'
    })
    // Add image to worksheet by image id
    ws.addImage(reeLogo, {
      tl: { col: 0, row: 0 },
      ext: { width: 1700, height: 170 },
      editAs: 'absolute'
    })

    const titleProps = {
      height: 40,
      font: { name: 'Time New Roman', size: 28, bold: true, italic: true, color: { argb: 'ED7D31' } },
      alignment: { horizontal: 'left', vertical: 'middle' }
    }
    const dateProps = {
      height: 40,
      font: { name: 'Time New Roman', size: 14, bold: true, italic: true, color: { argb: '5B9BD5' } },
      alignment: { horizontal: 'left', vertical: 'middle' }
    }
    const headerProps = {
      headerBorder: {
        top: { style: 'medium', color: { argb: 'ffffff' } },
        left: { style: 'medium', color: { argb: 'ffffff' } }
      },
      height: 80,
      font: { name: 'Time New Roman', size: 12, bold: true, italic: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '008080'
        }
      }
    }

    const dataProps1 = {
      height: 25,
      font: { name: 'Time New Roman', size: 12, bold: false, color: { argb: '010000' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'fde9d9'
        }
      },
      numFmt: '#,##0.00'
    }
    const dataProps2 = {
      height: 25,
      font: { name: 'Time New Roman', size: 12, bold: false, color: { argb: '010000' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'd7dfea'
        }
      },
      numFmt: '#,##0.00'
    }

    if (widths && widths.length > 0) {
      ws.columns = widths
    }

    // Add title
    mergeCellWithValue(ws, 'B2', 'F2', title, titleProps)

    // Add report date
    mergeCellWithValue(ws, 'B3', 'C3', reportDate, dateProps)

    // Add project name
    mergeCellWithValue(
      ws,
      'E3',
      'F3',
      `${intl.formatMessage({ id: 'Project' })}: ${project.name}`,
      dateProps
    )

    // Add empty row
    addRow(ws, [], dateProps)
    addRow(ws, [], dateProps)

    // Add headers
    addRow(ws, myHeader, headerProps)

    // Add data
    if (reportDates?.length > 0) {
      reportDates.forEach((reportDate, dateIndex) => {
        switch (reportType) {
          // Report type 2, 4
          case GENERAL_REPORT_TYPE.SYSTEM.toString(10):
          case GENERAL_REPORT_TYPE.METER.toString(10): {
            if (project?.reports[reportDate]?.length > 0) {
              project.reports[reportDate].forEach((row, index) => {
                index % 2 === 0
                  ? addRowCustom({
                    ws,
                    data: {
                      date: index === 0 ? moment(Number(reportDate)).format('DD/MM/YYYY') : '',
                      ...row
                    },
                    section: dataProps2,
                    selectedKey: systemMeasurementChecked
                  })
                  : addRowCustom({
                    ws,
                    data: {
                      date: index === 0 ? moment(Number(reportDate)).format('DD/MM/YYYY') : '',
                      ...row
                    },
                    section: dataProps1,
                    selectedKey: systemMeasurementChecked
                  })
              })
            }
            break
          }

          // Report type 3
          case GENERAL_REPORT_TYPE.INVERTER.toString(10): {
            const reportTimes = Object.keys(project?.reports[reportDate])

            if (reportTimes.length) {
              reportTimes.forEach((reportTime, index) => {
                // Insert sub header (Inverter names)
                if (dateIndex === 0 && index === 0) {
                  const selectedKeys = Object.keys(inverterMeasurementChecked)
                    .filter(key => !key.includes('ckb') && inverterMeasurementChecked[key])
                  project.reports[reportDate][reportTime].forEach((inverter, index) => {
                    const startCol = 3 + (
                        index * selectedKeys.length
                      ),
                      endCol = 2 + (
                        (
                          index + 1
                        ) * selectedKeys.length
                      ),
                      tempCell = ws.getCell(5, startCol)

                    // Merge cell
                    ws.mergeCells(5, startCol, 5, endCol)

                    // Format cell
                    tempCell.value = inverter.deviceName
                    tempCell.font = headerProps.font
                    tempCell.alignment = headerProps.alignment
                    tempCell.fill = headerProps.fill
                    tempCell.border = headerProps.headerBorder
                  })
                }

                // Add row by report time
                index % 2 === 0
                  ? addRowCustom({
                    ws,
                    data: {
                      date: index === 0 ? moment(Number(reportDate)).format('DD/MM/YYYY') : '',
                      reportTime,
                      devices: project.reports[reportDate][reportTime]
                    },
                    section: dataProps2,
                    selectedKey: inverterMeasurementChecked
                  })
                  : addRowCustom({
                    ws,
                    data: {
                      date: index === 0 ? moment(Number(reportDate)).format('DD/MM/YYYY') : '',
                      reportTime,
                      devices: project.reports[reportDate][reportTime]
                    },
                    section: dataProps1,
                    selectedKey: inverterMeasurementChecked
                  })
              })
            }
            break
          }
        }
      })
    }

    // Setting sheet protection
    const optionProtect = {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatColumns: true,
      formatRows: true,
      sort: true,
      autoFilter: true
    }
    const randomPass = Math.floor(Math.random() * 10000)

    ws.protect(randomPass.toString(), optionProtect)
  }

  const exportToExcelPro = async () => {
    toggleModal()
    const wb = new ExcelJS.Workbook()

    switch (selectedReportType.reportTypeRadio) {
      case GENERAL_REPORT_TYPE.SYSTEM.toString(10): {
        renderSystemSheet({
          sheetNameValue: `${intl.formatMessage({ id: 'Devices report' })}`,
          title: `${intl.formatMessage({ id: 'Devices report' })}`,
          wb,
          project: reportData,
          reportType: selectedReportType.reportTypeRadio
        })
        break
      }

      case GENERAL_REPORT_TYPE.INVERTER.toString(10): {
        renderSystemSheet({
          sheetNameValue: `${intl.formatMessage({ id: 'Devices report' })}`,
          title: `${intl.formatMessage({ id: 'Devices report' })}`,
          wb,
          project: reportData,
          reportType: selectedReportType.reportTypeRadio
        })
        break
      }

      case GENERAL_REPORT_TYPE.METER.toString(10): {
        renderSystemSheet({
          sheetNameValue: `${intl.formatMessage({ id: 'Devices report' })}`,
          title: `${intl.formatMessage({ id: 'Devices report' })}`,
          wb,
          project: reportData,
          reportType: selectedReportType.reportTypeRadio
        })
        break
      }
    }

    const buf = await wb.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buf]), `${fileName}.${fileFormat}`)
  }

  const onChangePicker = (date) => {
    const validDate = date || new Date()
    const fromDate = moment(validDate)
      .startOf('d')
      .valueOf()
    const toDate = moment(validDate)
      .endOf('d')
      .valueOf()

    setPicker(validDate)
    setFromDate(fromDate)
    setToDate(toDate)
    setFileName(
      `DeviceReport_${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format('-DD/MM/YYYY')
      }`
    )

    if (selectedReportType.projectIdRadio) {
      fetchProjectsReport({
        projectIds: [Number(selectedReportType.projectIdRadio)].toString(),
        fromDate: moment(validDate).startOf('d').format('YYYY-MM-DD'),
        toDate: moment(validDate).endOf('d').format('YYYY-MM-DD')
      })
    }
  }

  const onChangeSelectTime = (event) => {
    setSamplingTime(event)

    if (selectedReportType.projectIdRadio) {
      fetchProjectsReport({
        projectIds: [Number(selectedReportType.projectIdRadio)].toString(),
        interval: event.value
      })
    }
  }

  useEffect(() => {
    switch (selectedReportType.reportTypeRadio) {
      case GENERAL_REPORT_TYPE.SYSTEM.toString(10): {
        setInverterMeasurementChecked({})
        setMeterMeasurementChecked({})
        break
      }

      case GENERAL_REPORT_TYPE.INVERTER.toString(10): {
        setSystemMeasurementChecked({})
        setMeterMeasurementChecked({})
        break
      }

      case GENERAL_REPORT_TYPE.METER.toString(10): {
        setSamplingTime(timeOptions[1])
        setInverterMeasurementChecked({})
        setSystemMeasurementChecked({})
        break
      }
    }

    dispatch(clearGeneralReport())
  }, [selectedReportType])

  return (
    <Card>
      <CardBody>
        <Row className='mb-2 d-flex justify-content-between'>
          <Col lg={2} md={2}>
            <Button.Ripple
              color='primary'
              onClick={onFilter}
              disabled={!selectedReportType.reportTypeRadio || !selectedReportType.projectIdRadio}
            >
              <FormattedMessage id='Filtering report'/>
            </Button.Ripple>
          </Col>
          <Col lg={6} md={9} className='d-flex align-items-center justify-content-end my-md-0 mt-1'>
            <Button.Ripple
              id='yieldReportExportBtn'
              className='px-1'
              color='flat'
              onClick={toggleModal}
              disabled={!selectedReportType.reportTypeRadio
                || !selectedReportType.projectIdRadio
                || reportData.length
                === 0}
            >
              {skin === 'dark' ? <IconExportDark/> : <IconExport/>}
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`yieldReportExportBtn`}>
              {intl.formatMessage({ id: 'Export' })}
            </UncontrolledTooltip>
            <DatePicker
              value={picker}
              placeholder={intl.formatMessage({ id: `Pick day` })}
              onChange={onChangePicker}
              disabledDate={time => time.getTime() > Date.now()}
              firstDayOfWeek={1}
            />
            <CreatableSelect
              name='samplingTime'
              options={
                selectedReportType.reportTypeRadio === GENERAL_REPORT_TYPE.METER.toString(10)
                  ? timeOptions.filter((options, index) => index > 0)
                  : timeOptions
              }
              defaultValue={
                selectedReportType.reportTypeRadio === GENERAL_REPORT_TYPE.METER.toString(10)
                  ? timeOptions[1]
                  : timeOptions[0]
              }
              value={samplingTime}
              className='react-select ml-1 w-25 zindex-2'
              classNamePrefix='select'
              onChange={onChangeSelectTime}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <CheckboxTree
              checkboxData={projectCheckboxes}
              optionObj={selectedReportType}
              setOptionObj={setSelectedReportType}
            />
          </Col>
          <Col md={3}>
            <CheckboxTree
              checkboxData={systemMeasurementCheckboxes}
              checkedObj={systemMeasurementChecked}
              setCheckedObj={setSystemMeasurementChecked}
              optionObj={selectedReportType}
              setOptionObj={setSelectedReportType}
            />
          </Col>
          <Col md={3}>
            <CheckboxTree
              checkboxData={inverterMeasurementCheckboxes}
              checkedObj={inverterMeasurementChecked}
              setCheckedObj={setInverterMeasurementChecked}
              optionObj={selectedReportType}
              setOptionObj={setSelectedReportType}
            />
          </Col>
          <Col md={3}>
            <CheckboxTree
              checkboxData={meterMeasurementCheckboxes}
              checkedObj={meterMeasurementChecked}
              setCheckedObj={setMeterMeasurementChecked}
              optionObj={selectedReportType}
              setOptionObj={setSelectedReportType}
            />
          </Col>
        </Row>
      </CardBody>

      <Modal isOpen={modal} toggle={() => toggleModal()} className='modal-dialog-centered'>
        <ModalHeader toggle={() => toggleModal()}>{intl.formatMessage({ id: 'Export Excel' })}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type='text'
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={intl.formatMessage({ id: 'Enter file Name' })}
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type='select'
              id='selectFileFormat'
              name='customSelect'
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
            >
              <option>xlsx</option>
            </CustomInput>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={() => exportToExcelPro()}>
            {intl.formatMessage({ id: 'Export' })}
          </Button>
          <Button color='flat-danger' onClick={() => toggleModal()}>
            {intl.formatMessage({ id: 'Cancel' })}
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  )
}

GeneralReportTable2.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(GeneralReportTable2)
