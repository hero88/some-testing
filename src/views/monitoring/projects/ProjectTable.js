// ** React Imports
import React, { useEffect, useState } from 'react'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getProjects } from '@src/views/monitoring/projects/store/actions'

// ** Third Party Components

import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import {
  ButtonDropdown,
  Card,
  Col, CustomInput, DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Select from 'react-select'
import PropTypes from 'prop-types'

// ** Customer components
import {
  PROJECT_BUSINESS_MODEL,
  PROJECT_STATUS, ROWS_PER_PAGE_DEFAULT,
  ROWS_PER_PAGE_OPTIONS,
  STATE
} from '@constants/index'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroup from 'reactstrap/es/InputGroup'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import { ReactComponent as IconColumn } from '@src/assets/images/svg/table/ic-column.svg'
import CP from '@src/views/common/pagination'
import { informationColumns, monitoringColumns } from '@src/views/monitoring/projects/Columns'
import classnames from 'classnames'

const ProjectTable = ({ intl, isInformation }) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const {
    customerProject: store,
    customer: { allData: customerData }
  } = useSelector((state) => state)

  const requiredKeys = isInformation
    ? [
      'status',
      'projectCode',
      'projectName',
      'startDate',
      'investorName',
      'partner',
      'customer',
      'electricityCode',
      'electricityName',
      'address'
    ]
    : [
      'status',
      'projectCode',
      'projectName',
      'wattageAC',
      'wattageDC',
      'realtimePower',
      'businessModel',
      'todayYield',
      'totalYield',
      'equivalentHour',
      'coefficientCF',
      'meter',
      'inverter',
      'investor',
      'eName',
      'partner'
    ]

  // ** States
  const [currentPage, setCurrentPage] = useState(1),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [searchValue, setSearchValue] = useState(store?.params?.q || ''),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[0] : 'orderNo'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[1] : 'asc'
    ),
    [customerOptions, setCustomerOptions] = useState([]),
    [userFilter, setUserFilter] = useState(undefined),
    [customerValue, setCustomerValue] = useState(null),
    [electricityOptions, setElectricityOptions] = useState([]),
    [electricityValue, setElectricityValue] = useState(null),
    [displayColumns, setDisplayColumns] = useState(requiredKeys),
    [dropdownOpen, setDropdownOpen] = useState(false),
    [selectAll, setSelectAll] = useState(false)

  // Set customer options
  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setCustomerOptions(
        customerData.map((customer) => (
          {
            label: customer.fullName,
            value: customer.id
          }
        ))
      )

      const filterPCCustomer = customerData.filter(customer => customer?.fullName?.startsWith('PC'))
      setElectricityOptions(
        filterPCCustomer.map((electricity) => (
          {
            label: electricity.fullName,
            value: electricity.id
          }
        ))
      )
    }
  }, [customerData])

  // Fetch project API
  const fetchProjects = (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue === '' ? undefined : searchValue,
      order: `${orderBy} ${sortDirection}`,
      getAll: 1,
      fk: '*',
      users: userFilter,
      partnerId: customerValue ? customerValue.value : undefined,
      electricityCustomerId: electricityValue ? electricityValue.value : undefined,
      state: [STATE.ACTIVE].toString(),
      isSum: !isInformation,
      ...queryParam
    }

    // ** Set data to store
    dispatch(getProjects(initParam))
  }

  // ** Get data on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchProjects({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchProjects()
    }
  }

  // ** Filter relationship
  const onChangeSelect = (option, event) => {
    const tempValue = option ? option.value : undefined

    if (event.name === 'user') setUserFilter(tempValue)

    if (event.name === 'customer') {
      setCustomerValue(option)
    }

    if (event.name === 'electricity') {
      setElectricityValue(option)
    }

    fetchProjects({
      users: event.name === 'user' ? tempValue : userFilter,
      electricityCustomerId: event.name === 'electricity' ? tempValue : electricityValue?.value,
      partnerId: event.name === 'customer' ? tempValue : customerValue?.value
    })
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    fetchProjects({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    fetchProjects({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)

    return (
      <CP
        totalRows={store.total}
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

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchProjects({
      order: `${column.selector} ${direction}`
    })
  }

  // Set dropdown menu on/off
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // ** Checking display columns
  const checkDisplayColumns = ({ selectedData, item, isChecked }) => {
    const columns = [...selectedData]
    const index = columns.findIndex((column) => column === item)

    if (isChecked && index === -1) {
      columns.push(item)
    } else if (!isChecked && index > -1) {
      columns.splice(index, 1)
    }

    return columns
  }

  // ** Column header
  const serverSideColumns = isInformation
    ? informationColumns({ intl, displayColumns })
    : monitoringColumns({ intl, displayColumns })

  const statusOptions = [
      { value: PROJECT_STATUS.INACTIVE, label: intl.formatMessage({ id: 'Active' }) },
      { value: PROJECT_STATUS.ACTIVE, label: intl.formatMessage({ id: 'Inactive' }) },
      { value: PROJECT_STATUS.WARNING, label: intl.formatMessage({ id: 'Warning' }) },
      { value: PROJECT_STATUS.DANGER, label: intl.formatMessage({ id: 'Danger' }) }
    ],
    businessOptions = [
      { value: PROJECT_BUSINESS_MODEL.EVN.value, label: intl.formatMessage({ id: PROJECT_BUSINESS_MODEL.EVN.text }) },
      {
        value: PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.value,
        label: intl.formatMessage({ id: PROJECT_BUSINESS_MODEL.CUSTOMER_EVN.text })
      }
    ]

  const renderTotalRow = (data) => {
    return (
      data
        ? {
          id: 'projectTotalRow',
          status: null,
          code: '',
          name: intl.formatMessage({ id: 'Total' }),
          wattageAC: data.sumInstallWattageAc,
          wattageDC: data.sumInstallWattageDc,
          todayActivePower: data.sumRealtimeWattageAc,
          type: data.sumType,
          todayYield: data.sumDailyYield,
          totalYield: data.sumTotalYield,
          monthlyYield: data.sumMonthlyYield,
          equivalentHour: data.sumSunshineHour,
          coefficientCF: data.cf,
          inverters: data.inverters,
          meters: data.meters,
          investors: '',
          electricities: '',
          customers: ''
        }
        : {
          id: 'projectTotalRow',
          status: null,
          code: '',
          name: intl.formatMessage({ id: 'Total' }),
          wattageAC: 0,
          wattageDC: 0,
          todayActivePower: 0,
          type: null,
          todayYield: 0,
          totalYield: 0,
          equivalentHour: 0,
          coefficientCF: 0,
          meters: 0,
          inverters: 0,
          investorName: '',
          electricityName: '',
          customer: ''
        }
    )
  }

  return (
    <Card className='p-2 mb-0'>
      <Row className='mb-1'>
        <Col lg={4} md={12} className='my-lg-0 mb-1'>

          {/* eslint-disable-next-line react/jsx-no-undef */}
          <InputGroup className='input-group-merge'>
            <Input
              className='form-control'
              type='search'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={intl.formatMessage({ id: 'Name, phone, address, province, investor, electricity' })}
            />
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <InputGroupAddon addonType='append'>
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <InputGroupText>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <IconSearch />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <UncontrolledTooltip placement='top' target={`search-input`}>
            {intl.formatMessage({ id: 'Name, phone, address, province, investor, electricity' })}
          </UncontrolledTooltip>
        </Col>
        <Col lg='2' md='4' className='my-md-0 mb-1'>
          <Select
            id='searchElectricityInput'
            name='electricity'
            isClearable
            options={electricityOptions}
            className='line-select'
            classNamePrefix='select'
            placeholder={intl.formatMessage({ id: 'Select electricity' })}
            value={electricityValue}
            onChange={onChangeSelect}
          />
          <Select
            options={statusOptions}
            className='d-none'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Status' />}
          />
        </Col>
        <Col lg='2' md='4'>
          <Select
            options={businessOptions}
            className='d-none line-select'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Business model' />}
          />
          <Select
            name='customer'
            isClearable
            options={customerOptions}
            className='line-select'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Select partner' />}
            value={customerValue}
            onChange={onChangeSelect}
          />
        </Col>
        <Col
          lg={4}
          md={4}
          className='d-flex align-items-center justify-content-end my-md-0 mt-1'
        >
          <ButtonDropdown
            className='show-column ml-1'
            direction='left'
            isOpen={dropdownOpen}
            toggle={toggleDropdown}
          >
            <DropdownToggle
              id='showHideColumnsButton'
              color='primary'
              outline
            >
              <IconColumn />
              <span><FormattedMessage id='Display columns' /></span>
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
              <DropdownItem divider />
              {
                requiredKeys.map((key, index) => {
                  return <div
                    key={index}
                    style={{ width: 250 }}
                    className='px-1'
                  >
                    <CustomInput
                      type='checkbox'
                      className='custom-control-Primary mr-1'
                      checked={displayColumns.findIndex(column => column === key) > -1}
                      value={key}
                      onChange={(e) => {
                        setDisplayColumns(checkDisplayColumns({
                          selectedData: displayColumns,
                          item: key,
                          isChecked: e.target.checked
                        }))
                      }}
                      id={`ckb_${key}`}
                      label={intl.formatMessage({ id: key })}
                    />
                  </div>
                })
              }
            </DropdownMenu>
          </ButtonDropdown>
          <UncontrolledTooltip placement='top' target='showHideColumnsButton'>
            <FormattedMessage id='Display or hide columns' />
          </UncontrolledTooltip>
        </Col>
      </Row>
      <DataTable
        noHeader
        pagination
        responsive={true}
        paginationServer
        className={classnames('react-dataTable react-dataTable--monitoring-project', { 'overflow-hidden': store?.data?.length <= 0 })}
        columns={serverSideColumns}
        sortIcon={<ChevronDown size={10} />}
        paginationComponent={CustomPagination}
        data={
          isInformation
            ? store?.data
            : store?.data?.length > 0
              ? [
                renderTotalRow(store?.summaryData),
                ...store?.data
              ]
              : []
        }
        persistTableHead
        noDataComponent={''}
        onSort={customSort}
        sortServer
        defaultSortAsc={sortDirection === 'asc'}
        defaultSortField={orderBy}
      />
    </Card>
  )
}

ProjectTable.propTypes = {
  intl: PropTypes.object.isRequired,
  isInformation: PropTypes.bool.isRequired
}

export default injectIntl(ProjectTable)
