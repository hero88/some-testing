import PropTypes from 'prop-types'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import React, {
  useEffect,
  useState
} from 'react'
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
  Badge,
  Card,
  UncontrolledTooltip,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Spinner,
  CardBody
} from 'reactstrap'
import * as FileSaver from 'file-saver'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import moment from 'moment'
import ExcelJS from 'exceljs'
import _groupBy from 'lodash/groupBy'
import _countBy from 'lodash/countBy'
import AppCollapse from '@components/app-collapse'
import {
  clearYieldReport,
  getProjectsReport
} from '@src/views/report/store/actions'
import REELogo from '@src/assets/images/logo/logo.png'
import { renderYieldReportColumns } from '@src/views/report/projects/columns/YieldReportColumns'
import {
  getUnionCode,
  getYears,
  numberToFixed,
  selectUnitOfTime
} from '@utils'
import { getProvinces } from '@constants/province'
import { getBusinessModels } from '@constants/project'
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
import { DISPLAY_DATE_FORMAT } from '@constants/common'

export const renderAlertStatus = (status) => {
  switch (status) {
    case 'OK':
      return (
        <Badge
          pill
          color='light-info'
        >
          <FormattedMessage id='OK'/>
        </Badge>
      )
    case 'WARN':
      return (
        <Badge
          pill
          color='light-warning'
        >
          <FormattedMessage id='WARN'/>
        </Badge>
      )
    case 'ERROR':
      return (
        <Badge
          pill
          color='light-danger'
        >
          <FormattedMessage id='ERROR'/>
        </Badge>
      )
    default:
      return null
  }
}

export const renderNote = ({ project, intl }) => {
  let temp = ''

  if (Number(project?.performance) < 0.80) {
    temp = temp.concat(intl.formatMessage({ id: 'Low efficiency' }))
  }

  if (Number(project?.diffTotalYieldInverterAndMeter) >= 5) {
    if (temp.length) temp = temp.concat(', ')
    temp = temp.concat(intl.formatMessage({ id: 'High deviation' }))
  }

  // Do not show Cosphi information when project don't have GRID meter
  if (project?.hasGridMeter && Number(project?.cosphi) < 0.9) {
    if (temp.length) temp = temp.concat(', ')
    temp = temp.concat(intl.formatMessage({ id: 'Low cos phi' }))
  }

  return temp
}

