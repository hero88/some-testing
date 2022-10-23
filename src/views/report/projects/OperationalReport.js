import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
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
  UncontrolledTooltip,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Spinner, CardBody
} from 'reactstrap'
import * as FileSaver from 'file-saver'
import { clearProjectOperationReport, getProjectsOperateReport } from '@src/views/report/store/actions'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import AppCollapse from '@components/app-collapse'
import ExcelJS from 'exceljs'
import {
  renderExportAlertMessage,
  renderOperationalReportColumns
} from '@src/views/report/projects/columns/OperationalReportColumns'
import _countBy from 'lodash/countBy'
import { getProvinces } from '@constants/province'
import { getBusinessModels } from '@constants/project'
import {
  getUnionCode,
  getYears,
  selectUnitOfTime
} from '@utils'
import _groupBy from 'lodash/groupBy'
import REELogo from '@src/assets/images/logo/logo.png'
import { renderAlertStatus } from '@src/views/alert/AlertTable'
import {
  ALERT_TYPE,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_FORMAT_WORKSHEET,
  DISPLAY_DATE_TIME_FORMAT
} from '@constants/common'
import { ReactComponent as IconColumn } from '@src/assets/images/svg/table/ic-column.svg'
import { ReactComponent as IconExport } from '@src/assets/images/svg/table/ic-export-2.svg'
import { ReactComponent as IconExportDark } from '@src/assets/images/svg/table/ic-export-2-dark.svg'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroup from 'reactstrap/es/InputGroup'
import CustomCalendar from '@src/views/common/calendar'
import _intersection from 'lodash/intersection'
import classnames from 'classnames'

