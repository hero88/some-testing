// ** Third party components
import {
  Button,
  Card,
  Col,
  CustomInput,
  Row,
  Input,
  ModalHeader,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  UncontrolledTooltip,
  Badge, CardBody
} from 'reactstrap'
import { ChevronDown, FilePlus } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { getUsersActivities, getReportUsersActivities } from '../../settings/users/store/actions'
import CustomNoRecords from '@src/views/common/CustomNoRecords'
import SpinnerGrowColors from '@src/views/common/SpinnerGrowColors'
import { useDispatch, useSelector } from 'react-redux'
import ExcelJS from 'exceljs'
import * as FileSaver from 'file-saver'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'
import { DateRangePicker } from 'element-react/next'

// Custom component
import CheckboxTree from '@src/views/report/projects/CheckboxTree'
import CP from '@src/views/common/pagination'
import {
  DISPLAY_DATE_FORMAT, DISPLAY_DATE_FORMAT_CALENDAR,
  DISPLAY_DATE_TIME_FORMAT,
  ROWS_PER_PAGE_DEFAULT,
  ROWS_PER_PAGE_OPTIONS
} from '@constants/index'

export const renderAlertStatus = (status) => {
  switch (status) {
    case 'true':
      return (
        <Badge pill color="light-success">
          <FormattedMessage id="Result success" />
        </Badge>
      )
    case 'false':
      return (
        <Badge pill color="light-muted">
          <FormattedMessage id="Result failed" />
        </Badge>
      )
    default:
      return null
  }
}