const ReportTable = ({ intl }) => {
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
    { key: 'acDCRatio', unit: '(%)' },
    { key: 'productionYield', unit: '(kWh)' },
    { key: 'cf', unit: '(%)' },
    { key: 'sunshine', unit: `(${intl.formatMessage({ id: 'hours' })}/${intl.formatMessage({ id: 'day' })})` },
    { key: 'performance', unit: '(%)' },
    { key: 'totalYieldDecreasedLowPerformance', unit: '(kWh)' },
    { key: 'totalYieldDecreasedDeviceError', unit: '(kWh)' },
    { key: 'totalYieldDecreasedEvnCut', unit: '(kWh)' },
    { key: 'totalYieldInverter', unit: '(kWh)' },
    { key: 'totalYieldMeter', unit: '(kWh)' },
    { key: 'deviation', unit: '' },
    { key: 'saleToEVN', unit: '(kWh)' },
    { key: 'saleToCustomer', unit: '(kWh)' },
    { key: 'cosphi', unit: '' },
    { key: 'fineCost', unit: `(${intl.formatMessage({ id: 'VND' })})` },
    { key: 'note', unit: '' }
  ]
  const dispatch = useDispatch(),
    {
      auth: { userData },
      report: { data: reportData, params: paramsData, summaryData, summaryYearData },
      customerProject: { allData: projectAllData, electricity, industrialAreas, investors },
      customer: { allData: customerAllData },
      layout: { skin }
    } = useSelector((store) => store),
    [picker, setPicker] = useState(new Date()),
    [rangePicker, setRangePicker] = useState(null),
    [modal, setModal] = useState(false),
    [fileName, setFileName] = useState('YieldReport'),
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
    [displayColumns, setDisplayColumns] = useState(requiredKeys),
    [dropdownOpen, setDropdownOpen] = useState(false),
    [selectAll, setSelectAll] = useState(false),
    [isExport, setIsExport] = useState(false),
    [reportsByYear, setReportsByYear] = useState(null),
    provinces = getProvinces(intl),
    businessModels = getBusinessModels(intl),
    years = getYears(projectAllData),
    [searchValue, setSearchValue] = useState(paramsData?.q || ''),
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
        [key]: currentState[key]
          ? [...currentState[key], ...tempProjectIdsByKey]
          : tempProjectIdsByKey
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

      case 'ckbAllBusinessModel':
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

      case 'project':
        setSelectedProjectIds(
          checkValueInArray({
            selectedData: selectedProjectIds,
            item,
            isChecked: checked
          })
        )
        break
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

    return <AppCollapse
      data={
        filteredCustomers.map(customer => (
          {
            title: renderCheckboxItems([customer], 'ckbAllCustomer'),
            content: [
              renderCheckboxItems(
                projectAllData.filter(project => project?.partnerId === customer.id),
                'project'
              )
            ]
          }
        ))
      }
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
    const validFromDate = rSelected !== 'day'
      ? picker || new Date()
      : rangePicker?.[0] || new Date()
    const validToDate = rSelected !== 'day'
      ? picker || new Date()
      : rangePicker?.[1] || new Date()
    const initParam = {
      q: searchValue,
      projectIds: selectedProjectIds,
      fromDate: moment(validFromDate).startOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      toDate: moment(validToDate).endOf(selectUnitOfTime(rSelected)).format('YYYY-MM-DD'),
      ...queryParam
    }
    await dispatch(getProjectsReport(initParam))
  }

  const dailyColumns = renderYieldReportColumns({ intl, displayColumns })

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
    fetchProjectsReport(tempParam)
    setFileName(
      `YieldReport_${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date()
          ? ''
          : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      }`
    )

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

  const addRow = (ws, data, section) => {
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
    })
    if (section?.height > 0) {
      row.height = section.height
    }
    return row
  }

  const mergeCells = (ws, row, from, to) => {
    ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`)
  }

  const renderExcelColorByCondition = ({
    ws,
    columnAddress,
    warningCondition,
    alertCondition,
    errorCondition,
    isGreater
  }) => {
    const warningProp = {
      font: { name: 'Time New Roman', size: 12, bold: true, color: { argb: '000000' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFFF00'
        }
      }
    }
    const alertProp = {
      font: { name: 'Time New Roman', size: 12, bold: true, color: { argb: '000000' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFC000'
        }
      }
    }
    const dangerProp = {
      font: { name: 'Time New Roman', size: 12, bold: true, color: { argb: '000000' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FF0000'
        }
      }
    }
    const statusCol = ws.getColumn(columnAddress)

    statusCol.eachCell({ includeEmpty: true }, (cell) => {
      const cellValue = Number(cell.text)

      if (isGreater) {
        switch (true) {
          case cellValue >= errorCondition:
            cell.fill = dangerProp.fill
            cell.font = dangerProp.font
            break

          case cellValue >= alertCondition && cellValue < errorCondition:
            cell.fill = alertProp.fill
            cell.font = alertProp.font
            break

          case cellValue >= warningCondition && cellValue < alertCondition:
            cell.fill = warningProp.fill
            cell.font = warningProp.font
            break

          default:
            break
        }
      } else {
        switch (true) {
          case cellValue < errorCondition:
            cell.fill = dangerProp.fill
            cell.font = dangerProp.font
            break

          case cellValue <= alertCondition && cellValue >= errorCondition:
            cell.fill = alertProp.fill
            cell.font = alertProp.font
            break

          case cellValue < warningCondition && cellValue >= alertCondition:
            cell.fill = warningProp.fill
            cell.font = warningProp.font
            break

          default:
            break
        }
      }
    })
  }

  const mergeCellWithValue = (ws, from, to, value, prop) => {
    ws.mergeCells(`${from}:${to}`)
    ws.getCell(from).value = value
    ws.getCell(from).font = prop?.font
    if (prop?.fill) {
      ws.getCell(from).fill = prop?.fill
    }
  }

  const renderSheet = (sheetNameValue, wb, clearData) => {
    const sheetName = `${sheetNameValue}`
    const ws = wb.addWorksheet(sheetName),
      widths = [
        { width: 5 },
        { width: 10 },
        { width: 30 },
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 10 },
        { width: 15 },
        { width: 12 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 10 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 60 }
      ],
      myTitle = `${intl.formatMessage({ id: 'Yield report' })}: ${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date()
          ? ''
          : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      } `,
      announcer = `${intl.formatMessage({ id: 'Announcer' })}: ${userData?.user?.fullName}`,
      myHeader = [
        'STT',
        'ID',
        intl.formatMessage({ id: 'Project code' }),
        intl.formatMessage({ id: 'Project name' }),
        intl.formatMessage({ id: 'Business model' }),
        `${intl.formatMessage({ id: 'AC power' })} (kW)`,
        `${intl.formatMessage({ id: 'DC power' })} (kWp)`,
        `${intl.formatMessage({ id: 'AC/DC ratio' })} (%)`,
        `${intl.formatMessage({ id: 'Production yield' })} (kWh)`,
        `${intl.formatMessage({ id: 'CF' })} (%)`,
        `${intl.formatMessage({ id: 'Average Sunshine Hours' })} (${intl.formatMessage({ id: 'hours' })})`,
        `${intl.formatMessage({ id: 'Performance' })} (%)`,
        `${intl.formatMessage({ id: 'Yield reduction by not maintenance' })} (kWh)`,
        `${intl.formatMessage({ id: 'Yield reduction by device faults' })} (kWh)`,
        `${intl.formatMessage({ id: 'Yield reduction by EVN' })} (kWh)`,
        `${intl.formatMessage({ id: 'Inverter yield' })} (kWh)`,
        `${intl.formatMessage({ id: 'Meter yield' })} (kWh)`,
        `${intl.formatMessage({ id: 'Deviation' })} (%)`,
        `${intl.formatMessage({ id: 'Yield sold to EVN' })} (kWh)`,
        `${intl.formatMessage({ id: 'Yield sold to customer' })} (kWh)`,
        intl.formatMessage({ id: 'Power factor' }),
        `${intl.formatMessage({ id: 'Cos forfeit' })} (${intl.formatMessage({ id: 'VND' })})`,
        intl.formatMessage({ id: 'Note' })
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
        '',
        '',
        ''
      ]

    // Worksheet view setting (frozen, zoom,...)
    ws.views = [{ state: 'frozen', xSplit: 5, ySplit: 0, activeCell: 'F1', zoomScale: 85, zoomScaleNormal: 85 }]

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
      alignment: { vertical: 'middle', wrapText: true },
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
      alignment: { vertical: 'middle', wrapText: true },
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
      font: { name: 'Time New Roman', size: 18, bold: true, color: { argb: 'ff754c' } },
      height: 60
    })

    // Add title
    mergeCellWithValue(ws, 'I1', 'P1', myTitle, titleProps)

    // Add user report
    mergeCellWithValue(ws, 'R1', 'V1', announcer, titleProps)

    // Add headers
    addRow(ws, myHeader, headerProps)

    // Add data
    clearData?.forEach((row, index) => {
      index % 2 === 0
        ? addRow(ws, Object.values(row), dataProps1)
        : addRow(ws, Object.values(row), dataProps2)
    })

    // Add footer
    const row = addRow(ws, myFooter, footerProps)
    mergeCells(ws, row, 1, 5)

    const lastDataIndex = clearData?.length + 2,
      footerIndex = clearData?.length + 3
    // Sum installed AC power
    ws.getCell(`F${footerIndex}`).value = { formula: `SUM(F3:F${lastDataIndex})`, result: undefined }
    // Sum installed DC power
    ws.getCell(`G${footerIndex}`).value = { formula: `SUM(G3:G${lastDataIndex})`, result: undefined }
    // AC/DC ratio
    ws.getCell(`H${footerIndex}`).value = {
      formula: `IF(G${footerIndex}>0,F${footerIndex}/G${footerIndex},0)`,
      result: undefined
    }
    // Sum power yield
    ws.getCell(`I${footerIndex}`).value = summaryYearData?.[sheetName]?.totalYieldProduction / 1000
    // CF average
    ws.getCell(`J${footerIndex}`).value = summaryYearData?.[sheetName]?.cf
    // Sum installed equivalent hour
    ws.getCell(`K${footerIndex}`).value = summaryYearData?.[sheetName]?.sunshine
    // Performance average
    ws.getCell(`L${footerIndex}`).value = summaryYearData?.[sheetName]?.performance / 100
    // Sum yield reduction by not maintenance
    ws.getCell(`M${footerIndex}`).value = 0
    // Sum yield reduction by device faults
    ws.getCell(`N${footerIndex}`).value = summaryYearData?.[sheetName]?.totalYieldDecreasedDeviceError / 1000
    // Sum yield reduction by EVN
    ws.getCell(`O${footerIndex}`).value = summaryYearData?.[sheetName]?.totalYieldDecreasedEvnCut / 1000
    // Sum inverter yield
    ws.getCell(`P${footerIndex}`).value = summaryYearData?.[sheetName]?.totalYieldInverter / 1000
    // Sum meter yield
    ws.getCell(`Q${footerIndex}`).value = summaryYearData?.[sheetName]?.totalYieldMeter / 1000
    // Deviation
    ws.getCell(`R${footerIndex}`).value = summaryYearData?.[sheetName]?.diffTotalYieldInverterAndMeter / 100
    // EVN yield
    ws.getCell(`S${footerIndex}`).value = summaryYearData?.[sheetName]?.saleToEVN / 1000
    // Customer yield
    ws.getCell(`T${footerIndex}`).value = summaryYearData?.[sheetName]?.saleToCustomer / 1000
    // Cos phi average
    ws.getCell(`U${footerIndex}`).value = summaryYearData?.[sheetName]?.cosphi
    // Cos phi forfeit
    ws.getCell(`V${footerIndex}`).value = summaryYearData?.[sheetName]?.fineCost
    // Calculate note
    ws.getCell(`W${footerIndex}`).value = renderNote({ project: summaryYearData?.[sheetName], intl })

    // Render color for performance
    renderExcelColorByCondition({
      ws,
      columnAddress: 'L',
      warningCondition: 0.85,
      alertCondition: 0.8,
      errorCondition: 0.75,
      isGreater: false
    })

    // Render color for deviation
    renderExcelColorByCondition({
      ws,
      columnAddress: 'R',
      warningCondition: 0.05,
      alertCondition: 0.05,
      errorCondition: 0.10,
      isGreater: true
    })

    // Render color for cos phi
    renderExcelColorByCondition({
      ws,
      columnAddress: 'U',
      warningCondition: 0.9,
      alertCondition: 0.85,
      errorCondition: 0.8,
      isGreater: false
    })

    // Format alignment of STT column
    ws.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }

    // Format number of columns
    ws.getColumn('H').numFmt = '#,##0.0%'
    ws.getColumn('J').numFmt = '#,##0.0%'
    ws.getColumn('K').numFmt = '#,##0.0'
    ws.getColumn('L').numFmt = '#,##0.0%'
    ws.getColumn('R').numFmt = '#,##0.0%'
    ws.getColumn('U').numFmt = '#,##0.00'

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
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 10 },
        { width: 15 },
        { width: 12 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 10 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 60 }
      ],
      myTitle = `${intl.formatMessage({ id: 'Yield report' })}: ${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date()
          ? ''
          : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      } `,
      announcer = `${intl.formatMessage({ id: 'Announcer' })}: ${userData?.user?.fullName}`,
      myHeader = [
        'STT',
        intl.formatMessage({ id: 'Year' }),
        `${intl.formatMessage({ id: 'AC power' })} (kW)`,
        `${intl.formatMessage({ id: 'DC power' })} (kWp)`,
        `${intl.formatMessage({ id: 'AC/DC ratio' })} (%)`,
        `${intl.formatMessage({ id: 'Production yield' })} (kWh)`,
        `${intl.formatMessage({ id: 'CF' })} (%)`,
        `${intl.formatMessage({ id: 'Average Sunshine Hours' })} (${intl.formatMessage({ id: 'hours' })})`,
        `${intl.formatMessage({ id: 'Performance' })} (%)`,
        `${intl.formatMessage({ id: 'Yield reduction by not maintenance' })} (kWh)`,
        `${intl.formatMessage({ id: 'Yield reduction by device faults' })} (kWh)`,
        `${intl.formatMessage({ id: 'Yield reduction by EVN' })} (kWh)`,
        `${intl.formatMessage({ id: 'Inverter yield' })} (kWh)`,
        `${intl.formatMessage({ id: 'Meter yield' })} (kWh)`,
        intl.formatMessage({ id: 'Deviation' }),
        `${intl.formatMessage({ id: 'Yield sold to EVN' })} (kWh)`,
        `${intl.formatMessage({ id: 'Yield sold to customer' })} (kWh)`,
        intl.formatMessage({ id: 'Power factor' }),
        `${intl.formatMessage({ id: 'Cos forfeit' })} (${intl.formatMessage({ id: 'VND' })})`,
        intl.formatMessage({ id: 'Note' })
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
        ''
      ]

    // Worksheet view setting (frozen, zoom,...)
    ws.views = [{ state: 'frozen', xSplit: 4, ySplit: 0, activeCell: 'E1', zoomScale: 85, zoomScaleNormal: 85 }]

    // Add auto filter for worksheet
    ws.autoFilter = 'A2:T2'

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
      alignment: { vertical: 'middle', wrapText: true },
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
      alignment: { vertical: 'middle', wrapText: true },
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
      alignment: { vertical: 'middle', wrapText: true },
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
    mergeCellWithValue(ws, 'C1', 'J1', 'CÔNG TY CỔ PHẦN NĂNG LƯỢNG MẶT TRỜI REE', {
      font: { name: 'Time New Roman', size: 18, bold: true, color: { argb: 'ff754c' } },
      height: 60
    })

    // Add title
    mergeCellWithValue(ws, 'L1', 'Q1', myTitle, titleProps)

    // Add user report
    mergeCellWithValue(ws, 'R1', 'T1', announcer, titleProps)

    // Add headers
    addRow(ws, myHeader, headerProps)

    // Add data
    clearData?.forEach((row, index) => {
      index % 2 === 0
        ? addRow(ws, Object.values(row), dataProps1)
        : addRow(ws, Object.values(row), dataProps2)
    })

    // Add footer
    const row = addRow(ws, myFooter, footerProps)
    mergeCells(ws, row, 1, 2)

    const lastDataIndex = clearData?.length + 2,
      footerIndex = clearData?.length + 3

    // Sum installed AC power
    ws.getCell(`C${footerIndex}`).value = { formula: `SUM(C3:C${lastDataIndex})`, result: undefined }
    // Sum installed DC power
    ws.getCell(`D${footerIndex}`).value = { formula: `SUM(D3:D${lastDataIndex})`, result: undefined }
    // AC/DC ratio
    ws.getCell(`E${footerIndex}`).value = {
      formula: `IF(D${footerIndex} > 0, C${footerIndex}/D${footerIndex}, 0)`,
      result: undefined
    }
    // Sum power yield
    ws.getCell(`F${footerIndex}`).value = summaryData?.totalYieldProduction / 1000
    // CF average
    ws.getCell(`G${footerIndex}`).value = summaryData?.cf
    // Sum installed equivalent hour
    ws.getCell(`H${footerIndex}`).value = summaryData?.sunshine
    // Performance average
    ws.getCell(`I${footerIndex}`).value = summaryData?.performance / 100
    // Sum yield reduction by not maintenance
    ws.getCell(`J${footerIndex}`).value = 0
    // Sum yield reduction by device faults
    ws.getCell(`K${footerIndex}`).value = summaryData?.totalYieldDecreasedDeviceError / 1000
    // Sum yield reduction by EVN
    ws.getCell(`L${footerIndex}`).value = summaryData?.totalYieldDecreasedEvnCut / 1000
    // Sum inverter yield
    ws.getCell(`M${footerIndex}`).value = summaryData?.totalYieldInverter / 1000
    // Sum meter yield
    ws.getCell(`N${footerIndex}`).value = summaryData?.totalYieldMeter / 1000
    // Deviation
    ws.getCell(`O${footerIndex}`).value = summaryData?.diffTotalYieldInverterAndMeter / 100
    // EVN yield
    ws.getCell(`P${footerIndex}`).value = summaryData?.saleToEVN / 1000
    // Customer yield
    ws.getCell(`Q${footerIndex}`).value = summaryData?.saleToCustomer / 1000
    // Cos phi average
    ws.getCell(`R${footerIndex}`).value = summaryData?.cosphi
    // Cos phi forfeit
    ws.getCell(`S${footerIndex}`).value = summaryData?.fineCost
    // Calculate note
    ws.getCell(`T${footerIndex}`).value = renderNote({ project: summaryData, intl })

    // Render color for performance
    renderExcelColorByCondition({
      ws,
      columnAddress: 'I',
      warningCondition: 0.85,
      alertCondition: 0.85,
      errorCondition: 0.75,
      isGreater: false
    })

    // Render color for deviation
    renderExcelColorByCondition({
      ws,
      columnAddress: 'O',
      warningCondition: 0.05,
      alertCondition: 0.05,
      errorCondition: 0.10,
      isGreater: true
    })

    // Render color for cos phi
    renderExcelColorByCondition({
      ws,
      columnAddress: 'R',
      warningCondition: 0.9,
      alertCondition: 0.85,
      errorCondition: 0.8,
      isGreater: false
    })

    // Format alignment of STT column
    ws.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }

    // Format number of columns
    // AC/DC
    ws.getColumn('E').numFmt = '#,##0.0%'
    ws.getColumn('G').numFmt = '#,##0.0%'
    ws.getColumn('H').numFmt = '#,##0.0'
    ws.getColumn('I').numFmt = '#,##0.0%'
    ws.getColumn('O').numFmt = '#,##0.0%'
    // Cos phi
    ws.getColumn('R').numFmt = '#,##0.00'

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
        typeof project?.code === 'string'
          ? project?.code?.substring(0, 4)
          : ''
      ),
      code: (getUnionCode([project?.provinceCode, project?.partnerCode, project?.electricityCode])),
      name: project.name || '',
      type: intl.formatMessage({ id: project?.type }),
      wattageAC: numberToFixed(project.installWattageAc / 1000, 0) || 0,
      wattageDC: numberToFixed(project.installWattageDc / 1000, 0) || 0,
      acDCRatio: project.installWattageDc
        ? project.installWattageAc / project.installWattageDc
        : 0, // Display on excel don't need to
             // multiply 100
      totalYieldProduction: numberToFixed(project.totalYieldProduction / 1000, 0) || 0,
      cf: project.cf || 0,
      sunshine: project.sunshine || 0,
      performance: project.performance / 100 || 0,
      totalYieldDecreasedLowPerformance: numberToFixed(project.totalYieldDecreasedLowPerformance / 1000, 0) || 0,
      totalYieldDecreasedDeviceError: numberToFixed(project.totalYieldDecreasedEvnCut / 1000, 0) || 0,
      totalYieldDecreasedEvnCut: numberToFixed(project.totalYieldDecreasedDeviceError / 1000, 0) || 0,
      totalYieldInverter: numberToFixed(project.totalYieldInverter / 1000, 0) || 0,
      totalYieldMeter: numberToFixed(project.totalYieldMeter / 1000, 0) || 0,
      diffTotalYieldInverterAndMeter: project.diffTotalYieldInverterAndMeter / 100 || 0,
      saleToEVN: project.saleToEVN / 1000 || 0,
      saleToCustomer: project.saleToCustomer / 1000 || 0,
      cosphi: project.cosphi || 0,
      fineCost: project.fineCost || 0,
      note: renderNote({ project, intl })
    }
  }

  const mappingTotalSheetData = ({ totalIndex, index, year }) => {
    return {
      stt: `${index + 1}`,
      year: `${year}`,
      wattageAC: { formula: `'${year}'!F${totalIndex}`, result: undefined },
      wattageDC: { formula: `'${year}'!G${totalIndex}`, result: undefined },
      acDCRatio: summaryYearData?.[year]?.installWattageDc
        ? summaryYearData?.[year]?.installWattageAc / summaryYearData?.[year]?.installWattageDc
        : 0,
      totalYieldProduction: summaryYearData?.[year]?.totalYieldProduction / 1000 || 0,
      cf: summaryYearData?.[year]?.cf || 0,
      sunshine: summaryYearData?.[year]?.sunshine || 0,
      performance: summaryYearData?.[year]?.performance / 100 || 0,
      totalYieldDecreasedLowPerformance: summaryYearData?.[year]?.totalYieldDecreasedLowPerformance / 1000 || 0,
      totalYieldDecreasedDeviceError: summaryYearData?.[year]?.totalYieldDecreasedEvnCut / 1000 || 0,
      totalYieldDecreasedEvnCut: summaryYearData?.[year]?.totalYieldDecreasedDeviceError / 1000 || 0,
      totalYieldInverter: summaryYearData?.[year]?.totalYieldInverter / 1000 || 0,
      totalYieldMeter: summaryYearData?.[year]?.totalYieldMeter / 1000 || 0,
      diffTotalYieldInverterAndMeter: summaryYearData?.[year]?.diffTotalYieldInverterAndMeter / 100 || 0,
      saleToEVN: summaryYearData?.[year]?.saleToEVN / 1000 || 0,
      saleToCustomer: summaryYearData?.[year]?.saleToCustomer / 1000 || 0,
      cosphi: summaryYearData?.[year]?.cosphi || 0,
      fineCost: summaryYearData?.[year]?.fineCost || 0,
      note: { formula: `'${year}'!W${totalIndex}`, result: undefined }
    }
  }

  const exportToExcelPro = async () => {
    setIsExport(true)

    try {
      toggleModal()
      const wb = new ExcelJS.Workbook()

      if (reportsByYear) {
        renderTotalSheet(
          'Tổng quan',
          wb,
          Object.keys(reportsByYear).map((year, index) => {
            return mappingTotalSheetData({
              totalIndex: reportsByYear[year]?.length + 3,
              index,
              year
            })
          })
        )
      }

      if (reportsByYear && Object.keys(reportsByYear).length > 0) {
        Object.keys(reportsByYear).forEach((year) => {
          const filteredReports = reportData.filter((project) => moment(project.startDate).year() === Number(year))

          if (filteredReports.length) {
            renderSheet(
              year,
              wb,
              filteredReports?.map((project, index) => {
                return mappingYearSheetData({ project, index })
              })
            )
          }
        })
      } else if (selectedProjectIds.length > 0) {
        renderSheet(
          moment(picker[0]).year(),
          wb,
          reportData?.map((project, index) => {
            return mappingYearSheetData({ project, index })
          })
        )
      }

      const buf = await wb.xlsx.writeBuffer()
      FileSaver.saveAs(new Blob([buf]), `${fileName}.${fileFormat}`)
    } catch (e) {
      console.error(`[YieldReportTable] - exportToExcelPro - error: ${e.message}`)
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
      `YieldReport_${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date()
          ? ''
          : moment(toDate).format('-DD/MM/YYYY')
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
      `YieldReport_${moment(fromDate).format('DD/MM/YYYY')}${
        moment(fromDate).date() === moment(toDate).date()
          ? ''
          : moment(toDate).format('-DD/MM/YYYY')
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
      `YieldReport_${validFromDate.format('DD/MM/YYYY')}${
        validFromDate.date() === moment(validToDate).date()
          ? ''
          : moment(validToDate).format('-DD/MM/YYYY')
      }`
    )

    fetchProjectsReport({
      fromDate: validFromDate.format('YYYY-MM-DD'),
      toDate: validToDate.format('YYYY-MM-DD')
    })
  }

  useEffect(() => {
    setReportsByYear(_groupBy(reportData, (report) => moment(report.startDate).year()))

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
      dispatch(clearYieldReport())
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
          <Col
            lg={6}
            md={5}
            className='d-flex align-items-center justify-content-start'
          >
            {/* Filter */}
            <Button.Ripple
              id='yieldReportFilterBtn'
              className='px-0'
              color='flat'
              style={{ minWidth: '60px', minHeight: '28px' }}
              onClick={() => toggleFilter()}
            >
              <IconFilter style={{ minWidth: '30px', minHeight: '28px' }}/>
            </Button.Ripple>
            <UncontrolledTooltip
              placement='top'
              target={`yieldReportFilterBtn`}
            >
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
            <UncontrolledTooltip
              placement='top'
              target={`search-input`}
            >
              {`${intl.formatMessage({ id: 'Operation report placeholder' })}`}
            </UncontrolledTooltip>
          </Col>
          <Col
            lg={4}
            md={4}
            className='d-flex align-items-center justify-content-end my-md-0 mt-1'
          >
            <Button.Ripple
              id='yieldReportExportBtn'
              className='px-1'
              color='flat'
              onClick={toggleModal}
              disabled={reportData?.length === 0}
            >
              {skin === 'dark'
                ? <IconExportDark/>
                : <IconExport/>}
            </Button.Ripple>
            <UncontrolledTooltip
              placement='top'
              target={`yieldReportExportBtn`}
            >
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
          <Col
            lg={2}
            md={3}
            className='my-lg-0 mt-1'
          >
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
                      setDisplayColumns(e.target.checked
                        ? requiredKeys
                        : [])
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
            <UncontrolledTooltip
              placement='top'
              target='showHideColumnsButton'
            >
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
              <Col
                lg={3}
                md={4}
              >
                <div
                  className='report-filter'
                  style={{ maxHeight: 'calc(100vh - 410px)' }}
                >
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
          <Col
            lg={filterIcon
              ? 9
              : 12}
            md={filterIcon
              ? 8
              : 4}
          >
            <DataTable
              noHeader
              paginationServer
              className={classnames(
                'react-dataTable react-dataTable--projects react-dataTable--yield-report',
                { 'overflow-hidden': reportData?.length <= 0 }
              )}
              columns={dailyColumns}
              sortIcon={<ChevronDown size={10}/>}
              data={
                reportData.length > 0
                  ? [
                    summaryData,
                    ...reportData
                  ]
                  : []
              }
              keyField='projectId'
              persistTableHead
              noDataComponent={''}
            />
          </Col>
        </Row>
      </CardBody>

      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className='modal-dialog-centered'
      >
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
          >
            {isExport && <Spinner
              color='success'
              style={{ width: 15, height: 15 }}
            />}
            {intl.formatMessage({ id: 'Export' })}
          </Button>
          <Button
            color='flat-danger'
            onClick={() => toggleModal()}
          >
            {intl.formatMessage({ id: 'Cancel' })}
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  )
}

ReportTable.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ReportTable)
