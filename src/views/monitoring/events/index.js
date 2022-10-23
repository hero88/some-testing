// ** Third party components
import {
  Button,
  Card,
  Col,
  Row,
  Input,
  Label,
  UncontrolledTooltip,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form, CardBody
} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { getUsersActivities } from '../../settings/users/store/actions'
import CustomNoRecords from '@src/views/common/CustomNoRecords'
import SpinnerGrowColors from '@src/views/common/SpinnerGrowColors'
import { useDispatch, useSelector } from 'react-redux'
import { ReactComponent as IconFilter } from '@src/assets/images/svg/table/ic-filter.svg'
import { DateRangePicker } from 'element-react/next'

// Custom component
import { DISPLAY_DATE_FORMAT_CALENDAR, ROWS_PER_PAGE_DEFAULT, ROWS_PER_PAGE_OPTIONS } from '@constants/index'
import CP from '@src/views/common/pagination'
import CheckboxTree from '@src/views/report/projects/CheckboxTree'
import classnames from 'classnames'

export const renderAlertStatus = (status) => {
  switch (status) {
    case 'true':
      return (
        <Badge pill color='light-success'>
          <FormattedMessage id='Result success' />
        </Badge>
      )
    case 'false':
      return (
        <Badge pill color='light-muted'>
          <FormattedMessage id='Result failed' />
        </Badge>
      )
    default:
      return null
  }
}

const EventsMonitoring = ({ intl }) => {
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
    [property, setProperty] = useState(),
    [action, setAction] = useState(),
    [filter, setFilter] = useState(),
    [selectedType, setSelectedType] = useState({})

  const language = localStorage.getItem('language')
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
      cell: (row) => (
        language === 'vi' ? row.summary_vi : row.summary_en
      ),
      minWidth: '350px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Date' }),
      selector: 'createDate',
      cell: (row) => moment(Number(row.createDate)).format('DD/MM/YYYY HH:mm:ss'),
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
      action,
      property,
      fromDate: moment(rangePicker[0]).startOf('d').valueOf(),
      toDate: moment(rangePicker[1]).endOf('d').valueOf(),
      ...queryParam
    }

    await dispatch(getUsersActivities(initParam))
  }

  useEffect(async () => {
    await Promise.all([fetchUsersActivities()])
  }, [])

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
        displayUnit={intl.formatMessage({ id: 'item' })}
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

  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchUsersActivities({
      order: `${column.selector} ${direction}`
    })
  }

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
      fk: '*',
      action: undefined,
      property: undefined,
      fromDate: moment(new Date()).startOf('d').valueOf(),
      toDate: moment(new Date()).endOf('d').valueOf()
    }
    fetchUsersActivities(initParam)
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
  }

  // Filter
  const onFilter = () => {
    setFilter(true)
  }
  const handleCancel = () => {
    setFilter(false)
  }

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

  // Submit filter form
  const formSubmit = (event) => {
    event.preventDefault()
    setCurrentPage(1)
    fetchUsersActivities({ page: 1, property, action })
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

  return (
    <Card>
      <CardBody>
        <Row className='mb-2'>
          <Col lg={5} md={5} className='d-flex align-items-center justify-content-start my-md-0 mt-1'>
            <DateRangePicker
              value={rangePicker}
              placeholder={intl.formatMessage({ id: `Pick day` })}
              onChange={onChangeRangePicker}
              disabledDate={time => time.getTime() > Date.now()}
              firstDayOfWeek={1}
              format={DISPLAY_DATE_FORMAT_CALENDAR}
            />
            <Button.Ripple color='primary' style={{ marginLeft: '14px' }} onClick={() => handleClickReset()}>
              <FormattedMessage id='Reset' />
            </Button.Ripple>
          </Col>
          <Col lg={7} md={7} className='d-flex align-items-center justify-content-end my-md-0 mt-1'>
            {/* Search */}
            <Label className='mr-1' for='search-input'>
              <FormattedMessage id='Search' />
            </Label>
            <Input
              className='dataTable-filter'
              type='search'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}`}
            />
            <UncontrolledTooltip placement='top' target={`search-input`}>
              {`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}`}
            </UncontrolledTooltip>

            {/* Filter */}
            <Button.Ripple
              id='eventFilter'
              className='px-0'
              style={{ minWidth: '60px', minHeight: '28px' }}
              color='flat'
              onClick={onFilter}
            >
              <IconFilter className='mr-1 ml-1' style={{ minWidth: '30px', minHeight: '28px' }} />
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`eventFilter`}>
              {intl.formatMessage({ id: 'Filter' })}
            </UncontrolledTooltip>
            {/* { */}
            <Button.Ripple
              style={{ marginLeft: '0px' }}
              color='primary'
              className='add-project'
              onClick={() => fetchUsersActivities()}
            >
              <FormattedMessage id='Refresh' />
            </Button.Ripple>
            {/* } */}
          </Col>
        </Row>
        <DataTable
          tableRef
          noHeader
          pagination
          paginationServer
          className={classnames(
            'react-dataTable react-dataTable--projects',
            { 'overflow-hidden': store?.activitiesData?.length <= 0 }
          )}
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

      <Modal
        isOpen={filter}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <Form onSubmit={formSubmit}>
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
            <Button color='primary' type='submit'>
              <FormattedMessage id='Finish' />
            </Button>
            <Button color='secondary' onClick={() => setSelectedType({})}>
              <FormattedMessage id='Reset' />
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Card>
  )
}

EventsMonitoring.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(EventsMonitoring)
