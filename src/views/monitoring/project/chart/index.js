import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'reactstrap'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import moment from 'moment'
import IconButton from '@mui/material/IconButton'

import { ReactComponent as IconExport } from '@src/assets/images/svg/table/ic-export-2.svg'
import { ReactComponent as IconExportDark } from '@src/assets/images/svg/table/ic-export-2-dark.svg'
import ParamTable from '@src/views/monitoring/project/chart/ParamTable'
import { API_MONITORING_CHART_TYPE, CHART_PARAM_TYPE, INTERVAL_BUTTON } from '@constants/common'
import CustomChart from '@src/views/monitoring/project/chart/CustomChart'
import SaveTemplate from '@src/views/monitoring/project/chart/SaveTemplate'
import TemplateLibrary from '@src/views/monitoring/project/chart/TemplateLibrary'
import {
  changeChartDatePicker, deleteChartFilterTemplate, getChartFilterTemplates,
  getProjectChartData, setCurrentTemplate
} from '@src/views/monitoring/projects/store/actions'
import { LightTooltip } from '@src/views/common/LightToolTip'
import { renderTimeOptions, selectUnitOfTime } from '@utils'
import ExportPopup from '@src/views/monitoring/project/chart/ExportPopup'
import ExcelJS from 'exceljs'
import * as FileSaver from 'file-saver'
import { REE_LOGO } from '@src/views/report/projects/common'
import { useQuery } from '@hooks/useQuery'
import { getUserData } from '@src/auth/utils'
import classnames from 'classnames'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import CustomCalendar from '@src/views/common/calendar'
import { RESET_CHART_FILTER } from '@constants/actions'

const MySweetAlert = withReactContent(SweetAlert)

