// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { getCustomers, inactivateCustomer, setSelectedCustomer } from './store/actions'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Edit, Unlock } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Label, Row, Col, Button, UncontrolledTooltip, CardLink } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import CreatableSelect from 'react-select/creatable'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Custom components
import Avatar from '@components/avatar'

// Constants
import { ROUTER_URL, ROWS_PER_PAGE_DEFAULT } from '@constants/index'
import CustomNoRecords from '@src/views/common/CustomNoRecords'
import { AbilityContext } from '@src/utility/context/Can'
import SpinnerGrowColors from '@src/views/common/SpinnerGrowColors'

const MySweetAlert = withReactContent(SweetAlert)

const CustomerTable = ({ intl, editCustomer, isShowAllProjects }) => {
  // History
  const history = useHistory()

  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch()
  const { customer: store, layout: { skin, requestCount } } = useSelector(state => state)

  // ** States
  const [currentPage, setCurrentPage] = useState(store?.params?.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [searchValue, setSearchValue] = useState(store?.params?.q || ''),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length
      ? store?.params?.order.split(' ')[0]
      : 'fullName'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length
      ? store?.params?.order.split(' ')[1]
      : 'asc'
    )

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getCustomers({
        page: currentPage,
        rowsPerPage,
        q: searchValue,
        order: `${orderBy} ${sortDirection}`
      })
    )
  }, [dispatch])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      dispatch(
        getCustomers({
          page: 1,
          rowsPerPage,
          q: value,
          order: `${orderBy} ${sortDirection}`
        })
      )
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(
        getCustomers({
          page: currentPage,
          rowsPerPage,
          q: searchValue,
          order: `${orderBy} ${sortDirection}`
        })
      )
    }
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    dispatch(
      getCustomers({
        page: page.selected + 1,
        rowsPerPage,
        q: searchValue,
        order: `${orderBy} ${sortDirection}`
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    dispatch(
      getCustomers({
        page: maxPage < currentPage ? maxPage : currentPage,
        rowsPerPage: perPage,
        q: searchValue,
        order: `${orderBy} ${sortDirection}`
      })
    )

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    if (store.data) {
      const filters = {
        q: searchValue
      }

      const isFiltered = Object.keys(filters).some(function (k) {
        return filters[k].length > 0
      })

      if (store.data.length > 0) {
        return store.data
      } else if (store.data.length === 0 && isFiltered) {
        return []
      } else {
        return store.allData.slice(0, rowsPerPage)
      }
    }
  }

  const handleConfirmCancel = (projectId) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete customer title' }),
      html: intl.formatMessage({ id: 'Delete customer message' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Delete project Yes button' }),
      cancelButtonText: intl.formatMessage({ id: 'Delete project Cancel button' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark'
        }),
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        dispatch(inactivateCustomer(projectId))
        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Delete customer successfully title' }),
          text: intl.formatMessage({ id: 'Delete customer successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Delete customer fail title' }),
          text: intl.formatMessage({ id: 'Delete customer fail message' }),
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

  // Handle Click
  const handleClick = async (projectId) => {
    await handleConfirmCancel(projectId)
  }

  // Set selected customer to store
  const clickOnRow = (row) => {
    dispatch(setSelectedCustomer(row))
    history.push({
      pathname: ROUTER_URL.PROJECTS,
      search: `?customerId=${row.id}`
    })
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    dispatch(
      getCustomers({
        page: currentPage,
        rowsPerPage,
        q: searchValue,
        order: `${column.selector} ${direction}`
      })
    )
  }

  // ** Column header
  const serverSideColumns = [
    {
      name: '',
      selector: 'avatar',
      // eslint-disable-next-line react/display-name
      cell: row => <Avatar
        img={
          row.avatar
          ? row.avatar
          : require('@src/assets/images/avatars/avatar-blank.svg').default
        }
      />,
      minWidth: '80px',
      maxWidth: '80px'
    },
    {
      name: intl.formatMessage({ id: 'Company name' }).toUpperCase(),
      selector: 'fullName',
      // eslint-disable-next-line react/display-name
      cell: row => <CardLink className='text-primary' onClick={() => clickOnRow(row)}>
        {row.fullName}
      </CardLink>,
      sortable: true,
      minWidth: '160px',
      maxWidth: '160px'
    },
    {
      name: intl.formatMessage({ id: 'Email' }).toUpperCase(),
      selector: 'emails',
      cell: row => {
        try {
          if (row.emails && row.emails.length > 0) {
            return row.emails[0].value
          }
        } catch (err) {
          return ''
        }
      },
      sortable: true,
      minWidth: '180px',
      maxWidth: '350px'
    },
    {
      name: intl.formatMessage({ id: 'Phone' }).toUpperCase(),
      selector: 'phones',
      cell: row => {
        try {
          if (row.phones && row.phones.length > 0) {
            return row.phones[0].value
          }
        } catch (err) {
          return ''
        }
      },
      sortable: true,
      minWidth: '120px',
      maxWidth: '220px'
    },
    {
      name: intl.formatMessage({ id: 'Address' }).toUpperCase(),
      selector: 'locations',
      cell: row => {
        try {
          if (row.locations && row.locations.length > 0) {
            return row.locations[0].address
          }
        } catch (err) {
          return ''
        }
      },
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Today yield' }).toUpperCase(),
      selector: 'todayYield',
      cell: row => (`${row.todayYield ? row.todayYield : 0} MWh`),
      sortable: true,
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Total yield' }).toUpperCase(),
      selector: 'totalYield',
      cell: row => (`${row.totalYield ? row.totalYield : 0} MWh`),
      sortable: true,
      maxWidth: '150px'
    },
    {
      name: '',
      allowOverflow: true,
      maxWidth: '120px',
      // eslint-disable-next-line react/display-name
      cell: row => {
        return (
          <div className='d-flex'>
            <Button.Ripple className='btn-icon' color='flat' onClick={() => editCustomer(row)} id={`editBtn_${row.id}`}>
              <Edit size={20}/>
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`editBtn_${row.id}`}>
              <FormattedMessage id='Edit customer'/>
            </UncontrolledTooltip>
            <Button.Ripple
              className='btn-icon'
              color='flat'
              onClick={() => handleClick(row.id)}
              id={`inactiveBtn_${row.id}`}
            >
              <Unlock size={20}/>
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`inactiveBtn_${row.id}`}>
              <FormattedMessage id='Inactivate customer'/>
            </UncontrolledTooltip>
          </div>
        )
      }
    }
  ]

  const provinceOptions = [
    { value: 1, label: 'Ho Chi Minh' },
    { value: 2, label: 'Ha Noi' },
    { value: 3, label: 'Vung Tau' },
    { value: 4, label: 'Da Nang' },
    { value: 5, label: 'Can Tho' }
  ]

  return (
    <Fragment>
      <Card>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'><FormattedMessage id='Show'/></Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              {
                ability.can('read', 'show-all-projects') && !isShowAllProjects &&
                <Button.Ripple
                  color='primary'
                  className='ml-1'
                  onClick={() => {
                    history.push('/dashboard/projects')
                  }}>
                  <FormattedMessage id='Show all projects'/>
                </Button.Ripple>
              }
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='mr-1' for='search-input'>
              <FormattedMessage id='Search'/>
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={intl.formatMessage({ id: 'Name' })}
            />
            <CreatableSelect
              options={provinceOptions}
              className='react-select project-select d-none'
              classNamePrefix='select'
              placeholder={<FormattedMessage id='Province'/>}
            />
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable react-dataTable--customers hover'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10}/>}
          paginationComponent={CustomPagination}
          data={dataToRender()}
          noDataComponent={
            store.data && requestCount === 0
            ? <CustomNoRecords/>
            : ''
          }
          progressPending={requestCount > 0}
          progressComponent={<SpinnerGrowColors/>}
          onSort={customSort}
          sortServer
          defaultSortAsc={sortDirection === 'asc'}
          defaultSortField={orderBy}
        />
      </Card>
    </Fragment>
  )
}

CustomerTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addCustomer: PropTypes.func,
  editCustomer: PropTypes.func.isRequired,
  isShowAllProjects: PropTypes.bool
}

export default injectIntl(CustomerTable)