const ActivitiesTableReport = ({ intl }) => {
  const dispatch = useDispatch()
  const {
    user: store,
    layout: { requestCount }
  } = useSelector((store) => store)
  const [rowsPerPage, setRowsPerPage] = useState(store?.paramsActivities?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [currentPage, setCurrentPage] = useState(store?.paramsActivities?.page || 1),
    [searchValue, setSearchValue] = useState(store?.paramsActivities?.q || ''),
    [orderBy, setOrderBy] = useState(
      store?.paramsActivities?.order && store?.paramsActivities?.order.length
        ? store?.paramsActivities?.order.split(' ')[0]
        : 'createDate'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.paramsActivities?.order && store?.paramsActivities?.order.length
        ? store?.paramsActivities?.order.split(' ')[1]
        : 'desc'
    ),
    [rangePicker, setRangePicker] = useState([new Date(), new Date()]),
    fromDate = moment(rangePicker[0]).startOf('d').valueOf(),
    toDate = moment(rangePicker[1])?.startOf('d').valueOf(),
    [modal, setModal] = useState(false),
    [property, setProperty] = useState(),
    [action, setAction] = useState(),
    [fileName, setFileName] = useState(
      `UsersActivitiesReport_${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      }`
    ),
    [fileFormat, setFileFormat] = useState('xlsx'),
    language = localStorage.getItem('language'),
    [filter, setFilter] = useState(),
    [selectedType, setSelectedType] = useState({})

  const columns = [
    {
      name: intl.formatMessage({ id: 'Username' }),
      selector: 'user.username',
      cell: (row) => row.user.username,
      minWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'User' }),
      selector: 'user.fullName',
      cell: (row) => row.user.fullName,
      minWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Action' }),
      selector: language === 'vi' ? 'summary_vi' : 'summary_en',
      cell: (row) => (language === 'vi' ? row.summary_vi : row.summary_en),
      minWidth: '350px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Date' }),
      selector: 'createDate',
      cell: (row) => moment(Number(row.createDate)).format(DISPLAY_DATE_TIME_FORMAT),
      minWidth: '150px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Result' }),
      selector: 'success',
      cell: (row) => renderAlertStatus(`${row.success}`),
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Note' }),
      selector: 'note',
      cell: (row) => row.note,
      minWidth: '150px'
    }
  ]
  const fetchUsersActivities = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      fk: '*',
      property,
      action,
      fromDate: moment(rangePicker[0]).startOf('d').valueOf(),
      toDate: moment(rangePicker[1]).endOf('d').valueOf(),
      ...queryParam
    }

    await dispatch(getUsersActivities(initParam))
  }

  const FetchDataToExport = async (queryParam) => {
    const initParam = {
      rowsPerPage: store.totalActivities || 1000,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      fk: '*',
      property,
      action,
      fromDate: moment(rangePicker[0]).startOf('d').valueOf(),
      toDate: moment(rangePicker[1]).endOf('d').valueOf(),
      ...queryParam
    }
    await dispatch(getReportUsersActivities(initParam))
  }

  const categories = [
      { title: intl.formatMessage({ id: 'Solar panels' }), type: 'PV' },
      { title: intl.formatMessage({ id: 'Inverter' }), type: 'inverter' },
      { title: intl.formatMessage({ id: 'Meter' }), type: 'meter' },
      { title: intl.formatMessage({ id: 'Information' }), type: 'information' },
      { title: intl.formatMessage({ id: 'Settings' }), type: 'setting' }
    ],
    eventTypes = [
      { title: intl.formatMessage({ id: 'Create' }), type: 'CREATE' },
      { title: intl.formatMessage({ id: 'Delete' }), type: 'DELETE' },
      { title: intl.formatMessage({ id: 'Update' }), type: 'UPDATE' },
      { title: intl.formatMessage({ id: 'Login' }), type: 'LOGIN' }
    ]

  const handlePerPage = (e) => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.totalActivities / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchUsersActivities({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
  }

  const handlePagination = (page) => {
    fetchUsersActivities({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  const CustomPagination = () => {
    const count = Math.ceil(store.totalActivities / rowsPerPage)
    return (
      <CP
        totalRows={store.totalActivities}
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={'pagination react-paginate'}
        pageRange={2}
        nextPagesClassName={'page-item next'}
        nextPagesLinkClassName={'page-link double'}
        nextPagesLabel={''}
        previousPagesClassName={'page-item prev'}
        previousPagesLinkClassName={'page-link double'}
        previousPagesLabel={''}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        handlePerPage={handlePerPage}
        displayUnit={intl.formatMessage({ id: 'Project' }).toLowerCase()}
      />
    )
  }

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchUsersActivities({ q: value })
    }
  }

  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      fetchUsersActivities({ page: 1 })
    }
  }

  const toggleModal = () => {
    setModal(!modal)
  }
  const prepareDataToExport = () => {
    toggleModal()
    FetchDataToExport()
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

  const mergeCells = (ws, row, from, to) => {
    ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`)
  }
  const handleExport = async () => {
    toggleModal()
    const sheetName = '2021'
    const clearData = store?.activitiesDataReportData?.map((data, index) => {
      return {
        stt: index + 1,
        username: data.user.username,
        user: data.user.fullName,
        summary: data.summary,
        createDateFormatted: moment(data.createDateFormatted).format(DISPLAY_DATE_TIME_FORMAT),
        result: data.success ? (language === 'vi' ? 'Thành công' : 'Successful') : (language === 'vi' ? 'Không thành công' : 'Unsuccessful'),
        note: data.note
      }
    })
    if (clearData.length === 0) {
      return
    }

    const widths = [{ width: 7 }, { width: 35 }, { width: 35 }, { width: 100 }, { width: 26 }, { width: 20 }, { width: 35}]
    const myTitle = [
      `${intl.formatMessage({ id: 'User activities report' }).toUpperCase()}: ${moment(fromDate).format(DISPLAY_DATE_FORMAT)}${
        moment(fromDate).date() === moment(toDate).date() ? '' : moment(toDate).format(`-${DISPLAY_DATE_FORMAT}`)
      } `,
      '',
      '',
      '',
      '',
      ''
    ]

    const myHeader = [
      '',
      intl.formatMessage({ id: 'Username' }),
      intl.formatMessage({ id: 'User' }),
      intl.formatMessage({ id: 'Action' }),
      intl.formatMessage({ id: 'Date' }),
      intl.formatMessage({ id: 'Result' }),
      intl.formatMessage({ id: 'Note' })
    ]
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet(sheetName)
    // const columns = myHeader?.length
    const titleProps = {
      border: true,
      height: 50,
      font: { name: 'Time New Roman', size: 16, bold: true, color: { argb: '4a777b' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'f2f2f2'
        }
      }
    }
    const headerProps = {
      headerBorder: {
        top: { style: 'medium', color: { argb: 'ffffff' } },
        left: { style: 'medium', color: { argb: 'ffffff' } }
      },
      height: 40,
      font: { name: 'Time New Roman', size: 12, bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '44777b'
        }
      }
    }
    const dataProps1 = {
      border: true,
      height: 30,
      font: { name: 'Time New Roman', size: 12, bold: false, color: { argb: '010000' }, outline: true },
      alignment: { horizontal: 'justify', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'fde9d9'
        }
      }
    }
    const dataProps2 = {
      border: true,
      height: 30,
      font: { name: 'Time New Roman', size: 12, bold: false, color: { argb: '010000' } },
      alignment: { horizontal: 'justify', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'd7dfea'
        }
      }
    }
    if (widths && widths.length > 0) {
      ws.columns = widths
    }
    const row = addRow(ws, myTitle, titleProps)
    mergeCells(ws, row, 1, 7)
    addRow(ws, myHeader, headerProps)
    clearData.forEach((row, index) => {
      index % 2 === 0 ? addRow(ws, Object.values(row), dataProps1) : addRow(ws, Object.values(row), dataProps2)
    })
    const optionProtect = {
      selectLockedCells: true
    }
    const randomPass = Math.floor(Math.random() * 10000)
    ws.protect(randomPass.toString(), optionProtect)
    const buf = await wb.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buf]), `${fileName}.${fileFormat}`)
  }

  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchUsersActivities({
      order: `${column.selector} ${direction}`
    })
  }

  // Handle click reset
  const handleClickReset = () => {
    setProperty(undefined)
    setAction(undefined)
    setSelectedType({})
    setCurrentPage(1)
    setRowsPerPage(10)
    setSearchValue('')
    setRangePicker([new Date(), new Date()])
    const initParam = {
      page: 1,
      rowsPerPage: 10,
      q: '',
      order: 'createDate desc',
      fk: '*',
      action: undefined,
      property: undefined,
      fromDate: moment(new Date()).startOf('d').valueOf(),
      toDate: moment(new Date()).endOf('d').valueOf()
    }
    fetchUsersActivities(initParam)
  }

  // Event types and categories checkbox
  const eventTypesCheckboxes = [
    {
      label: intl.formatMessage({ id: 'Event types' }),
      value: 'ckbAll',
      radioName: 'eventIdRadio',
      isRadio: true,
      isTextOnly: true,
      containerClass: 'container__all',
      children: eventTypes.map(event => (
        {
          label: event.title,
          value: event.type,
          radioName: 'eventIdRadio',
          isRadio: true
        }
      ))
    }
  ]
  const categoryTypesCheckboxes = [
    {
      label: intl.formatMessage({ id: 'Categories' }),
      value: 'ckbAll',
      radioName: 'categoryIdRadio',
      isRadio: true,
      isTextOnly: true,
      containerClass: 'container__all',
      children: categories.map(event => (
        {
          label: event.title,
          value: event.type,
          radioName: 'categoryIdRadio',
          isRadio: true
        }
      ))
    }
  ]

  // Filter for event types and categories
  const onFilter = () => {
    setFilter(true)
  }
  const handleCancel = () => {
    setFilter(false)
  }

  // Handle change calendar
  const onChangeRangePicker = (date) => {
    const validDate = date || [new Date(), new Date()]
    setRangePicker(validDate)
    setCurrentPage(1)
    fetchUsersActivities({
      page: 1,
      fromDate: moment(validDate[0]).startOf('d').valueOf(),
      toDate: moment(validDate[1]).endOf('d').valueOf()
    })
    setFileName(
      `UserActivitiesReport_${moment(moment(validDate[0]).startOf('d').valueOf()).format(DISPLAY_DATE_FORMAT)}${
        moment(moment(validDate[0]).startOf('d').valueOf()).date() === moment(moment(validDate[1]).endOf('d').valueOf()).date() ? '' : moment(moment(validDate[1]).endOf('d').valueOf()).format(`-${DISPLAY_DATE_FORMAT}`)
      }`
    )
  }

  // Submit event types and categories filter form
  const handleFilterType = (event) => {
    event.preventDefault()
    setCurrentPage(1)
    fetchUsersActivities({ page: 1 })
    setFilter(false)
  }

  //Set action and property when filter
  useEffect(() => {
    if (selectedType.eventIdRadio !== null && selectedType.eventIdRadio !== undefined) {
      setAction(selectedType.eventIdRadio)
    } else setAction(undefined)

    if (selectedType.categoryIdRadio !== null && selectedType.categoryIdRadio !== undefined) {
      setProperty(selectedType.categoryIdRadio)
    } else setProperty(undefined)
  }, [selectedType])

  useEffect(async () => {
    await Promise.all([fetchUsersActivities(), FetchDataToExport()])
  }, [])

  return (
    <Card>
      <CardBody>
        <Row className="mb-2">
          <Col lg={6} md={6} className="d-flex align-items-center justify-content-sm-start my-md-0 mt-1">
            <DateRangePicker
              value={rangePicker}
              placeholder={intl.formatMessage({ id: `Pick day` })}
              onChange={ onChangeRangePicker }
              disabledDate={time => time.getTime() > Date.now()}
              firstDayOfWeek={1}
              format={DISPLAY_DATE_FORMAT_CALENDAR}
            />
            <Button.Ripple style={{marginRight: '14px', marginLeft: '14px'}} color="primary" outline onClick={() => handleClickReset()}>
              <FormattedMessage id="Reset" />
            </Button.Ripple>
            <Button.Ripple color="primary" outline onClick={prepareDataToExport}>
              <FilePlus size={16} />
              <FormattedMessage id="Export" />
            </Button.Ripple>
          </Col>
          <Col lg={6} md={6} className="d-flex align-items-center justify-content-sm-end my-md-0 mt-1">
            <Label className="mr-1" for="search-input">
              <FormattedMessage id="Search" />
            </Label>
            <Input
              className="dataTable-filter"
              type="search"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}`}
            />
            <UncontrolledTooltip placement="top" target={`search-input`}>
              {`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}`}
            </UncontrolledTooltip>
            {/* Filter */}
            <Button.Ripple
              id='eventFilter'
              className='px-0'
              style={{minWidth: "60px", minHeight: "28px"}}
              color='flat'
              onClick={onFilter}
            >
              <IconFilter className='mr-1 ml-1' style={{minWidth: "30px", minHeight: "28px"}}/>
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`eventFilter`}>
              {intl.formatMessage({ id: 'Filter' })}
            </UncontrolledTooltip>
          </Col>
        </Row>
        <DataTable
          tableRef
          noHeader
          pagination
          paginationServer
          className="react-dataTable react-dataTable--projects"
          fixedHeader
          fixedHeaderScrollHeight='calc(100vh - 340px)'
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
          data={store.activitiesData}
          noDataComponent={store.activitiesData && requestCount === 0 ? <CustomNoRecords /> : ''}
          progressPending={requestCount > 0}
          progressComponent={<SpinnerGrowColors />}
          paginationComponent={CustomPagination}
          onSort={customSort}
        />
      </CardBody>

      {/* Modal export */}
      <Modal isOpen={modal} toggle={() => toggleModal()} className="modal-dialog-centered">
        <ModalHeader toggle={() => toggleModal()}>{intl.formatMessage({ id: 'Export Excel' })}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={intl.formatMessage({ id: 'Enter file Name' })}
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type="select"
              id="selectFileFormat"
              name="customSelect"
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
            >
              <option>xlsx</option>
            </CustomInput>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleExport()}>
            {intl.formatMessage({ id: 'Export' })}
          </Button>
          <Button color="flat-danger" onClick={() => toggleModal()}>
            {intl.formatMessage({ id: 'Cancel' })}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal filter */}
      <Modal
        isOpen={filter}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <ModalHeader toggle={handleCancel}>
          <FormattedMessage id='Filter' />
        </ModalHeader>
        <ModalBody>
          {/* Categories Types */}
          <CheckboxTree
          checkboxData={categoryTypesCheckboxes}
          optionObj={selectedType}
          setOptionObj={setSelectedType}
          />
          {/* Event types */}
          <CheckboxTree
          checkboxData={eventTypesCheckboxes}
          optionObj={selectedType}
          setOptionObj={setSelectedType}
          />
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleFilterType}>
            <FormattedMessage id="Finish" />
          </Button>
          <Button color='secondary' onClick={handleCancel}>
            <FormattedMessage id='Cancel' />
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  )
}

ActivitiesTableReport.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(ActivitiesTableReport)
