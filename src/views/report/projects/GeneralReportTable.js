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
import { getGeneralReport } from '@src/views/report/store/actions'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import ExcelJS from 'exceljs'
import CheckboxTree from '@src/views/report/projects/CheckboxTree'
import { REE_LOGO } from './common'
import _isNumber from 'lodash/isNumber'
import _meanBy from 'lodash/meanBy'

import { ReactComponent as IconExport } from '@src/assets/images/svg/table/ic-export-2.svg'
import { ReactComponent as IconExportDark } from '@src/assets/images/svg/table/ic-export-2-dark.svg'
import { selectUnitOfTime, sumByKey } from '@utils'
import CustomCalendar from '@src/views/common/calendar'
import { DISPLAY_DATE_FORMAT } from '@constants/common'

const GeneralReportTable = ({ intl }) => {
  const generalInfoCheckboxes = [
    {
      label: `1. ${intl.formatMessage({ id: 'General information' })}`,
      value: 'ckbGeneralInformation',
      children: [
        {
          label: intl.formatMessage({ id: 'Project code' }),
          value: 'ckbProjectCode',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Electricity code' }),
          value: 'ckbElectricityCode',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Customer name' }),
          value: 'ckbCustomerName',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Investor' }),
          value: 'ckbInvestor',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Business model' }),
          containerClass: 'pl-0',
          value: 'ckbBusinessModel'
        },
        {
          label: intl.formatMessage({ id: 'Address' }),
          value: 'ckbAddress',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Industrial area' }),
              value: 'ckbIndustrialArea'
            },
            {
              label: intl.formatMessage({ id: 'Province' }),
              value: 'ckbProvince'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Coordinate' }),
          value: 'ckbCoordinate',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Date of commission' }),
          value: 'ckbDateOfCommission',
          containerClass: 'pl-0'
        }
      ]
    }
  ]
  const technicalInfoCheckboxes = [
    {
      label: `2. ${intl.formatMessage({ id: 'Technical information' })}`,
      value: 'ckbTechnicalInformation',
      children: [
        {
          label: `${intl.formatMessage({ id: 'Installed power AC' })} (kW)`,
          value: 'ckbInstalledPowerAC',
          containerClass: 'pl-0'
        },
        {
          label: `${intl.formatMessage({ id: 'Installed power DC' })} (kWp)`,
          value: 'ckbInstalledPowerDC',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Inverter' }),
          value: 'ckbInverter',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Inverter manufacturer' }),
              value: 'ckbInverterManufacturer'
            },
            {
              label: intl.formatMessage({ id: 'Inverter type' }),
              value: 'ckbInverterType'
            },
            {
              label: `${intl.formatMessage({ id: 'Inverter power' })} (kW)`,
              value: 'ckbInverterPower'
            },
            {
              label: intl.formatMessage({ id: 'Number of inverters' }),
              value: 'ckbNumberOfInverters'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Solar meter' }),
          value: 'ckbSolarMeter',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Solar meter manufacturer' }),
              value: 'ckbSolarMeterManufacturer'
            },
            {
              label: intl.formatMessage({ id: 'Solar meter type' }),
              value: 'ckbSolarMeterType'
            },
            {
              label: intl.formatMessage({ id: 'Solar meter inspection valid until' }),
              value: 'ckbSolarMeterInspectionValidUntil'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Grid meter' }),
          value: 'ckbGridMeter',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Grid meter manufacturer' }),
              value: 'ckbGridMeterManufacturer'
            },
            {
              label: intl.formatMessage({ id: 'Grid meter type' }),
              value: 'ckbGridMeterType'
            },
            {
              label: intl.formatMessage({ id: 'Grid meter inspection valid until' }),
              value: 'ckbGridMeterInspectionValidUntil'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Panel' }),
          value: 'ckbPanel',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Panel manufacturer' }),
              value: 'ckbPanelManufacturer'
            },
            {
              label: intl.formatMessage({ id: 'Panel type' }),
              value: 'ckbPanelType'
            },
            {
              label: `${intl.formatMessage({ id: 'Panel power' })} (Wp)`,
              value: 'ckbPanelPower'
            },
            {
              label: intl.formatMessage({ id: 'Number of panels' }),
              value: 'ckbNumberOfPanels'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Transformer' }),
          value: 'ckbTransformer',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Transformer manufacturer' }),
              value: 'ckbTransformerManufacturer'
            },
            {
              label: `${intl.formatMessage({ id: 'Transformer power' })} (kVA)`,
              value: 'ckbTransformerPower'
            }
          ]
        }
      ]
    }
  ]
  const measurementInfoCheckboxes = [
    {
      label: `3. ${intl.formatMessage({ id: 'Measurement information' })}`,
      value: 'ckbMeasurementInformation',
      children: [
        {
          label: `${intl.formatMessage({ id: 'Performance' })} (%)`,
          value: 'ckbPerformance',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Cos phi ratio' }),
          value: 'ckbCosPhiRatio',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Equivalent hour' }),
          value: 'ckbEquivalentHour',
          containerClass: 'pl-0',
          children: [
            {
              label: `${intl.formatMessage({ id: 'Average equivalent hour' })} (h)`,
              value: 'ckbAverageEquivalentHour'
            },
            {
              label: `${intl.formatMessage({ id: 'CF ratio' })} (%)`,
              value: 'ckbCFRatio'
            }
          ]
        }
      ]
    }
  ]
  const hoursCheckboxes = [
    {
      label: intl.formatMessage({ id: 'Normal hours' }),
      value: 'ckbNormalHours'
    },
    {
      label: intl.formatMessage({ id: 'Peak hours' }),
      value: 'ckbPeakHours'
    },
    {
      label: intl.formatMessage({ id: 'Off-peak hours' }),
      value: 'ckbOffPeakHours'
    },
    {
      label: intl.formatMessage({ id: 'Total hours' }),
      value: 'ckbTotalHours'
    }
  ]
  const yieldInfoCheckboxes = [
    {
      label: `4. ${intl.formatMessage({ id: 'Yield' })}`,
      value: 'ckbYieldInformation',
      children: [
        {
          label: `${intl.formatMessage({ id: 'Solar yield' })} (kWh)`,
          value: 'ckbSolarYield',
          containerClass: 'pl-0'
        },
        {
          label: `${intl.formatMessage({ id: 'Theory yield' })} (kWh)`,
          value: 'ckbTheoryYield',
          containerClass: 'pl-0'
        },
        {
          label: `${intl.formatMessage({ id: 'Deviation yield' })} (%)`,
          value: 'ckbDeviationYield',
          containerClass: 'pl-0'
        },
        {
          label: intl.formatMessage({ id: 'Calculating by meter' }),
          value: 'ckbCalculatingByMeter',
          containerClass: 'pl-0',
          children: [
            {
              label: `a. ${intl.formatMessage({ id: 'Choose value' })}`,
              value: 'ckbChooseValue',
              children: [
                {
                  label: `${intl.formatMessage({ id: 'Solar yield production' })} (kWh)`,
                  value: 'ckbSolarYieldProduction',
                  relativeValues: hoursCheckboxes
                },
                {
                  label: `${intl.formatMessage({ id: 'Solar yield sale to grid' })} (kWh)`,
                  value: 'ckbSolarYieldSaleToGrid',
                  relativeValues: hoursCheckboxes
                },
                {
                  label: `${intl.formatMessage({ id: 'Solar yield sale to factory' })} (kWh)`,
                  value: 'ckbSolarYieldSaleToFactory',
                  relativeValues: hoursCheckboxes
                },
                {
                  label: `${intl.formatMessage({ id: 'EVN yield factory used' })} (kWh)`,
                  value: 'ckbEVNYieldFactoryUsed',
                  relativeValues: hoursCheckboxes
                },
                {
                  label: `${intl.formatMessage({ id: 'EVN yield solar used' })} (kWh)`,
                  value: 'ckbEVNYieldSolarUsed',
                  relativeValues: hoursCheckboxes
                },
                {
                  label: `${intl.formatMessage({ id: 'Solar and EVN yield factory used' })} (kWh)`,
                  value: 'ckbSolarEVNYieldFactoryUsed',
                  relativeValues: hoursCheckboxes
                }
              ]
            },
            {
              label: `b. ${intl.formatMessage({ id: 'Choose time' })}`,
              value: 'ckbChooseTime',
              isNotHeader: true,
              children: hoursCheckboxes
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Commerce yield' }),
          value: 'ckbCommerceYield',
          containerClass: 'pl-0',
          children: [
            {
              label: `${intl.formatMessage({ id: 'Commerce yield sale to factory' })} (kWh)`,
              value: 'ckbCommerceYieldSaleToFactory'
            },
            {
              label: `${intl.formatMessage({ id: 'Commerce yield sale to EVN' })} (kWh)`,
              value: 'ckbCommerceYieldSaleToEVN'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Lost yield' }),
          value: 'ckbLostYield',
          containerClass: 'pl-0',
          children: [
            {
              label: `${intl.formatMessage({ id: 'Lost yield by device faults' })} (kWh)`,
              value: 'ckbLostYieldByDeviceFaults'
            },
            {
              label: `${intl.formatMessage({ id: 'Lost yield by EVN reduction' })} (kWh)`,
              value: 'ckbLostYieldByEVNReduction'
            },
            {
              label: `${intl.formatMessage({ id: 'Lost yield by low performance' })} (kWh)`,
              value: 'ckbLostYieldByLowPerformance'
            },
            {
              label: `${intl.formatMessage({ id: 'Lost yield by other' })} (kWh)`,
              value: 'ckbLostYieldByOther'
            }
          ]
        }
      ]
    }
  ]
  const errorAndAlertCheckboxes = [
    {
      label: `5. ${intl.formatMessage({ id: 'Error and alert report' })}`,
      value: 'ckbErrorAndAlertReport',
      children: [
        {
          label: intl.formatMessage({ id: 'Error' }),
          value: 'ckbError',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Total error' }),
              value: 'ckbTotalError'
            },
            {
              label: intl.formatMessage({ id: 'Total error by each inverter' }),
              value: 'ckbTotalErrorInverter'
            },
            {
              label: intl.formatMessage({ id: 'Total error by each meter' }),
              value: 'ckbTotalErrorMeter'
            },
            {
              label: intl.formatMessage({ id: 'Total error by each string pin' }),
              value: 'ckbTotalErrorStringPin'
            },
            {
              label: intl.formatMessage({ id: 'Total error by project' }),
              value: 'ckbTotalErrorProject'
            }
          ]
        },
        {
          label: intl.formatMessage({ id: 'Alert' }),
          value: 'ckbAlert',
          containerClass: 'pl-0',
          children: [
            {
              label: intl.formatMessage({ id: 'Total alert' }),
              value: 'ckbTotalAlert'
            },
            {
              label: intl.formatMessage({ id: 'Total alert by each inverter' }),
              value: 'ckbTotalAlertInverter'
            },
            {
              label: intl.formatMessage({ id: 'Total alert by each meter' }),
              value: 'ckbTotalAlertMeter'
            },
            {
              label: intl.formatMessage({ id: 'Total alert by each string pin' }),
              value: 'ckbTotalAlertStringPin'
            }
          ]
        }
      ]
    }
  ]
  const yieldReductionCheckboxes = [
    {
      label: `6. ${intl.formatMessage({ id: 'EVN reduction' })}`,
      value: 'ckbEVNReduction',
      children: [
        {
          label: intl.formatMessage({ id: 'Total request of yield reduction' }),
          value: 'ckbTotalRequestOfYieldReduction',
          containerClass: 'pl-0'
        },
        {
          label: `${intl.formatMessage({ id: 'Yield reduction time' })} (h)`,
          value: 'ckbYieldReductionTime',
          containerClass: 'pl-0'
        },
        {
          label: `${intl.formatMessage({ id: 'EVN yield reduction' })} (kWh)`,
          value: 'ckbEVNYieldReduction',
          containerClass: 'pl-0'
        },
        {
          label: `${intl.formatMessage({ id: 'Yield reduction percentage' })} (%)`,
          value: 'ckbYieldReductionPercentage',
          containerClass: 'pl-0'
        }
      ]
    }
  ]

  const inverterKeys = [
    'inverterManufacturer',
    'inverterType',
    'inverterPower',
    'inverterQuantity'
  ]
  const meterKeys = [
    'solarMeterManufacturer',
    'solarMeterType',
    'solarMeterVerificationTime',
    'gridMeterManufacturer',
    'gridMeterType',
    'gridMeterVerificationTime'
  ]
  const percentageKeys = [
    'avgPerformance',
    'avgCf',
    'deviationYield',
    'yieldReductionPercentage'
  ]

  const dispatch = useDispatch(),
    {
      report: { generalReportData: reportData },
      customerProject: { allData: projectAllData },
      layout: { skin }
    } = useSelector((store) => store),
    [picker, setPicker] = useState(new Date()),
    [rangePicker, setRangePicker] = useState([new Date(), new Date()]),
    [modal, setModal] = useState(false),
    [fileName, setFileName] = useState(`GeneralReport_${moment().format(DISPLAY_DATE_FORMAT)}`),
    [fileFormat, setFileFormat] = useState('xlsx'),
    [selectedProjectIds, setSelectedProjectIds] = useState([]),
    [fromDate, setFromDate] = useState(moment(picker[0]).startOf('d')),
    [toDate, setToDate] = useState(moment(picker[1]).startOf('d')),
    [rSelected, setRSelected] = useState('day'),
    [generalInfoChecked, setGeneralInfoChecked] = useState({}),
    [technicalInfoChecked, setTechnicalInfoChecked] = useState({}),
    [measurementInfoChecked, setMeasurementInfoChecked] = useState({}),
    [yieldInfoChecked, setYieldInfoChecked] = useState({}),
    [errorAlertChecked, setErrorAlertChecked] = useState({}),
    [yieldReductionChecked, setYieldReductionChecked] = useState({}),
    [projectChecked, setProjectChecked] = useState({})

  const projectCheckboxes = [
    {
      label: intl.formatMessage({ id: 'All' }),
      value: 'ckbAll',
      containerClass: 'container__all',
      children: projectAllData?.map(project => (
        {
          label: project.name,
          value: project.id
        }
      ))
    }
  ]

  const fetchProjectsReport = async (queryParam) => {
    const validFromDate = rSelected !== 'day' ? picker : rangePicker[0]
    const validToDate = rSelected !== 'day' ? picker : rangePicker[1]
    const initParam = {
      projectIds: selectedProjectIds,
      fromDate: moment(validFromDate).startOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      toDate: moment(validToDate).endOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      rowsPerPage: -1,
      ...queryParam
    }

    await dispatch(getGeneralReport(initParam))
  }

  const onFilter = () => {
    const tempParam = {
      projectIds: '',
      page: 1
    }

    if (selectedProjectIds.length) {
      tempParam.projectIds = selectedProjectIds.toString()
    }

    fetchProjectsReport(tempParam)
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

  const addRowCustom = ({ ws, data, section }) => {
    const values = Object.values(data)
    const keys = Object.keys(data)
    const borderStyles = {
      top: { style: 'medium', color: { argb: 'ffffff' } },
      bottom: { style: 'medium', color: { argb: 'ffffff' } }
    }
    const row = ws.addRow(values)

    if (section?.height > 0) {
      row.height = section.height
    }

    keys.forEach((key, index) => {
      const cell = row.getCell(index + 1)

      if (section?.border) {
        cell.border = borderStyles
      }
      if (section?.headerBorder) {
        cell.border = section.headerBorder
      }
      if (section?.alignment) {
        cell.alignment = key === 'name' ? { horizontal: 'left', vertical: 'middle' } : section.alignment
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

      // Set color for inverter keys
      if (inverterKeys.includes(key)) {
        cell.font = { name: 'Time New Roman', size: 12, color: { argb: 'ED7D31' } }
      }

      // Set color for meter keys
      if (meterKeys.includes(key)) {
        cell.font = { name: 'Time New Roman', size: 12, color: { argb: '70AD47' } }
      }
      // Set percent for percent keys
      if (percentageKeys.includes(key)) {
        cell.numFmt = '#,##0.00%'
      }
    })

    return row
  }

  const mergeCells = (ws, row, from, to) => {
    ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`)
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
        } else if (checkedObj[cb.value]) {
          if (cb.relativeValues?.length > 0) {
            cb.relativeValues.forEach(item => {
              if (checkedObj[item.value]) {
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

  const renderHeader = () => {
    const tempHeader = [
      'STT',
      intl.formatMessage({ id: 'Project name' })
    ]

    // General information
    tempHeader.push(...checkingHeader({
      checkboxes: generalInfoCheckboxes,
      checkedObj: generalInfoChecked
    }))

    // Technical information
    tempHeader.push(...checkingHeader({
      checkboxes: technicalInfoCheckboxes,
      checkedObj: technicalInfoChecked
    }))

    // Measurement information
    tempHeader.push(...checkingHeader({
      checkboxes: measurementInfoCheckboxes,
      checkedObj: measurementInfoChecked
    }))

    // Yield information
    tempHeader.push(...checkingHeader({
      checkboxes: yieldInfoCheckboxes,
      checkedObj: yieldInfoChecked
    }))

    // Error and alert information
    tempHeader.push(...checkingHeader({
      checkboxes: errorAndAlertCheckboxes,
      checkedObj: errorAlertChecked
    }))

    // Yield reduction
    tempHeader.push(...checkingHeader({
      checkboxes: yieldReductionCheckboxes,
      checkedObj: yieldReductionChecked
    }))

    return tempHeader
  }

  const renderWidth = ({ header }) => {
    const tempWidths = [{ width: 10 }, { width: 50 }]

    header?.forEach((item, index) => {
      if (index < header.length - 2) {
        tempWidths.push({ width: 20 })
      }
    })

    return tempWidths
  }

  const renderFooter = ({ header, projects, projectOriginal }) => {
    const tempFooter = {
      name: 'TOTAL',
      name1: '' // use for merged cell
    }
    const projectKeys = Object.keys(projects[0])

    // Get inverter quantiy from original project
    const quantity = []
    projectOriginal.forEach((item) => {
      quantity.push([item.sungrowInverters?.length, item.smaInverters?.length])
    })

    // Get sungrow and sma inverter power from original project
    const powerInverter = []
    projectOriginal.forEach(item => {
      let powerSungrow = 0
      let powerSma = 0
      const tempSungrow = []
      const tempSma = []

      tempSungrow.push(item.sungrowInverters)
      tempSma.push(item.smaInverters)

      if (tempSungrow[0].length > 0) {
        tempSungrow[0].forEach(item => {
          if (item?.inverterType !== undefined) {
            powerSungrow += (item?.inverterType.power)
          }
        })
      }
      if (tempSma[0].length > 0) {
        tempSma[0].forEach(item => {
          if (item?.inverterType !== undefined) {
            powerSma += (item?.inverterType?.power)
          }
        })
      }

      powerInverter.push([(powerSungrow / 1000), (powerSma / 1000)])
    })

    // Get panel quantity and panel power from original project
    const quantityPanel = []
    const powerPanel = []
    projectOriginal.forEach((item) => {
      let tempNumberSum = 0
      let tempPowerSum = 0
      item.panels.forEach(i => {
        tempNumberSum += i.panelNumber
        tempPowerSum += i.ppv
      })
      quantityPanel.push(tempNumberSum)
      powerPanel.push(tempPowerSum)
    })

    const tempProjects = JSON.parse((JSON.stringify(projects)))

    // Push Inverter and Panel quantity to tempProject to calculation sum value
    quantity.forEach((item, index) => {
      tempProjects[index].inverterQuantity = item
    })
    quantityPanel.forEach((item, index) => {
      tempProjects[index].panelQuantity = item
    })
    // Push Inverter and Panel power to temProject to calculation sum value
    powerInverter.forEach((item, index) => {
      tempProjects[index].inverterPower = item
    })
    powerPanel.forEach((item, index) => {
      tempProjects[index].panelPower = item
    })
  
    const sumByReport = (data, index) => {
      let result = 0
      let tempResultIndex0 = 0
      let tempResultIndex1 = 0
      if (data.length > 0) {
        data.forEach((item) => {
          if (projectKeys[index] === 'inverterQuantity') {
            tempResultIndex0 += item.inverterQuantity[0]
            tempResultIndex1 += item.inverterQuantity[1]
            result = `${tempResultIndex0} / ${tempResultIndex1}`
          } else 
          if (projectKeys[index] === 'inverterPower') {
            tempResultIndex0 += item.inverterPower[0]
            tempResultIndex1 += item.inverterPower[1]
            result = `${tempResultIndex0} / ${tempResultIndex1}`
          } else 
          if (_isNumber(item[projectKeys[index]])) {
            result += item[projectKeys[index]]
          } else {
            result = ''
          }
        })
      }
      return result
    }    

    header?.forEach((item, index) => {
      if (index > 1) {
        tempFooter[projectKeys[index]] = percentageKeys.includes(projectKeys[index])
          ? _meanBy(tempProjects, project => project[projectKeys[index]])
          : sumByReport(tempProjects, index)
      }
    })

    return tempFooter
  }

  const renderSheet = (sheetNameValue, wb, clearData, projectOriginal) => {
    const sheetName = `${sheetNameValue}`
    const ws = wb.addWorksheet(sheetName),
      myTitle = `${intl.formatMessage({ id: 'Statistic report' })}`,
      reportDate = `${intl.formatMessage({ id: 'Day' })}: ${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      }`,
      myHeader = renderHeader(),
      widths = renderWidth({ header: myHeader }),
      myFooter = renderFooter({ header: myHeader, projects: clearData, projectOriginal })

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
      alignment: { vertical: 'middle' },
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
      alignment: { vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'd7dfea'
        }
      },
      numFmt: '#,##0.00'
    }
    const footerProps = {
      height: 30,
      font: { name: 'Time New Roman', size: 13, bold: true, color: { argb: '000000' } },
      alignment: { vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid', //darkVertical
        fgColor: {
          argb: 'E7E6E6'
        }
      },
      numFmt: '#,##0.00'
    }

    if (widths && widths.length > 0) {
      ws.columns = widths
    }

    // Add title
    mergeCellWithValue(ws, 'B2', 'F2', myTitle, titleProps)

    // Add report date
    mergeCellWithValue(ws, 'B3', 'D3', reportDate, dateProps)

    // Add empty row
    addRow(ws, [], dateProps)

    // Add headers
    addRow(ws, myHeader, headerProps)

    // Add data
    clearData?.forEach((row, index) => {
      index % 2 === 0
        ? addRowCustom({ ws, data: row, section: dataProps2 })
        : addRowCustom({ ws, data: row, section: dataProps1 })
    })

    // Add footer
    const row = addRowCustom({ ws, data: myFooter, section: footerProps })
    mergeCells(ws, row, 1, 2)

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

  const mappingSheetData = ({ project, index }) => {
    const tempProject = {
      stt: `${index + 1}`,
      name: project.name || ''
    }

    if (generalInfoChecked.ckbProjectCode) {
      tempProject.id =
        (
          typeof project?.code === 'string' ? project?.code?.substring(0, 4) : ''
        )
    }

    if (generalInfoChecked.ckbElectricityCode) {
      tempProject.electricityCode = project.electricityCode || ''
    }

    if (generalInfoChecked.ckbCustomerName) {
      tempProject.customerName = project?.customerName || ''
    }

    if (generalInfoChecked.ckbFactoryType) {
      tempProject.factoryType = project?.type ? intl.formatMessage({ id: project.type }) : ''
    }

    if (generalInfoChecked.ckbInvestor) {
      tempProject.investorName = project?.investorName || ''
    }

    if (generalInfoChecked.ckbBusinessModel) {
      tempProject.projectType = project?.type ? intl.formatMessage({ id: project.type }) : ''
    }

    if (generalInfoChecked.ckbIndustrialArea) {
      tempProject.industrialArea = project?.industrialAreaName
    }

    if (generalInfoChecked.ckbDistrict) {
      tempProject.districtName = project?.districtName || ''
    }

    if (generalInfoChecked.ckbProvince) {
      tempProject.provinceName = project?.provinceName ? intl.formatMessage({ id: project.provinceName }) : ''
    }

    if (generalInfoChecked.ckbCoordinate) {
      tempProject.coordinate = project?.lat && project?.lng ? `${project.lat}-${project.lng}` : ''
    }

    if (generalInfoChecked.ckbDateOfCommission) {
      tempProject.startDate = project?.startDate ? moment(Number(project.startDate)).format(DISPLAY_DATE_FORMAT) : ''
    }

    if (technicalInfoChecked.ckbInstalledPowerAC) {
      tempProject.wattageAC = project?.wattageAC / 1000 || 0
    }

    if (technicalInfoChecked.ckbInstalledPowerDC) {
      tempProject.wattageDC = project?.wattageDC / 1000 || 0
    }

    if (technicalInfoChecked.ckbInverterManufacturer) {
      tempProject.inverterManufacturer = sumByKey({
        data: [...project?.sungrowInverters, ...project?.smaInverters],
        key: 'manufacturer',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbInverterType) {
      if (project?.sungrowInverters.length > 0 && project?.smaInverters.length > 0) {
        tempProject.inverterType = sumByKey({
          data: project?.sungrowInverters,
          key: 'inverterModel',
          inverterType: 'inverterType',
          type: 'stringV3'
        }).concat(" / ", sumByKey({
          data: project?.smaInverters,
          key: 'inverterModel',
          inverterType: 'inverterType',
          type: 'stringV3'
        }))
      }
      if (project?.sungrowInverters.length > 0 && project?.smaInverters.length === 0) {
        tempProject.inverterType = sumByKey({
          data: project?.sungrowInverters,
          key: 'inverterModel',
          inverterType: 'inverterType',
          type: 'stringV3'
        })
      }
      if (project?.sungrowInverters.length === 0 && project?.smaInverters.length > 0) {
        tempProject.inverterType = sumByKey({
          data: project?.smaInverters,
          key: 'inverterModel',
          inverterType: 'inverterType',
          type: 'stringV3'
        })
      }
    }

    if (technicalInfoChecked.ckbInverterPower) {
        tempProject.inverterPower = sumByKey({
          data: project?.sungrowInverters,
          key: 'power',
          inverterType: 'inverterType',
          type: 'stringV3'
        }).concat(" / ", sumByKey({
          data: project?.smaInverters,
          key: 'power',
          inverterType: 'inverterType',
          type: 'stringV3'
        }))
    }

    if (technicalInfoChecked.ckbNumberOfInverters) {
      tempProject.inverterQuantity = ((project?.sungrowInverters?.length).toString()).concat(" / ", ((project?.smaInverters?.length).toString()))
    }

    if (technicalInfoChecked.ckbSolarMeterManufacturer) {
      tempProject.solarMeterManufacturer = sumByKey({
        data: project?.solarMeters,
        key: 'manufacturer',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbSolarMeterType) {
      tempProject.solarMeterType = sumByKey({
        data: project?.solarMeters,
        key: 'model',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbSolarMeterInspectionValidUntil) {
      tempProject.solarMeterVerificationTime = sumByKey({
        data: project?.solarMeters,
        key: 'verificationTime',
        type: 'timestamp'
      })
    }

    if (technicalInfoChecked.ckbGridMeterManufacturer) {
      tempProject.gridMeterManufacturer = sumByKey({
        data: project?.gridMeters,
        key: 'manufacturer',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbGridMeterType) {
      tempProject.gridMeterType = sumByKey({
        data: project?.gridMeters,
        key: 'model',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbGridMeterInspectionValidUntil) {
      tempProject.gridMeterVerificationTime = sumByKey({
        data: project?.gridMeters,
        key: 'verificationTime',
        type: 'timestamp'
      })
    }

    if (technicalInfoChecked.ckbPanelManufacturer) {
      tempProject.panelManufacturer = sumByKey({
        data: project?.panels,
        key: 'manufacturer',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbPanelType) {
      tempProject.panelType = sumByKey({
        data: project?.panels,
        key: 'panelModel',
        type: 'string'
      })
    }

    if (technicalInfoChecked.ckbPanelPower) {
      tempProject.panelPower = sumByKey({
        data: project?.panels,
        key: 'ppv',
        type: 'stringV2'
      })
    }

    if (technicalInfoChecked.ckbNumberOfPanels) {
      tempProject.panelQuantity = sumByKey({
        data: project?.panels,
        key: 'panelNumber',
        type: 'stringV2'
      })
    }

    if (technicalInfoChecked.ckbTransformerManufacturer) {
      tempProject.transformerManufacturer = project?.substationBrand
    }

    if (technicalInfoChecked.ckbTransformerPower) {
      tempProject.transformerPower = project?.substationPower / 1000 || 0
    }

    if (measurementInfoChecked.ckbPerformance) {
      tempProject.avgPerformance = project?.avgPerformance / 100 || 0
    }

    if (measurementInfoChecked.ckbCosPhiRatio) {
      tempProject.cosPhi = project?.cosPhi || 0
    }

    if (measurementInfoChecked.ckbAverageEquivalentHour) {
      tempProject.avgSunshine = project?.avgSunshine || 0
    }

    if (measurementInfoChecked.ckbCFRatio) {
      tempProject.avgCf = project?.cf || 0
    }

    if (yieldInfoChecked.ckbSolarYield) {
      tempProject.solarYield = project?.sumTotalYieldInverter / 1000 || 0
    }

    if (yieldInfoChecked.ckbTheoryYield) {
      tempProject.theoryYield = project?.sumTotalYieldTheory / 1000 || 0
    }

    if (yieldInfoChecked.ckbDeviationYield) {
      tempProject.deviationYield = project?.sumDiffTotalYieldInverterAndMeter || 0
    }

    // 24 cases of yield
    // 1. ckbSolarYieldProduction
    if (yieldInfoChecked.ckbSolarYieldProduction && yieldInfoChecked.ckbNormalHours) {
      tempProject.solarYieldProductionRate1 = project?.sumTotalYieldNormalHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldProduction && yieldInfoChecked.ckbPeakHours) {
      tempProject.solarYieldProductionRate2 = project?.sumTotalYieldRushHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldProduction && yieldInfoChecked.ckbOffPeakHours) {
      tempProject.solarYieldProductionRate3 = project?.sumTotalYieldPeakHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldProduction && yieldInfoChecked.ckbTotalHours) {
      tempProject.solarYieldProductionTotal = project?.sumTotalYield3HourSolar / 1000 || 0
    }

    // 2. ckbSolarYieldSaleToGrid
    if (yieldInfoChecked.ckbSolarYieldSaleToGrid && yieldInfoChecked.ckbNormalHours) {
      tempProject.solarYieldSaleToGridRate1 = project?.sumTotalYieldPushGridNormalHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldSaleToGrid && yieldInfoChecked.ckbPeakHours) {
      tempProject.solarYieldSaleToGridRate2 = project?.sumTotalYieldPushGridRushHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldSaleToGrid && yieldInfoChecked.ckbOffPeakHours) {
      tempProject.solarYieldSaleToGridRate3 = project?.sumTotalYieldPushGridPeakHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldSaleToGrid && yieldInfoChecked.ckbTotalHours) {
      tempProject.solarYieldSaleToGridTotal = project?.sumTotalYieldPushGrid3HourSolar / 1000 || 0
    }

    // 3. ckbSolarYieldSaleToFactory
    if (yieldInfoChecked.ckbSolarYieldSaleToFactory && yieldInfoChecked.ckbNormalHours) {
      tempProject.solarYieldSaleToFactoryRate1 = project?.sumTotalYieldFactoryUseNormalHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldSaleToFactory && yieldInfoChecked.ckbPeakHours) {
      tempProject.solarYieldSaleToFactoryRate2 = project?.sumTotalYieldFactoryUseRushHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldSaleToFactory && yieldInfoChecked.ckbOffPeakHours) {
      tempProject.solarYieldSaleToFactoryRate3 = project?.sumTotalYieldFactoryUsePeakHourSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbSolarYieldSaleToFactory && yieldInfoChecked.ckbTotalHours) {
      tempProject.solarYieldSaleToFactoryTotal = project?.sumTotalYieldFactoryUse3HourSolar / 1000 || 0
    }

    // 4. ckbEVNYieldFactoryUsed
    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbNormalHours) {
      tempProject.evnYieldFactoryUsedRate1 = project?.sumTotalYieldFactoryUseNormalHourEvn / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbPeakHours) {
      tempProject.evnYieldFactoryUsedRate2 = project?.sumTotalYieldFactoryUseRushHourEvn / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbOffPeakHours) {
      tempProject.evnYieldFactoryUsedRate3 = project?.sumTotalYieldFactoryUsePeakHourEvn / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbTotalHours) {
      tempProject.evnYieldFactoryUsedTotal = project?.sumTotalYieldFactoryUse3HourEvn / 1000 || 0
    }

    // 5. ckbEVNYieldSolarUsed
    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbNormalHours) {
      tempProject.evnYieldSolarUsedRate1 = project?.sumTotalYieldFactoryUseNormalHourEvnSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbPeakHours) {
      tempProject.evnYieldSolarUsedRate2 = project?.sumTotalYieldFactoryUseRushHourEvnSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbOffPeakHours) {
      tempProject.evnYieldSolarUsedRate3 = project?.sumTotalYieldFactoryUsePeakHourEvnSolar / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbTotalHours) {
      tempProject.evnYieldSolarUsedTotal = project?.sumTotalYieldFactoryUse3HourEvnSolar / 1000 || 0
    }

    // 5. ckbSolarEVNYieldFactoryUsed
    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbNormalHours) {
      tempProject.solarEVNYieldFactoryRate1 = project?.sumTotalYieldSolarAndFactoryUseNormalHour / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbPeakHours) {
      tempProject.solarEVNYieldFactoryRate2 = project?.sumTotalYieldSolarAndFactoryUseRushHour / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbOffPeakHours) {
      tempProject.solarEVNYieldFactoryRate3 = project?.sumTotalYieldSolarAndFactoryUsePeakHour / 1000 || 0
    }

    if (yieldInfoChecked.ckbEVNYieldFactoryUsed && yieldInfoChecked.ckbTotalHours) {
      tempProject.solarEVNYieldFactoryTotal = project?.sumTotalYieldSolarAndFactoryUse3Hour / 1000 || 0
    }
    // End 24 cases

    if (yieldInfoChecked.ckbCommerceYieldSaleToFactory) {
      tempProject.commerceYieldSaleToFactory = project?.sumSaleToFactory / 1000 || 0
    }

    if (yieldInfoChecked.ckbCommerceYieldSaleToEVN) {
      tempProject.commerceYieldSaleToEVN = project?.sumSaleToEvn / 1000 || 0
    }

    if (yieldInfoChecked.ckbLostYieldByDeviceFaults) {
      tempProject.lostYieldByDeviceFaults = project?.sumTotalYieldDecreasedDeviceError / 1000 || 0
    }

    if (yieldInfoChecked.ckbLostYieldByEVNReduction) {
      tempProject.lostYieldByEVNReduction = project?.sumTotalYieldDecreasedEvnCut / 1000 || 0
    }

    if (yieldInfoChecked.ckbLostYieldByLowPerformance) {
      tempProject.lostYieldByLowPerformance = project?.sumTotalYieldDecreasedLowPerformance / 1000 || 0
    }

    if (yieldInfoChecked.ckbLostYieldByOther) {
      tempProject.lostYieldByOther = project?.sumTotalYieldDecreasedOtherError / 1000 || 0
    }

    if (errorAlertChecked.ckbTotalError) {
      tempProject.totalErrors = project?.totalError || 0
    }

    if (errorAlertChecked.ckbTotalErrorInverter) {
      tempProject.totalErrorInverter = project?.totalInverterError || 0
    }

    if (errorAlertChecked.ckbTotalErrorMeter) {
      tempProject.totalErrorMeter = project?.totalMeterError || 0
    }

    if (errorAlertChecked.ckbTotalErrorStringPin) {
      tempProject.totalErrorStringPin = project?.totalStringPinError || 0
    }

    if (errorAlertChecked.ckbTotalErrorProject) {
      tempProject.totalErrorProject = project?.totalProjectError || 0
    }

    if (errorAlertChecked.ckbTotalAlert) {
      tempProject.totalAlerts = project?.totalWarning || 0
    }

    if (errorAlertChecked.ckbTotalAlertInverter) {
      tempProject.totalAlertInverter = project?.totalInverterWarning || 0
    }

    if (errorAlertChecked.ckbTotalAlertMeter) {
      tempProject.totalAlertMeter = project?.totalMeterWarning || 0
    }

    if (errorAlertChecked.ckbTotalAlertStringPin) {
      tempProject.totalAlertStringPin = project?.totalStringPinWarning || 0
    }

    if (yieldReductionChecked.ckbTotalRequestOfYieldReduction) {
      tempProject.totalRequestOfYieldReduction = project?.sumTotalYieldRequestCut / 1000 || 0
    }

    if (yieldReductionChecked.ckbYieldReductionTime) {
      tempProject.yieldReductionTime = project?.sumTotalTimeCut || 0
    }

    if (yieldReductionChecked.ckbEVNYieldReduction) {
      tempProject.evnYieldReduction = project?.sumTotalYieldDecreasedEvnCut / 1000 || 0
    }

    if (yieldReductionChecked.ckbYieldReductionPercentage) {
      tempProject.yieldReductionPercentage = project?.avgPercentCut || 0
    }

    return tempProject
  }

  const exportToExcelPro = async () => {
    toggleModal()
    const wb = new ExcelJS.Workbook()

    if (selectedProjectIds.length > 0) {
      renderSheet(
        `${intl.formatMessage({ id: 'Statistic report' })}`,
        wb,
        reportData?.map((project, index) => {
          return mappingSheetData({ project, index })
        }),
        reportData
      )
    }

    const buf = await wb.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buf]), `${fileName}.${fileFormat}`)
  }

  const onChangePicker = (date) => {
    const validDate = date || new Date()
    const fromDate = moment(validDate)
      .startOf(selectUnitOfTime(rSelected))

    const toDate = moment(validDate)
      .endOf(selectUnitOfTime(rSelected))

    setPicker(validDate)
    setFromDate(fromDate)
    setToDate(toDate)
    setFileName(
      `GeneralReport_${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format('-DD/MM/YYYY')
      }`
    )
  }

  const onChangeRangePicker = (date) => {
    const validDate = date || [new Date(), new Date()]
    const fromDate = moment(validDate[0])
      .startOf('d')

    let toDate = moment(validDate[1])
      .endOf('d')

    if (toDate - fromDate > 31 * 24 * 60 * 60 * 1000) {
      toDate = moment(validDate[0])
        .add(31, 'd')
        .endOf('d')
    }

    setRangePicker([fromDate, toDate])

    setFromDate(fromDate)
    setToDate(toDate)
    setFileName(
      `GeneralReport_${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format('-DD/MM/YYYY')
      }`
    )
  }

  const onChangeIntervalButton = ({ selectedButton, fromDate, toDate }) => {
    const validFromDate = moment(fromDate).startOf(selectUnitOfTime(selectedButton.id))
    const validToDate = moment(toDate).endOf(selectUnitOfTime(selectedButton.id))

    setRSelected(selectedButton.id)
    setFromDate(validFromDate)
    setToDate(validToDate)

    setFileName(
      `GeneralReport_${validFromDate.format('DD/MM/YYYY')}${
        validFromDate.date() === moment(validToDate).date() ? '' : moment(validToDate).format('-DD/MM/YYYY')
      }`
    )

    fetchProjectsReport({
      fromDate: validFromDate.format('YYYY-MM-DD'),
      toDate: validToDate.format('YYYY-MM-DD')
    })
  }

  // Selected project ids
  useEffect(() => {
    const tempProjectIds = []

    Object.keys(projectChecked).forEach(key => {
      if (key !== 'ckbAll' && projectChecked[key]) {
        tempProjectIds.push(Number(key))
      }
    })

    setSelectedProjectIds(tempProjectIds)
  }, [projectChecked])

  return (
    <Card>
      <CardBody>
        <Row className='mb-2 d-flex justify-content-between'>
          <Col lg={4} md={4}>
            <Button.Ripple
              color='primary'
              onClick={onFilter}
              disabled={selectedProjectIds.length < 1}
            >
              <FormattedMessage id='Filtering report'/>
            </Button.Ripple>
          </Col>
          <Col lg={4} md={6} className='d-flex align-items-center justify-content-end my-md-0 mt-1'>
            <Button.Ripple
              id='yieldReportExportBtn'
              className='px-1'
              color='flat'
              onClick={toggleModal}
              disabled={reportData?.length === 0}
            >
              {skin === 'dark' ? <IconExportDark/> : <IconExport/>}
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`yieldReportExportBtn`}>
              {intl.formatMessage({ id: 'Export' })}
            </UncontrolledTooltip>

            <CustomCalendar
              picker={picker}
              onChangePicker={onChangePicker}
              rangePicker={rangePicker}
              onChangeRangePicker={onChangeRangePicker}
              onChangeIntervalButton={onChangeIntervalButton}
              disabled={selectedProjectIds.length < 1}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <CheckboxTree
              checkboxData={projectCheckboxes}
              checkedObj={projectChecked}
              setCheckedObj={setProjectChecked}
            />
          </Col>
          <Col md={4}>
            <CheckboxTree
              checkboxData={generalInfoCheckboxes}
              checkedObj={generalInfoChecked}
              setCheckedObj={setGeneralInfoChecked}
            />
            <CheckboxTree
              checkboxData={technicalInfoCheckboxes}
              checkedObj={technicalInfoChecked}
              setCheckedObj={setTechnicalInfoChecked}
            />
            <CheckboxTree
              checkboxData={measurementInfoCheckboxes}
              checkedObj={measurementInfoChecked}
              setCheckedObj={setMeasurementInfoChecked}
            />
          </Col>
          <Col md={4}>
            <CheckboxTree
              checkboxData={yieldInfoCheckboxes}
              checkedObj={yieldInfoChecked}
              setCheckedObj={setYieldInfoChecked}
            />
            <CheckboxTree
              checkboxData={errorAndAlertCheckboxes}
              checkedObj={errorAlertChecked}
              setCheckedObj={setErrorAlertChecked}
            />
            <CheckboxTree
              checkboxData={yieldReductionCheckboxes}
              checkedObj={yieldReductionChecked}
              setCheckedObj={setYieldReductionChecked}
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

GeneralReportTable.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(GeneralReportTable)
