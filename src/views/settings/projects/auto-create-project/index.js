import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Card, Col, CustomInput, Input, Row, UncontrolledTooltip } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import React, { forwardRef, Fragment, useContext, useEffect, useState } from 'react'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import classnames from 'classnames'

import { getSettingAutoCreateProjects, updateAutoCreateProject } from '@src/views/settings/projects/store/actions'
import { USER_ABILITY } from '@constants/user'
import { AbilityContext } from '@src/utility/context/Can'
import InputGroup from 'reactstrap/es/InputGroup'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import CP from '@src/views/common/pagination'
import { ROWS_PER_PAGE_DEFAULT, ROWS_PER_PAGE_OPTIONS } from '@constants/common'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
  <div className='custom-control custom-checkbox'>
    <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
    <label className='custom-control-label' onClick={onClick}/>
  </div>
))

BootstrapCheckbox.displayName = 'BoostrapCheckBox'
BootstrapCheckbox.propTypes = {
  onClick: PropTypes.func
}

const MySweetAlert = withReactContent(SweetAlert)

const AutoCreateDevice = ({ intl, addProject, selectedProjectsSite, setSelectedProjectsSite }) => {
  const dispatch = useDispatch()

  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const {
    layout: { skin },
    project: { autoCreateProject: store }
  } = useSelector((state) => state)

  // ** States
  const [currentPage, setCurrentPage] = useState(store?.params?.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [searchValue, setSearchValue] = useState(store?.params?.q || ''),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[0] : 'name'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[1] : 'asc'
    )

  // Fetch project API
  const fetchDevices = (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      // rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      getAll: 1,
      pendingType: 'createProject',
      ...queryParam
    }

    // ** Set data to store
    dispatch(getSettingAutoCreateProjects(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchDevices()])
  }, [dispatch])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchDevices({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchDevices()
    }
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    fetchDevices({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchDevices({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchDevices({ order: `${column.selector} ${direction}` })
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

  // ** Selected rows
  // Must use temp variable to quarantine local state
  const selectedRows = (event, row) => {
    const tempProjects = [...selectedProjectsSite]
    const index = tempProjects.findIndex((item) => item.dtuId === row.dtuId)

    if (event.target.checked && index === -1) {
      tempProjects.push(row)
    } else if (!event.target.checked && index > -1) {
      tempProjects.splice(index, 1)
    }

    setSelectedProjectsSite(tempProjects)
  }

  const checkExistedProject = () => {
    let isHavingMultiExistedProjects = false
    let isHavingExistedProject = false

    if (selectedProjectsSite?.length > 0) {
      const tempProjectIds = []

      selectedProjectsSite.forEach((item) => {
        if (!tempProjectIds.some((id) => item?.project?.id === id)) {
          tempProjectIds.push(item?.project?.id)
        }
      })

      isHavingMultiExistedProjects = tempProjectIds.length > 1
      isHavingExistedProject = tempProjectIds.length === 1 && tempProjectIds[0]
    }

    if (selectedProjectsSite?.length === 0) {
      return MySweetAlert.fire({
        title: intl.formatMessage({ id: 'Have not selected any projects title' }),
        html: intl.formatMessage({ id: 'Have not selected any projects message' }),
        icon: 'warning',
        confirmButtonText: intl.formatMessage({ id: 'Close' }),
        customClass: {
          popup: classnames({
            'sweet-alert-popup--dark': skin === 'dark'
          }),
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      })
    }

    if (isHavingMultiExistedProjects) {
      return MySweetAlert.fire({
        title: intl.formatMessage({ id: 'Have multi existed projects title' }),
        html: intl.formatMessage({ id: 'Have multi existed projects message' }),
        icon: 'warning',
        confirmButtonText: intl.formatMessage({ id: 'Close' }),
        customClass: {
          popup: classnames({
            'sweet-alert-popup--dark': skin === 'dark'
          }),
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      })
    }

    if (isHavingExistedProject) {
      return MySweetAlert.fire({
        title: intl.formatMessage({ id: 'Have existed project title' }),
        html: intl.formatMessage({ id: 'Have existed project message' }),
        icon: 'question',
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
          const deviceIds = []
          selectedProjectsSite.forEach((project) => {
            project.devices.forEach((device) => {
              deviceIds.push(device.id)
            })
          })

          await dispatch(
            updateAutoCreateProject({
              data: {
                projectId: selectedProjectsSite[0].project.id,
                deviceIds
              },
              params: store?.params,
              setSelectedProjectsSite
            })
          )

          setSelectedProjectsSite([])
        }
      })
    }

    addProject({ isAuto: true })
  }

  // ** Column header
  const serverSideColumns = [

    {
      name: '',
      selector: 'action',
      // eslint-disable-next-line react/display-name
      cell: (row) => (
        <CustomInput
          type='checkbox'
          className='custom-control-Primary'
          id={`ckb_${row.dtuId}`}
          checked={selectedProjectsSite.findIndex((item) => item.dtuId === row.dtuId) > -1}
          onChange={(e) => selectedRows(e, row)}
        />
      ),
      minWidth: '80px',
      maxWidth: '80px'
    },
    {
      name: intl.formatMessage({ id: 'Logger code' }),
      selector: 'dtuId',
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Manufacturer' }),
      selector: 'name',
      wrap: true,
      cell: (row) => (
        row?.devices && row.devices.length
          ? row.devices.map((item, index) => <div key={index}>{item?.id?.split('_')?.[1]}</div>)
          : ''
      ),
      style: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
      minWidth: '180px',
      maxWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'Device S/N' }),
      selector: 'serialNumber',
      wrap: true,
      cell: (row) => (
        row?.devices && row.devices.length
          ? row.devices.map((item, index) => <div key={index}>{item?.serialNumber}</div>)
          : ''
      ),
      style: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
      minWidth: '280px',
      maxWidth: '280px'
    },
    {
      name: intl.formatMessage({ id: 'Existed project' }),
      selector: 'existedProject',
      cell: (row) => (row?.project?.name ? row.project.name : ''),
      minWidth: '280px',
      maxWidth: '280px'
    }
  ]

  return (
    <>
      {store?.data && store.data.length > 0 && (
        <Card className='p-2'>
          <Row className='mb-1'>
            <Col lg='4' md='6' sm='12'>
              {/*<Label for='sort-select'>*/}
              {/*  <FormattedMessage id='Show' />*/}
              {/*</Label>*/}
              {/*<Input*/}
              {/*  className='dataTable-select'*/}
              {/*  type='select'*/}
              {/*  id='sort-select'*/}
              {/*  value={rowsPerPage}*/}
              {/*  onChange={(e) => handlePerPage(e)}*/}
              {/*>*/}
              {/*  <option value={10}>10</option>*/}
              {/*  <option value={25}>25</option>*/}
              {/*  <option value={50}>50</option>*/}
              {/*  <option value={75}>75</option>*/}
              {/*  <option value={100}>100</option>*/}
              {/*</Input>*/}
              <InputGroup className='input-group-merge'>
                <Input
                  className='dataTable-filter'
                  type='search'
                  bsSize='sm'
                  id='search-input'
                  value={searchValue}
                  onChange={handleChangeSearch}
                  onKeyPress={handleFilterKeyPress}
                  placeholder={`${intl.formatMessage({ id: 'Device name' })}, ${intl.formatMessage({
                    id: 'Device S/N'
                  })}`}
                />
                <InputGroupAddon addonType='append'>
                  <InputGroupText>
                    <IconSearch/>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <UncontrolledTooltip placement='top' target={`search-input`}>
                {`${intl.formatMessage({ id: 'Device name' })}, ${intl.formatMessage({ id: 'Device S/N' })}`}
              </UncontrolledTooltip>
            </Col>
            <Col lg='8' md='6' sm='12' className='d-flex justify-content-end my-md-0 mt-1'>
              {ability.can('manage', USER_ABILITY.AUTO_CREATE_PROJECT) && (
                <Button.Ripple color='primary' className='add-project' onClick={checkExistedProject}>
                  <FormattedMessage id='Create project automatically'/>
                </Button.Ripple>
              )}
            </Col>
          </Row>
          <DataTable
            noHeader
            pagination
            paginationServer
            className={classnames('react-dataTable react-dataTable--auto-create-project', { 'overflow-hidden': store?.data?.length <= 0 })}
            fixedHeader
            fixedHeaderScrollHeight='calc(100vh - 340px)'
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10}/>}
            paginationComponent={CustomPagination}
            data={store?.data || []}
            persistTableHead
            noDataComponent={''}
            onSort={customSort}
            sortServer
            defaultSortAsc={sortDirection === 'asc'}
            defaultSortField={orderBy}
          />
        </Card>
      )}
    </>
  )
}

AutoCreateDevice.propTypes = {
  intl: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
  selectedProjectsSite: PropTypes.array.isRequired,
  setSelectedProjectsSite: PropTypes.func.isRequired
}

export default injectIntl(AutoCreateDevice)