const ProjectChart = ({ intl }) => {
  const dispatch = useDispatch()
  const { customerProject: { chart }, layout: { skin } } = useSelector(state => state)
  const query = useQuery()
  const projectId = query.get('projectId')
  const userData = getUserData()
  const [picker, setPicker] = useState(new Date()),
    [rangePicker, setRangePicker] = useState([new Date(), new Date()]),
    [rSelected, setRSelected] = useState(INTERVAL_BUTTON.DAY),
    [timeOptions, setTimeOptions] = useState(renderTimeOptions({ intl, type: rSelected })),
    [samplingTime, setSamplingTime] = useState(timeOptions[0]),
    [isOpenSaveModal, setIsOpenSaveModal] = useState(false),
    [isOpenLibraryModal, setIsOpenLibraryModal] = useState(false),
    [isOpenExportModal, setIsOpenExportModal] = useState(false),
    [isEditTemplate, setIsEditTemplate] = useState(false),
    [fileName, setFileName] = useState(
      `Project_Chart_${moment().format('DD/MM/YYYY')}`
    ),
    [fileFormat, setFileFormat] = useState('xlsx')

  const fetchChartData = ({ queryParam, templateData }) => {
    const requiredData = templateData || chart.paramData

    requiredData.forEach(param => {
      const initParam = {
        chartType: API_MONITORING_CHART_TYPE.COMMON,
        projectId,
        deviceId: param.paramType === CHART_PARAM_TYPE.DEVICE ? param.deviceId : undefined,
        monitoringType: param.type,
        seconds: chart.seconds,
        timeStep: chart.timeStep,
        timeUnit: chart.timeUnit,
        fromDate: chart.fromDate,
        toDate: chart.toDate,
        order: 'createDate asc',
        fields: [param.key],
        paramId: param.paramId,
        multiply: param.multiply,
        ...queryParam
      }

      dispatch(getProjectChartData(initParam))
    })
  }

  const onChangeSelectTime = (event) => {
    setSamplingTime(event)
    dispatch(changeChartDatePicker({
      seconds: event.value * 60,
      timeStep: event.value,
      timeUnit: event.timeUnit
    }))
    fetchChartData({
      queryParam: { seconds: event.value * 60, timeStep: event.value, timeUnit: event.timeUnit }
    })
  }

  const onChangePicker = (date) => {
    const validDate = date || new Date()
    const fromDate = moment(validDate).startOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      toDate = moment(validDate).endOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD')

    setPicker(validDate)
    dispatch(changeChartDatePicker({ fromDate, toDate }))
  }

  const onChangeRangePicker = (date) => {
    const validDate = date || [new Date(), new Date()]
    const fromDate = moment(validDate[0]).startOf('d').format('YYYY-MM-DD'),
      toDate = moment(validDate[1]).endOf('d').format('YYYY-MM-DD')

    setRangePicker(validDate)
    dispatch(changeChartDatePicker({ fromDate, toDate }))
  }

  const onChangeIntervalButton = ({ selectedButton, fromDate, toDate }) => {
    const validFromDate = moment(fromDate).startOf(selectUnitOfTime(selectedButton.id))
    const validToDate = moment(toDate).endOf(selectUnitOfTime(selectedButton.id))
    const queryParam = {
      fromDate: validFromDate.format('YYYY-MM-DD'),
      toDate: validToDate.format('YYYY-MM-DD')
    }
    let tempTimeOptions = timeOptions

    if (selectedButton.id !== rSelected) {
      tempTimeOptions = renderTimeOptions({ intl, type: selectedButton.id })
      queryParam.seconds = tempTimeOptions[0].value * 60
      queryParam.timeStep = tempTimeOptions[0].value
      queryParam.timeUnit = tempTimeOptions[0].timeUnit
    }

    setRSelected(selectedButton.id)
    dispatch(changeChartDatePicker(queryParam))
    fetchChartData({ queryParam })
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

  // Export data to file
  const handleExport = async () => {
    setIsOpenExportModal(false)

    const fromDate = rSelected !== INTERVAL_BUTTON.DAY ? picker : rangePicker[0],
      toDate = rSelected !== INTERVAL_BUTTON.DAY ? picker : rangePicker[1]

    const sheetName = `Project chart`
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet(sheetName),
      myTitle = `Project chart param`,
      reportDate = `${intl.formatMessage({ id: 'Day' })}: ${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format('-DD/MM/YYYY')
      }`

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
    ws.addImage(reeLogo, 'A1:P1')

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
      border: {
        top: { style: 'medium', color: { argb: 'ffffff' } },
        left: { style: 'medium', color: { argb: 'ffffff' } },
        bottom: { style: 'medium', color: { argb: 'ffffff' } }
      },
      height: 100,
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
      alignment: { horizontal: 'right', vertical: 'middle' },
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
      alignment: { horizontal: 'right', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'd7dfea'
        }
      },
      numFmt: '#,##0.00'
    }

    let myColumns = chart.paramData.length > 0
      ? chart.paramData.map(key => (
        {
          header: key.measuringPoint,
          key: key.paramId,
          width: 20
        }
      ))
      : []
    myColumns = [
      {
        header: intl.formatMessage({ id: 'Time' }),
        key: 'timeLabel',
        width: 23
      },
      ...myColumns
    ]

    // Add column headers and define column keys and widths
    ws.columns = myColumns

    // Add data to columns
    myColumns.forEach(column => {
      const currentColumn = ws.getColumn(column.key)

      currentColumn.values = [undefined, undefined, undefined, undefined, column.header, ...chart.dataObj[column.key]]
      currentColumn.eachCell((cell, rowNumber) => {
        if (rowNumber === 5) {
          cell.style = headerProps
        }

        if (rowNumber > 5) {
          if (rowNumber % 2 === 0) {
            cell.style = dataProps2
          } else {
            cell.style = dataProps1
          }
        }
      })
    })

    // Add title
    mergeCellWithValue(ws, 'B2', 'F2', myTitle, titleProps)

    // Add report date
    mergeCellWithValue(ws, 'B3', 'D3', reportDate, dateProps)

    // Add empty row
    addRow(ws, [], dateProps)

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

    const buf = await wb.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buf]), `${fileName}.${fileFormat}`)
  }

  // View template
  const viewTemplate = (template) => {
    dispatch(setCurrentTemplate(template))
    fetchChartData({
      queryParam: {},
      templateData: template.data
    })
    setIsOpenLibraryModal(false)
  }

  // Edit template
  const editTemplate = (template) => {
    setIsEditTemplate(true)
    dispatch(setCurrentTemplate(template))
    setIsOpenSaveModal(true)
  }

  // Confirm delete template
  const handleConfirmCancel = (template) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete template title' }, { name: template.name }),
      html: intl.formatMessage({ id: 'Delete template message' }, { name: template.name }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'Cancel' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark'
        }),
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.value) {
        await dispatch(deleteChartFilterTemplate(template))

        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Delete template successfully title' }),
          text: intl.formatMessage({ id: 'Delete template successfully message' }, { name: template.name }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Delete template fail title' }),
          text: intl.formatMessage({ id: 'Delete template fail message' }, { name: template.name }),
          icon: 'error',
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  // Delete template
  const deleteTemplate = (template) => {
    handleConfirmCancel(template)
  }

  // Component did mount
  useEffect(() => {
    if (userData) {
      dispatch(getChartFilterTemplates({
        userId: userData.id,
        projectId
      }))
    }

    return () => {
      dispatch({
        type: RESET_CHART_FILTER
      })
    }
  }, [])

  // Check rSelected to update Date picker format
  useEffect(() => {
    const tempTimeOptions = renderTimeOptions({ intl, type: rSelected })

    setTimeOptions(tempTimeOptions)
    setSamplingTime(tempTimeOptions[0])
  }, [rSelected])

  return (
    <div className='chart-page'>
      <Row className='mb-2'>
        <Col xl={7} lg={12} md={12} className='d-flex align-items-center justify-content-start mt-1'>
          <CustomCalendar
            rSelected={rSelected}
            picker={picker}
            onChangePicker={onChangePicker}
            rangePicker={rangePicker}
            onChangeRangePicker={onChangeRangePicker}
            onChangeIntervalButton={onChangeIntervalButton}
          />
          <CreatableSelect
            name='samplingTime'
            options={timeOptions}
            defaultValue={timeOptions[0]}
            value={samplingTime}
            className='react-select ml-1 zindex-2'
            classNamePrefix='select'
            onChange={onChangeSelectTime}
          />
        </Col>
        <Col xl={5} lg={12} md={12} className='d-flex align-items-center justify-content-end mt-1'>
          <LightTooltip
            title={intl.formatMessage({ id: 'Export' })}
            placement='top'
            arrow
          >
            <IconButton
              aria-label='Export'
              onClick={() => setIsOpenExportModal(true)}
            >
              {
                skin === 'dark'
                  ? <IconExportDark/>
                  : <IconExport/>
              }
            </IconButton>
          </LightTooltip>
          <Button
            id='templateLibraryButton'
            className='mx-1'
            color='secondary'
            onClick={() => setIsOpenLibraryModal(true)}
          >
            <FormattedMessage id='Template library'/>
          </Button>
          <Button
            id='saveTemplateButton'
            color='primary'
            onClick={() => setIsOpenSaveModal(true)}
          >
            <FormattedMessage id='Save template'/>
          </Button>
        </Col>
      </Row>
      <CustomChart/>
      <ParamTable/>
      <SaveTemplate
        isOpen={isOpenSaveModal}
        setIsOpen={setIsOpenSaveModal}
        isEdit={isEditTemplate}
      />
      <TemplateLibrary
        setIsOpen={setIsOpenLibraryModal}
        isOpen={isOpenLibraryModal}
        data={chart.templates}
        deleteTemplate={deleteTemplate}
        viewTemplate={viewTemplate}
        editTemplate={editTemplate}
      />
      <ExportPopup
        isOpen={isOpenExportModal}
        setIsOpen={setIsOpenExportModal}
        fileName={fileName}
        setFileName={setFileName}
        fileFormat={fileFormat}
        setFileFormat={setFileFormat}
        handleExport={handleExport}
      />
    </div>
  )
}

ProjectChart.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(ProjectChart)