const OperationalReportTable = ({ intl }) => {
  const initCheckAll = {
    ckbAllInvestor: false,
    ckbAllCustomer: false,
    ckbAllElectricity: false,
    ckbAllProvince: false,
    ckbAllIndustrialArea: false,
    ckbAllYear: false,
    ckbAllBusinessModel: false
  }
  const requiredKeys = [
    { key: 'ID', unit: '' },
    { key: 'projectCode', unit: '' },
    { key: 'projectName', unit: '' },
    { key: 'businessModel', unit: '' },
    { key: 'wattageAC', unit: '(kW)' },
    { key: 'wattageDC', unit: '(kWp)' },
    { key: 'totalErrors', unit: '' },
    { key: 'totalWarning', unit: '' },
    { key: 'totalNoted', unit: '' },
    { key: 'meters', unit: '' },
    { key: 'inverters', unit: '' },
    { key: 'project', unit: '' },
    // { key: 'panels', unit: '' },
    { key: 'reductionYield', unit: '' }
  ]

  const dispatch = useDispatch(),
    {
      auth: { userData },
      report: { dataOR: reportData, paramsOR: paramsOR, summaryDataOR },
      customerProject: { allData: projectAllData, electricity, industrialAreas, investors },
      customer: { allData: customerAllData },
      layout: { skin }
    } = useSelector((store) => store),
    [picker, setPicker] = useState(new Date()),
    [rangePicker, setRangePicker] = useState(null),
    [modal, setModal] = useState(false),
    [fileName, setFileName] = useState('OperationalReport'),
    [fileFormat, setFileFormat] = useState('xlsx'),
    [selectedProjectIds, setSelectedProjectIds] = useState([]),
    [checkAll, setCheckAll] = useState(initCheckAll),
    [checkInvestor, setCheckInvestor] = useState({}),
    [checkCustomer, setCheckCustomer] = useState({}),
    [checkElectricity, setCheckElectricity] = useState({}),
    [checkProvince, setCheckProvince] = useState({}),
    [checkIndustrialArea, setCheckIndustrialArea] = useState({}),
    [checkYear, setCheckYear] = useState({}),
    [checkBusinessModel, setCheckBusinessModel] = useState({}),
    [fromDate, setFromDate] = useState(moment(picker[0]).startOf('d')),
    [toDate, setToDate] = useState(moment(picker[1]).startOf('d')),
    [rSelected, setRSelected] = useState('day'),
    [reportsByDay, setReportsByDay] = useState(null),
    [displayColumns, setDisplayColumns] = useState(requiredKeys),
    [dropdownOpen, setDropdownOpen] = useState(false),
    [selectAll, setSelectAll] = useState(false),
    [isExport, setIsExport] = useState(false),
    provinces = getProvinces(intl),
    businessModels = getBusinessModels(intl),
    years = getYears(projectAllData),
    [searchValue, setSearchValue] = useState(paramsOR?.q || ''),
    [filterIcon, setFilterIcon] = useState(false),
    [selectedProjectIdsByKey, setSelectedProjectIdsByKey] = useState({})

  const checkValueInArray = ({
    selectedData,
    item,
    isChecked
  }) => {
    const ids = [...selectedData]
    const index = ids.findIndex((id) => id === item.id)

    if (isChecked && index === -1) {
      ids.push(item.id)
    } else if (!isChecked && index > -1) {
      ids.splice(index, 1)
    }

    return ids
  }

  const checkingIsCheckedByKey = ({ parentId, item }) => {
    switch (parentId) {
      case 'ckbAllInvestor':
        return checkInvestor[item.id]

      case 'ckbAllCustomer':
        return checkCustomer[item.id]

      case 'ckbAllElectricity':
        return checkElectricity[item.id]

      case 'ckbAllProvince':
        return checkProvince[item.id]

      case 'ckbAllIndustrialArea':
        return checkIndustrialArea[item.id]

      case 'ckbAllYear':
        return checkYear[item.id]

      case 'ckbAllBusinessModel':
        return checkBusinessModel[item.id]

      case 'project':
        return selectedProjectIds.findIndex((id) => id === item.id) > -1

      default:
        return false
    }
  }

  const selectProjectsByKey = ({ projects, key, childKey }) => {
    const tempProjectIdsByKey = []

    projects.forEach(project => {
      if (
        (
          project[key] === childKey
          || (
            childKey === 'all' && (
              project[key] > 0 || project[key]?.length >= 3
            )
          )
          || (
            key === 'startDate' && moment(Number(project[key])).year() === childKey
          )
        )
        && !selectedProjectIdsByKey?.[key]?.includes(project.id)
      ) {
        tempProjectIdsByKey.push(project.id)
      }
    })

    setSelectedProjectIdsByKey((currentState) => (
      {
        ...currentState,
        [key]: currentState[key] ? [...currentState[key], ...tempProjectIdsByKey] : tempProjectIdsByKey
      }
    ))
  }

  const unselectProjectsByKey = ({ projects, key, childKey }) => {
    const tempProjectIdsByKey = selectedProjectIdsByKey[key]

    projects.forEach(project => {
      if (
        (
          project[key] === childKey
          || (
            childKey === 'all' && (
              project[key] > 0 || project[key]?.length >= 3
            )
          )
          || (
            key === 'startDate' && moment(Number(project[key])).year() === Number(childKey)
          )
        )
        && selectedProjectIdsByKey?.[key]?.includes(project.id)
      ) {
        const index = selectedProjectIdsByKey?.[key]?.findIndex((id) => id === project.id)

        tempProjectIdsByKey.splice(index, 1)
      }
    })

    setSelectedProjectIdsByKey((currentState) => {
      if (tempProjectIdsByKey.length > 0) {
        return {
          ...currentState,
          [key]: tempProjectIdsByKey
        }
      } else {
        // Check to remove the selected key for inner join working
        delete currentState[key]

        return { ...currentState }
      }
    })
  }

  const setIsCheckAll = ({
    event,
    childKey,
    childState,
    setChildState,
    childData,
    childDataKey,
    parentKey,
    setParentState,
    projects
  }) => {
    const tempChildState = { ...childState }

    tempChildState[childKey] = event.target.checked
    setChildState(tempChildState)

    const tempIsSelectAll = _countBy(tempChildState, (value) => value)?.true === childData.length

    setParentState((currentState) => (
      {
        ...currentState,
        [parentKey]: tempIsSelectAll
      }
    ))

    // Push / remove select project to selected project ids
    if (event.target.checked) {
      selectProjectsByKey({ projects, childKey, key: childDataKey })
    } else {
      unselectProjectsByKey({ projects, childKey, key: childDataKey })
    }
  }

  const handleChangeCheckBoxItem = ({ event, item, parentId }) => {
    const { checked } = event.target
    switch (parentId) {
      case 'ckbAllInvestor':
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkInvestor,
          setChildState: setCheckInvestor,
          childData: investors,
          childDataKey: 'investorId',
          projects: projectAllData,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break

      case 'ckbAllCustomer': {
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkCustomer,
          setChildState: setCheckCustomer,
          childData: customerAllData,
          childDataKey: 'partnerId',
          projects: projectAllData,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break
      }

      case 'ckbAllElectricity':
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkElectricity,
          setChildState: setCheckElectricity,
          childData: electricity,
          childDataKey: 'electricityId',
          projects: projectAllData,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break

      case 'ckbAllProvince':
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkProvince,
          setChildState: setCheckProvince,
          childDataKey: 'provinceCode',
          projects: projectAllData,
          childData: provinces,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break

      case 'ckbAllIndustrialArea':
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkIndustrialArea,
          setChildState: setCheckIndustrialArea,
          childData: industrialAreas,
          childDataKey: 'industrialAreaId',
          projects: projectAllData,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break

      case 'ckbAllYear':
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkYear,
          setChildState: setCheckYear,
          childData: years,
          childDataKey: 'startDate',
          projects: projectAllData,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break

      case 'ckbAllBusinessModel': {
        setIsCheckAll({
          event,
          childKey: item.id,
          childState: checkBusinessModel,
          setChildState: setCheckBusinessModel,
          childData: businessModels,
          childDataKey: 'type',
          projects: projectAllData,
          parentKey: parentId,
          setParentState: setCheckAll
        })
        break
      }

      case 'project': {
        setSelectedProjectIds(
          checkValueInArray({
            selectedData: selectedProjectIds,
            item,
            isChecked: checked
          })
        )
        break
      }

      default:
        break
    }
  }

  const renderCheckboxItems = (items, parentId) => {
    return items.map((item, index) => {
      return (
        <CustomInput
          key={index}
          type='checkbox'
          className='custom-control-Primary'
          checked={checkingIsCheckedByKey({ parentId, item }) || false}
          onChange={(event) => handleChangeCheckBoxItem({ event, item, parentId })}
          value={item.id}
          id={`ckb_${item.name || item.fullName}_${item.id}`}
          name={item.id}
          label={item.name || item.fullName}
        />
      )
    })
  }

  const checkingIsCheckAll = (key) => {
    return checkAll[key]
  }

  const handleChangeTitleCheckbox = (event) => {
    const { name, checked } = event.target

    setCheckAll((
      currentState => (
        {
          ...currentState,
          [name]: checked
        }
      )
    ))

    switch (name) {
      case 'ckbAllInvestor': {
        const tempState = { ...checkInvestor }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckInvestor(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'investorId' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'investorId' })
        }
        break
      }

      case 'ckbAllCustomer': {
        const tempState = { ...checkCustomer }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckCustomer(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'partnerId' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'partnerId' })
        }
        break
      }

      case 'ckbAllElectricity': {
        const tempState = { ...checkElectricity }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckElectricity(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'electricityId' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'electricityId' })
        }
        break
      }

      case 'ckbAllProvince': {
        const tempState = { ...checkProvince }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckProvince(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'provinceCode' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'provinceCode' })
        }
        break
      }

      case 'ckbAllIndustrialArea': {
        const tempState = { ...checkIndustrialArea }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckIndustrialArea(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'industrialAreaId' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'industrialAreaId' })
        }
        break
      }

      case 'ckbAllYear': {
        const tempState = { ...checkYear }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckYear(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'startDate' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'startDate' })
        }
        break
      }

      case 'ckbAllBusinessModel': {
        const tempState = { ...checkBusinessModel }

        Object.keys(tempState).forEach(key => {
          tempState[key] = checked
        })

        setCheckBusinessModel(tempState)
        // Push / remove select project to selected project ids
        if (event.target.checked) {
          selectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'type' })
        } else {
          unselectProjectsByKey({ projects: projectAllData, childKey: 'all', key: 'type' })
        }
        break
      }
    }
  }

  const renderTitleCheckbox = ({ id, name }) => {
    return <CustomInput
      key={id}
      type='checkbox'
      className='custom-control-Primary'
      checked={checkingIsCheckAll(id) || false}
      onChange={handleChangeTitleCheckbox}
      value={id}
      id={`ckb_${name}_${id}`}
      name={id}
      label={intl.formatMessage({ id: name })}
    />
  }

  const filterDataByKey = ({ items, key }) => {
    const tempData = []

    projectAllData.forEach(project => {
      items.forEach(item => {
        if (!tempData.find(e => e.id === item.id) && project[key] === item.id) {
          tempData.push(item)
        }
      })
    })

    return tempData
  }

  const checkingActiveParents = (data) => {
    const tempActiveParents = []

    data.forEach((item, index) => {
      if (item.keyObj && Object.values(item.keyObj).some(bool => bool)) {
        tempActiveParents.push(index)
      }
    })

    return tempActiveParents
  }

  const checkingActiveProjects = (data) => {
    const tempActiveProjects = []

    data.forEach((item, index) => {
      if (selectedProjectIds.some(id => item.projects.findIndex(project => project.id === id) > -1)) {
        tempActiveProjects.push(index)
      }
    })

    return tempActiveProjects
  }

  const renderInvestorProjects = () => {
    const filteredInvestors = filterDataByKey({ items: investors, key: 'investorId' })
    const filteredData = filteredInvestors.map(investor => (
      {
        keyObj: selectedProjectIds,
        title: renderCheckboxItems([investor], 'ckbAllInvestor'),
        content: [
          renderCheckboxItems(
            projectAllData.filter(project => project.investorId === investor.id),
            'project'
          )
        ],
        projects: projectAllData.filter(project => project.investorId === investor.id)
      }
    ))

    return <AppCollapse
      data={filteredData}
      active={checkingActiveProjects(filteredData)}
    />
  }

  const renderCustomerProjects = () => {
    const filteredCustomers = filterDataByKey({ items: customerAllData, key: 'partnerId' })
    const filteredData = filteredCustomers.map(customer => (
      {
        keyObj: selectedProjectIds,
        title: renderCheckboxItems([customer], 'ckbAllCustomer'),
        content: [
          renderCheckboxItems(
            projectAllData.filter(project => project?.partnerId === customer.id),
            'project'
          )
        ],
        projects: projectAllData.filter(project => project.investorId === customer.id)
      }
    ))

    return <AppCollapse
      data={filteredData}
      active={checkingActiveProjects(filteredData)}
    />
  }

  const titleData = [
    {
      keyObj: checkYear,
      title: renderTitleCheckbox({ id: 'ckbAllYear', name: 'Year' }),
      content: [renderCheckboxItems(years, 'ckbAllYear')]
    },
    {
      keyObj: checkBusinessModel,
      title: renderTitleCheckbox({ id: 'ckbAllBusinessModel', name: 'Business model' }),
      content: [renderCheckboxItems(businessModels, 'ckbAllBusinessModel')]
    },
    {
      keyObj: checkInvestor,
      title: renderTitleCheckbox({ id: 'ckbAllInvestor', name: 'Investor' }),
      content: renderInvestorProjects()
    },
    {
      keyObj: checkElectricity,
      title: renderTitleCheckbox({ id: 'ckbAllElectricity', name: 'Electricity' }),
      content: [
        renderCheckboxItems(
          filterDataByKey({ items: electricity, key: 'electricityId' }),
          'ckbAllElectricity'
        )
      ]
    },
    {
      keyObj: checkCustomer,
      title: renderTitleCheckbox({ id: 'ckbAllCustomer', name: 'Partner' }),
      content: renderCustomerProjects()
    },
    {
      keyObj: checkProvince,
      title: renderTitleCheckbox({ id: 'ckbAllProvince', name: 'Province' }),
      content: [
        renderCheckboxItems(
          filterDataByKey({ items: provinces, key: 'provinceCode' }),
          'ckbAllProvince'
        )
      ]
    },
    {
      keyObj: checkIndustrialArea,
      title: renderTitleCheckbox({ id: 'ckbAllIndustrialArea', name: 'Industrial area' }),
      content: [
        renderCheckboxItems(
          filterDataByKey({ items: industrialAreas, key: 'industrialAreaId' }),
          'ckbAllIndustrialArea'
        )
      ]
    }
  ]

  const fetchProjectsReport = async (queryParam) => {
    const validFromDate = rSelected !== 'day' ? picker || new Date() : rangePicker?.[0] || new Date()
    const validToDate = rSelected !== 'day' ? picker || new Date() : rangePicker?.[1] || new Date()
    const initParam = {
      q: searchValue,
      projectIds: selectedProjectIds,
      fromDate: moment(validFromDate).startOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      toDate: moment(validToDate).endOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      ...queryParam
    }
    await dispatch(getProjectsOperateReport(initParam))
  }

  const dailyColumns = renderOperationalReportColumns({ intl, displayColumns })

  const toggleFilter = () => {
    setFilterIcon(!filterIcon)
  }

  const onFilter = () => {
    const tempParam = {
      page: 1,
      projectIds: ''
    }

    if (selectedProjectIds.length) {
      tempParam.projectIds = selectedProjectIds.toString()
    }

    setFileName(
      `OperationalReport_${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      }`
    )

    fetchProjectsReport(tempParam)
    toggleFilter()
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e
    setSearchValue(value)

    const tempParam = {
      page: 1,
      projectIds: '',
      q: value
    }
    if (selectedProjectIds.length) {
      tempParam.projectIds = selectedProjectIds.toString()
    }

    if (!inputType && value === '') {
      fetchProjectsReport(tempParam)
    }
  }

  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      const tempParam = {
        page: 1,
        projectIds: '',
        q: searchValue
      }
      if (selectedProjectIds.length) {
        tempParam.projectIds = selectedProjectIds.toString()
      }
      fetchProjectsReport(tempParam)
    }
  }

  const addRow = ({ ws, data, section, isColor }) => {
    const borderStyles = {
      top: { style: 'medium', color: { argb: 'ffffff' } },
      bottom: { style: 'medium', color: { argb: 'ffffff' } }
    }
    const row = ws.addRow(data)
    row.eachCell({ includeEmpty: true }, (cell, index) => {
      cell.value = data[index - 1]
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

      // Set color for errors (column G)
      if (isColor && index === 7) {
        cell.font = { name: 'Time New Roman', size: 12, color: { argb: 'FF0000' } }
        cell.numFmt = '#,##0'
      }

      // Set color for warning (column H)
      if (isColor && index === 8) {
        cell.font = { name: 'Time New Roman', size: 12, color: { argb: 'F79646' } }
        cell.numFmt = '#,##0'
      }

      // Set color for note (column H)
      if (isColor && index === 9) {
        cell.font = { name: 'Time New Roman', size: 12, color: { argb: '00B050' } }
      }
    })
    if (section?.height > 0) {
      row.height = section.height
    }
    return row
  }

  const addRowCustom = ({ ws, data, section }) => {
    // Find max sub rows length
    const maxRow = Math.max(
      data.meters?.length,
      data.inverters?.length,
      // data.panels?.length,
      data.system?.length
    )

    for (let i = 0; i < maxRow; i++) {
      const tempData =
        i === 0
          ? [
            data.stt,
            data.id,
            data.code,
            data.name,
            data.wattageDC,
            data.wattageAC,
            data.totalErrors,
            data.totalWarning,
            data.totalNoted
          ]
          : ['', '', '', '', '', '', '', '', '']
      tempData[22] = ''
      let tempMeterAlert = null,
        tempInverterAlert = null,
        tempSystemAlert = null

      if (data?.meters[i]) {
        tempMeterAlert = renderExportAlertMessage({
          type: data.meters[i]?.alertType,
          alertData: data.meters[i],
          intl
        })
        tempData[9] = data.meters[i]?.device?.name
        tempData[10] = data.reportDate > moment(data.meters[i]?.createDateTS).format('DD_MM_YYYY')
          ? `${intl.formatMessage({ id: 'From' })} ${moment(data.meters[i]?.createDateTS)
            .format(DISPLAY_DATE_TIME_FORMAT)}`
          : `${intl.formatMessage({ id: 'From' })} ${moment(data.meters[i]?.createDateTS).format('HH:mm:ss')}`
        tempData[11] = tempMeterAlert.message
        tempData[12] = [
          renderAlertStatus(data.meters[i]?.status, true, intl),
          data.meters[i]?.noteAlert?.content
        ].join('. ')
      }

      if (data?.inverters[i]) {
        tempInverterAlert = renderExportAlertMessage({
          type: data.inverters[i]?.alertType,
          alertData: data.inverters[i],
          intl
        })
        tempData[13] = data.inverters[i]?.device?.name
        tempData[14] = data.reportDate > moment(data.inverters[i]?.createDateTS).format('DD_MM_YYYY')
          ? `${intl.formatMessage({ id: 'From' })} ${moment(data.inverters[i]?.createDateTS)
            .format(DISPLAY_DATE_TIME_FORMAT)}`
          : `${intl.formatMessage({ id: 'From' })} ${moment(data.inverters[i]?.createDateTS)
            .format('HH:mm')}`
        tempData[15] = tempInverterAlert.message
        tempData[16] = [
          renderAlertStatus(data.inverters[i]?.status, true, intl),
          data.inverters[i]?.noteAlert?.content
        ].join('. ')
      }

      if (data?.system[i]) {
        tempSystemAlert = renderExportAlertMessage({
          type: data.system[i]?.alertType,
          alertData: data.system[i],
          intl
        })
        tempData[17] = data.reportDate > moment(data.system[i]?.createDateTS).format('DD_MM_YYYY')
          ? `${intl.formatMessage({ id: 'From' })} ${moment(data.system[i]?.createDateTS)
            .format(DISPLAY_DATE_TIME_FORMAT)}`
          : `${intl.formatMessage({ id: 'From' })} ${moment(data.system[i]?.createDateTS).format('HH:mm:ss')}`
        tempData[18] = tempSystemAlert.message
        tempData[19] = [
          renderAlertStatus(data.system[i]?.status, true, intl),
          data.meters[i]?.noteAlert?.content
        ].join('. ')
        tempData[20] =
          `${intl.formatMessage({ id: 'From' })} ${data?.system[i]?.from
            ? moment(data.system[i]?.from).format('HH:mm:ss')
            : ''}${data?.system[i]?.to
            ? `- ${moment(data.system[i]?.to).format('HH:mm:ss')}`
            : ''}`
        tempData[21] = data.system[i]?.inverterNum
        tempData[22] = data.system[i]?.totalYieldDecreased
      }

      // if (data?.panels[i]) {
      //   tempData[20] = ''
      //   tempData[21] = ''
      //   tempData[22] = data.system[i]?.noteAlert?.content || ''
      // }

      const borderStyles = {
        top: { style: 'medium', color: { argb: 'ffffff' } },
        bottom: { style: 'medium', color: { argb: 'ffffff' } }
      }
      const row = ws.addRow(tempData)
      row.eachCell({ includeEmpty: true }, (cell, index) => {
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

        // Set color for errors (column G)
        if (index === 7) {
          cell.font = { name: 'Time New Roman', size: 12, color: { argb: 'FF0000' } }
          cell.numFmt = '#,##0'
        }

        // Set color for warning (column H)
        if (index === 8) {
          cell.font = { name: 'Time New Roman', size: 12, color: { argb: 'F79646' } }
          cell.numFmt = '#,##0'
        }

        // Set color for note (column H)
        if (index === 9) {
          cell.font = { name: 'Time New Roman', size: 12, color: { argb: '00B050' } }
        }

        if (tempMeterAlert?.type === ALERT_TYPE.WARNING && index === 12) {
          cell.font = { name: 'Time New Roman', size: 12, color: { argb: 'BF9900' } }
        }

        if (tempMeterAlert?.type === ALERT_TYPE.ALERT && index === 12) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'E26B0A' } }
        }

        if (tempMeterAlert?.type === ALERT_TYPE.ERROR && index === 12) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'FF0000' } }
        }

        if (tempInverterAlert?.type === ALERT_TYPE.WARNING && index === 16) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'BF9900' } }
        }

        if (tempInverterAlert?.type === ALERT_TYPE.ALERT && index === 16) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'E26B0A' } }
        }

        if (tempInverterAlert?.type === ALERT_TYPE.ERROR && index === 16) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'FF0000' } }
        }

        if (tempSystemAlert?.type === ALERT_TYPE.WARNING && index === 19) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'BF9900' } }
        }

        if (tempSystemAlert?.type === ALERT_TYPE.ALERT && index === 19) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'E26B0A' } }
        }

        if (tempSystemAlert?.type === ALERT_TYPE.ERROR && index === 19) {
          cell.font = { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'FF0000' } }
        }
      })
      if (section?.height > 0) {
        row.height = section.height
      }
    }
  }

  const mergeCells = (ws, row, from, to) => {
    ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`)
  }

  const mergeCellWithValue = (ws, from, to, value, prop) => {
    ws.mergeCells(`${from}:${to}`)
    ws.getCell(from).value = value
    ws.getCell(from).font = prop?.font
    if (prop?.fill) {
      ws.getCell(from).fill = prop?.fill
    }
  }

  const countMaxRow = (data) => {
    let countMeter = 0,
      countInverter = 0,
      // countPanel = 0,
      countSystem = 0

    data.forEach((report) => {
      countMeter += report.meters.length
      countInverter += report.inverters.length
      // countPanel += report.panels.length
      countSystem += report.system.length
    })

    return Math.max(countMeter, countInverter, countSystem)
  }

  const renderSheet = (sheetNameValue, wb, clearData) => {
    const sheetName = `${sheetNameValue}`
    const ws = wb.addWorksheet(sheetName),
      widths = [
        { width: 5 },
        { width: 10 },
        { width: 11 },
        { width: 35 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 12 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        // { width: 20 },
        // { width: 20 },
        // { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 }
      ],
      myTitle = `${intl.formatMessage({ id: 'Project operational report' })}: ${clearData[0]?.reportDate?.replaceAll(
        '_',
        '/'
      )}`,
      announcer = `${intl.formatMessage({ id: 'Announcer' })}: ${userData?.user?.fullName}`,
      myHeader = [
        'STT',
        'ID',
        'Code',
        intl.formatMessage({ id: 'Project name' }),
        `${intl.formatMessage({ id: 'DC power' })} (kWp)`,
        `${intl.formatMessage({ id: 'AC power' })} (kW)`,
        intl.formatMessage({ id: 'Total errors' }),
        intl.formatMessage({ id: 'Total warnings' }),
        intl.formatMessage({ id: 'Total notes' }),
        intl.formatMessage({ id: 'Meter' }),
        intl.formatMessage({ id: 'Operation report occurred date' }),
        intl.formatMessage({ id: 'Operation report alert message' }),
        intl.formatMessage({ id: 'Evaluate' }),
        intl.formatMessage({ id: 'Inverter' }),
        intl.formatMessage({ id: 'Operation report occurred date' }),
        intl.formatMessage({ id: 'Operation report alert message' }),
        intl.formatMessage({ id: 'Evaluate' }),
        intl.formatMessage({ id: 'Operation report occurred date' }),
        intl.formatMessage({ id: 'Alert message project' }),
        intl.formatMessage({ id: 'Evaluate' }),
        // intl.formatMessage({ id: 'String pin position' }),
        // intl.formatMessage({ id: 'Number of replaced PV' }),
        // intl.formatMessage({ id: 'Note' }),
        intl.formatMessage({ id: 'Reduction time' }),
        intl.formatMessage({ id: 'Inverter or percentage reduction power' }),
        intl.formatMessage({ id: 'Reduction yield' })
      ],
      myFooter = [
        'TOTAL',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        // '',
        // '',
        // '',
        '',
        '',
        ''
      ]

    // Worksheet view setting (frozen, zoom,...)
    ws.views = [{ state: 'frozen', xSplit: 9, ySplit: 0, activeCell: 'J1', zoomScale: 85, zoomScaleNormal: 85 }]

    // Add auto filter for worksheet
    ws.autoFilter = 'A2:W2'

    // Set row 1 height
    const row1 = ws.getRow(1)
    row1.height = 60
    row1.alignment = { horizontal: 'center', vertical: 'middle' }

    // Add image to workbook by filename
    const reeLogo = wb.addImage({
      base64: REELogo,
      extension: 'png'
    })
    // Add image to worksheet by image id
    ws.addImage(reeLogo, 'A1:B1')

    const titleProps = {
      height: 60,
      font: { name: 'Time New Roman', size: 16, bold: true, color: { argb: '0070C0' } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    }
    const headerProps = {
      headerBorder: {
        top: { style: 'medium', color: { argb: 'ffffff' } },
        left: { style: 'medium', color: { argb: 'ffffff' } }
      },
      height: 60,
      font: { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '44777b'
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
      numFmt: '#,##0'
    }
    const footerProps = {
      height: 30,
      font: { name: 'Time New Roman', size: 13, bold: true, color: { argb: '010000' } },
      alignment: { vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid', //darkVertical
        fgColor: {
          argb: '92D050'
        }
      },
      numFmt: '#,##0'
    }

    if (widths && widths.length > 0) {
      ws.columns = widths
    }

    // Add company name
    mergeCellWithValue(ws, 'C1', 'G1', 'CÔNG TY CỔ PHẦN NĂNG LƯỢNG MẶT TRỜI REE', {
      font: { name: 'Time New Roman', size: 18, bold: true, color: { argb: 'FF7546' } },
      height: 60
    })

    // Add title
    mergeCellWithValue(ws, 'I1', 'P1', myTitle, {
      height: 60,
      font: { name: 'Time New Roman', size: 16, bold: true, color: { argb: 'FF7546' } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    })

    // Add user report
    mergeCellWithValue(ws, 'R1', 'V1', announcer, titleProps)

    // Add headers
    addRow({ ws, data: myHeader, section: headerProps, isColor: false })

    // Add data
    clearData?.forEach((row, index) => {
      index % 2 === 0
        ? addRowCustom({ ws, data: row, section: dataProps2 })
        : addRowCustom({ ws, data: row, section: dataProps1 })
    })

    // Add footer
    const row = addRow({ ws, data: myFooter, section: footerProps, isColor: false })
    mergeCells(ws, row, 1, 4)

    // Calculate last row (TOTAL)
    const maxRow = countMaxRow(clearData)
    const lastDataIndex = maxRow + 2,
      footerIndex = maxRow + 3
    // Sum installed DC power
    ws.getCell(`E${footerIndex}`).value = { formula: `SUM(E3:E${lastDataIndex})`, result: undefined }
    // Sum installed AC power
    ws.getCell(`F${footerIndex}`).value = { formula: `SUM(F3:F${lastDataIndex})`, result: undefined }
    // Sum errors
    ws.getCell(`G${footerIndex}`).value = { formula: `SUM(G3:G${lastDataIndex})`, result: undefined }
    // Sum warnings
    ws.getCell(`H${footerIndex}`).value = { formula: `SUM(H3:H${lastDataIndex})`, result: undefined }
    // Sum meter alert messages
    ws.getCell(`L${footerIndex}`).value = { formula: `COUNTIF(L3:L${lastDataIndex},"*")`, result: undefined }
    // Sum inverter alert messages
    ws.getCell(`P${footerIndex}`).value = { formula: `COUNTIF(P3:P${lastDataIndex},"*")`, result: undefined }
    // Sum system alert messages
    ws.getCell(`S${footerIndex}`).value = { formula: `COUNTIF(S3:S${lastDataIndex},"*")`, result: undefined }
    // Sum replaced PV
    // ws.getCell(`U${footerIndex}`).value = { formula: `SUM(U3:U${lastDataIndex})`, result: undefined }
    // Sum reduction times
    ws.getCell(`U${footerIndex}`).value = { formula: `COUNTIF(U3:U${lastDataIndex},"*")`, result: undefined }
    // Sum reduction yield
    ws.getCell(`W${footerIndex}`).value = { formula: `SUM(W3:W${lastDataIndex})`, result: undefined }

    // Format alignment of STT column
    ws.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }

    // Format number of columns
    ws.getColumn('G').numFmt = '#,##0'
    ws.getColumn('H').numFmt = '#,##0'
    ws.getColumn('L').numFmt = '#,##0'
    ws.getColumn('P').numFmt = '#,##0'
    ws.getColumn('S').numFmt = '#,##0'
    ws.getColumn('U').numFmt = '#,##0'
    ws.getColumn('W').numFmt = '#,##0'

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

  const renderTotalSheet = (sheetNameValue, wb, clearData) => {
    const sheetName = `${sheetNameValue}`
    const ws = wb.addWorksheet(sheetName),
      widths = [
        { width: 5 },
        { width: 10 },
        { width: 11 },
        { width: 35 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 12 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 }
      ],
      myTitle = `${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      } `,
      announcer = `${userData?.user?.fullName}`,
      myHeader = [
        'STT',
        'ID',
        'Code',
        intl.formatMessage({ id: 'Project name' }),
        `${intl.formatMessage({ id: 'DC power' })} (kWp)`,
        `${intl.formatMessage({ id: 'AC power' })} (kW)`,
        intl.formatMessage({ id: 'Total errors' }),
        intl.formatMessage({ id: 'Total warnings' }),
        intl.formatMessage({ id: 'Total notes' })
      ],
      myFooter = [
        'TOTAL',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]

    // Worksheet view setting (frozen, zoom,...)
    ws.views = [{ state: 'frozen', xSplit: 9, ySplit: 0, activeCell: 'J1', zoomScale: 85, zoomScaleNormal: 85 }]

    // Add auto filter for worksheet
    ws.autoFilter = 'A3:I3'

    // Set row 1 height
    const row1 = ws.getRow(1)
    row1.height = 60
    row1.alignment = { horizontal: 'center', vertical: 'middle' }

    // Add image to workbook by filename
    const reeLogo = wb.addImage({
      base64: REELogo,
      extension: 'png'
    })
    // Add image to worksheet by image id
    ws.addImage(reeLogo, 'A1:B1')

    const titleProps = {
      height: 29,
      font: { name: 'Time New Roman', size: 12, italic: true, color: { argb: '0070C0' } },
      alignment: { horizontal: 'left', vertical: 'middle' }
    }
    const headerProps = {
      headerBorder: {
        top: { style: 'medium', color: { argb: 'ffffff' } },
        left: { style: 'medium', color: { argb: 'ffffff' } }
      },
      height: 60,
      font: { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '44777b'
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
      numFmt: '#,##0'
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
      numFmt: '#,##0'
    }
    const footerProps = {
      height: 30,
      font: { name: 'Time New Roman', size: 13, bold: true, color: { argb: '010000' } },
      alignment: { vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid', //darkVertical
        fgColor: {
          argb: '92D050'
        }
      },
      numFmt: '#,##0'
    }

    if (widths && widths.length > 0) {
      ws.columns = widths
    }

    // Add company name
    mergeCellWithValue(ws, 'C1', 'I1', 'CÔNG TY CỔ PHẦN NĂNG LƯỢNG MẶT TRỜI REE', {
      font: { name: 'Time New Roman', size: 18, bold: true, color: { argb: 'FF7546' } },
      height: 60
    })

    // Add date range
    mergeCellWithValue(ws, 'A2', 'C2', myTitle, titleProps)

    // Add user label
    mergeCellWithValue(ws, 'G2', 'G2', 'Người trực', titleProps)

    // Add user report
    mergeCellWithValue(ws, 'H2', 'I2', announcer, titleProps)

    // Add headers
    addRow({ ws, data: myHeader, section: headerProps, isColor: false })

    // Add data
    clearData?.forEach((row, index) => {
      index % 2 === 0
        ? addRow({ ws, data: Object.values(row), section: dataProps2, isColor: true })
        : addRow({ ws, data: Object.values(row), section: dataProps1, isColor: true })
    })

    // Add footer
    const row = addRow({ ws, data: myFooter, section: footerProps, isColor: false })
    mergeCells(ws, row, 1, 4)

    const lastDataIndex = clearData?.length + 3,
      footerIndex = clearData?.length + 4

    // Sum installed DC power
    ws.getCell(`E${footerIndex}`).value = { formula: `SUM(E4:E${lastDataIndex})`, result: undefined }
    // Sum installed AC power
    ws.getCell(`F${footerIndex}`).value = { formula: `SUM(F4:F${lastDataIndex})`, result: undefined }
    // Sum errors
    ws.getCell(`G${footerIndex}`).value = { formula: `SUM(G4:G${lastDataIndex})`, result: undefined }
    // Sum warnings
    ws.getCell(`H${footerIndex}`).value = { formula: `SUM(H4:H${lastDataIndex})`, result: undefined }

    // Format alignment of STT column
    ws.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    // Format number of columns
    ws.getColumn('G').numFmt = '#,##0'
    ws.getColumn('H').numFmt = '#,##0'

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

  const mappingYearSheetData = ({ project, index }) => {
    return {
      stt: `${index + 1}`,
      id: (
        typeof project?.code === 'string' ? project?.code?.substring(0, 4) : ''
      ),
      code: (getUnionCode([project.provinceCode, project.partnerCode, project.electricityCode])),
      name: project.name || '',
      wattageAC: project.wattageAC / 1000 || 0,
      wattageDC: project.wattageDC / 1000 || 0,
      totalErrors: project.totalErrors || 0,
      totalWarning: project.totalWarning || 0,
      totalNoted: `${project.totalNoted || 0}/${project.totalErrors || 0}`,
      meters: project.meters || [],
      inverters: project.inverters || [],
      // panels: project.panels || [],
      system: project.system || [],
      reportDate: project.reportDate
    }
  }

  const mappingTotalSheetData = ({ project, index }) => {
    return {
      stt: `${index + 1}`,
      id: (
        typeof project?.code === 'string' ? project?.code?.substring(0, 4) : ''
      ),
      code: (
        `# ${[project.provinceCode, project.partnerCode].join('-')}`
      ),
      name: project.name || '',
      wattageAC: project.wattageAC / 1000 || 0,
      wattageDC: project.wattageDC / 1000 || 0,
      totalErrors: project.totalErrors || 0,
      totalWarning: project.totalWarning || 0,
      totalNoted: `${project.totalNoted || 0}/${project.totalErrors || 0}`
    }
  }

  const exportToExcelPro = async () => {
    setIsExport(true)
    try {
      toggleModal()
      const wb = new ExcelJS.Workbook()

      if (reportData?.length) {
        const totalReportData = []
        reportData.forEach(project => {
          const existedProjectIndex = totalReportData.findIndex(data => data.id === project.id)
          if (existedProjectIndex > -1) {
            const tempProject = { ...totalReportData[existedProjectIndex] }
            tempProject.totalErrors += project.totalErrors
            tempProject.totalWarning += project.totalWarning
            tempProject.totalNoted += project.totalNoted
            tempProject.meters = [...tempProject.meters, ...project.meters]
            tempProject.inverters = [...tempProject.inverters, ...project.inverters]
            tempProject.system = [...tempProject.system, ...project.system]
            // tempProject.panels = [...tempProject.panels, ...project.panels]

            totalReportData[existedProjectIndex] = tempProject
          } else {
            totalReportData.push(project)
          }
        })

        renderTotalSheet(
          'Tổng quan',
          wb,
          totalReportData.map((project, index) => {
            return mappingTotalSheetData({ project, index })
          })
        )
      }

      if (reportsByDay && Object.keys(reportsByDay).length > 1) {
        Object.keys(reportsByDay).forEach((day) => {
          const filteredReports = reportData.filter((project) => project.reportDate === (
            day
          ))

          if (filteredReports.length) {
            renderSheet(
              day.replaceAll('_', '.'),
              wb,
              filteredReports?.map((project, index) => {
                return mappingYearSheetData({ project, index })
              })
            )
          }
        })
      } else if (selectedProjectIds.length > 0) {
        renderSheet(
          moment(picker[0]).format(DISPLAY_DATE_FORMAT_WORKSHEET),
          wb,
          reportData?.map((project, index) => {
            return mappingYearSheetData({ project, index })
          })
        )
      }

      const buf = await wb.xlsx.writeBuffer()
      FileSaver.saveAs(new Blob([buf]), `${fileName}.${fileFormat}`)
    } catch (error) {
      console.error('[OperationReport] Error: ', error.message)
    } finally {
      setIsExport(false)
    }
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
      `OperationalReport_${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
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
      `OperationalReport_${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
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
      `OperationalReport_${validFromDate.format(DISPLAY_DATE_FORMAT)}${
        validFromDate.date() === moment(validToDate).date() ? '' : moment(validToDate).format(`-${DISPLAY_DATE_FORMAT}`)
      }`
    )

    fetchProjectsReport({
      fromDate: validFromDate.format('YYYY-MM-DD'),
      toDate: validToDate.format('YYYY-MM-DD')
    })
  }

  useEffect(() => {
    setReportsByDay(_groupBy(reportData, (report) => report.reportDate))

    const tempProvinceState = {},
      tempYearState = {},
      tempBusinessModelState = {}

    provinces.forEach(province => {
      tempProvinceState[province.id] = false
    })

    years.forEach(year => {
      tempYearState[year.id] = false
    })

    businessModels.forEach(businessModel => {
      tempBusinessModelState[businessModel.id] = false
    })

    setCheckProvince((currentState) => (
      {
        ...tempProvinceState,
        ...currentState
      }
    ))
    setCheckYear((currentState) => (
      {
        ...tempYearState,
        ...currentState
      }
    ))
    setCheckBusinessModel((currentState) => (
      {
        ...tempBusinessModelState,
        ...currentState
      }
    ))
  }, [reportData])

  useEffect(() => {
    const tempState = {}

    investors.forEach(investor => {
      tempState[investor.id] = false
    })

    setCheckInvestor((currentState) => (
      {
        ...tempState,
        ...currentState
      }
    ))
  }, [investors])

  useEffect(() => {
    const tempState = {}

    customerAllData.forEach(customer => {
      tempState[customer.id] = false
    })

    setCheckCustomer((currentState) => (
      {
        ...tempState,
        ...currentState
      }
    ))
  }, [customerAllData])

  useEffect(() => {
    const tempState = {}

    electricity.forEach(item => {
      tempState[item.id] = false
    })

    setCheckElectricity((currentState) => (
      {
        ...tempState,
        ...currentState
      }
    ))
  }, [electricity])

  useEffect(() => {
    const tempState = {}

    industrialAreas.forEach(industrialArea => {
      tempState[industrialArea.id] = false
    })

    setCheckIndustrialArea((currentState) => (
      {
        ...tempState,
        ...currentState
      }
    ))
  }, [industrialAreas])

  // Filter project ids (IMPORTANT)
  useEffect(() => {
    if (selectedProjectIdsByKey) {
      // Inner join selected project Id by key
      setSelectedProjectIds(_intersection(...Object.values(selectedProjectIdsByKey)))
    }
  }, [selectedProjectIdsByKey])

  // Set selected project ids
  useEffect(() => {
    if (projectAllData?.length > 0) {
      setSelectedProjectIds(projectAllData.map(project => project.id))
    }
  }, [projectAllData])

  // Component did mount
  useEffect(() => {
    // Clear all data when unmount
    return () => {
      dispatch(clearProjectOperationReport())
    }
  }, [])

  // ** Checking display columns
  const checkDisplayColumns = ({ selectedData, item, isChecked }) => {
    const columns = [...selectedData]
    const index = columns.findIndex((column) => column.key === item.key)

    if (isChecked && index === -1) {
      columns.push(item)
    } else if (!isChecked && index > -1) {
      columns.splice(index, 1)
    }

    return columns
  }

  // Set dropdown menu on/off
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <Card className='mb-0'>
      <CardBody>
        <Row className='mb-2'>
          <Col lg={6} md={5} className='d-flex align-items-center justify-content-sm-start my-md-0 mt-1'>
            {/* Filter */}
            <Button.Ripple
              id='yieldReportFilterBtn'
              className='px-0'
              color='flat'
              style={{ minWidth: '60px', minHeight: '28px' }}
              onClick={toggleFilter}
            >
              <IconFilter style={{ minWidth: '30px', minHeight: '28px' }}/>
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`yieldReportFilterBtn`}>
              {intl.formatMessage({ id: 'Search' })}
            </UncontrolledTooltip>
            {/* Search */}
            <InputGroup className='input-group-merge mr-1'>
              <Input
                className='dataTable-filter'
                type='search'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={handleChangeSearch}
                onKeyPress={handleFilterKeyPress}
                placeholder={`${intl.formatMessage({ id: 'Operation report placeholder' })}`}
              />
              <InputGroupAddon addonType='append'>
                <InputGroupText>
                  <IconSearch/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <UncontrolledTooltip placement='top' target={`search-input`}>
              {`${intl.formatMessage({ id: 'Operation report placeholder' })}`}
            </UncontrolledTooltip>
          </Col>
          <Col lg={4} md={4} className='my-md-0 mt-1 d-flex align-items-center justify-content-end'>
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
          <Col lg={2} md={3} className='my-md-0 mt-1 d-flex justify-content-end'>
            <ButtonDropdown
              className='show-column w-100'
              direction='left'
              isOpen={dropdownOpen}
              toggle={toggleDropdown}
            >
              <DropdownToggle
                id='showHideColumnsButton'
                color='primary'
                outline
              >
                <IconColumn/>
                <span><FormattedMessage id='Display columns'/></span>
              </DropdownToggle>
              <DropdownMenu>
                <div
                  style={{ width: 250 }}
                  className='px-1'
                >
                  <CustomInput
                    type='checkbox'
                    className='custom-control-Primary mr-1'
                    checked={selectAll}
                    value={selectAll}
                    onChange={(e) => {
                      setSelectAll(e.target.checked)
                      setDisplayColumns(e.target.checked ? requiredKeys : [])
                    }}
                    id={`ckbSelectAll`}
                    label={intl.formatMessage({ id: 'Select all' })}
                  />
                </div>
                <DropdownItem divider/>
                {
                  requiredKeys.map((requiredKey, index) => {
                    return <div
                      key={index}
                      style={{ width: 250 }}
                      className='px-1'
                    >
                      <CustomInput
                        type='checkbox'
                        className='custom-control-Primary mr-1'
                        checked={displayColumns.findIndex(column => column.key === requiredKey.key) > -1}
                        value={requiredKey.key}
                        onChange={(e) => {
                          setDisplayColumns(checkDisplayColumns({
                            selectedData: displayColumns,
                            item: requiredKey,
                            isChecked: e.target.checked
                          }))
                        }}
                        id={`ckb_${requiredKey.key}`}
                        label={`${intl.formatMessage({ id: requiredKey.key })}${requiredKey.unit
                          ? ` ${requiredKey.unit}`
                          : ''}`}
                      />
                    </div>
                  })
                }
              </DropdownMenu>
            </ButtonDropdown>
            <UncontrolledTooltip placement='top' target='showHideColumnsButton'>
              <FormattedMessage id='Display or hide columns'/>
            </UncontrolledTooltip>
          </Col>
        </Row>
        <Row>
          {
            (
              filterIcon
            )
            && (
              <Col md={3}>
                <div className='report-filter' style={{ maxHeight: 'calc(100vh - 410px)' }}>
                  <AppCollapse
                    data={titleData}
                    active={checkingActiveParents(titleData)}
                  />
                </div>
                <Button.Ripple
                  color='primary'
                  className='col-md-12'
                  onClick={onFilter}
                  disabled={selectedProjectIds.length < 1}
                >
                  <FormattedMessage id='Filtering report'/>
                </Button.Ripple>
              </Col>
            )
          }
          <Col md={filterIcon ? 9 : 12}>
            <DataTable
              noHeader
              className={classnames(
                'react-dataTable react-dataTable--projects react-dataTable--operation-report',
                { 'overflow-hidden': reportData?.length <= 0 }
              )}
              columns={dailyColumns}
              sortIcon={<ChevronDown size={10}/>}
              data={
                reportData.length > 0
                  ? [
                    summaryDataOR,
                    ...reportData
                  ]
                  : []
              }
              persistTableHead
              noDataComponent={''}
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
          <Button
            color='primary'
            onClick={exportToExcelPro}
            disabled={isExport}
          >
            {isExport && <Spinner color='success' style={{ width: 15, height: 15 }}/>}
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

OperationalReportTable.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(OperationalReportTable)
