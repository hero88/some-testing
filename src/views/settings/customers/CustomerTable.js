// ** React Imports
import React, { useState, useEffect, useContext } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  reActivateCustomer,
  inactivateCustomer,
  getCustomers, deleteCustomer
} from '@src/views/settings/customers/store/actions'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Button, Badge, UncontrolledTooltip, CardLink } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroup from 'reactstrap/es/InputGroup'
import _unionBy from 'lodash/unionBy'

// Custom components
import { ROWS_PER_PAGE_DEFAULT, ROWS_PER_PAGE_OPTIONS, STATE, USER_ABILITY } from '@constants/index'
import Avatar from '@components/avatar'
import { AbilityContext } from '@src/utility/context/Can'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconLock } from '@src/assets/images/svg/table/ic-lock.svg'
import { ReactComponent as IconUnlock } from '@src/assets/images/svg/table/ic-unlock.svg'
import CP from '@src/views/common/pagination'
import ConfirmPasswordModal from '@src/views/common/modal/ConfirmPasswordModal'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'

const MySweetAlert = withReactContent(SweetAlert)

const CustomerTable = ({ intl, addCustomer, editCustomer, viewCustomer }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch()
  const {
    customer: store,
    user: { allData: userData },
    project: { allData: projectData },
    layout: { skin }
  } = useSelector(state => state)

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
    ),
    [userOptions, setUserOptions] = useState([]),
    [projectOptions, setProjectOptions] = useState([]),
    [userFilter, setUserFilter] = useState(undefined),
    [projectFilter, setProjectFilter] = useState(undefined),
    [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false),
    [currentCustomer, setCurrentCustomer] = useState(null)

  // Set user options
  useEffect(() => {
    if (userData && userData.length > 0) {
      setUserOptions(userData.map((user) => (
        {
          label: user?.fullName,
          value: user?.id
        }
      )))
    }
  }, [userData])

  // Set project options
  useEffect(() => {
    if (projectData && projectData.length > 0) {
      setProjectOptions(projectData.map((project) => (
        {
          label: project?.name,
          value: project?.id
        }
      )))
    }
  }, [projectData])

  // Fetch customer API
  const fetchCustomers = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      getAll: 1,
      fk: '*',
      userIds: userFilter,
      projectIds: projectFilter,
      state: '*',
      ...queryParam
    }

    await dispatch(getCustomers(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchCustomers()])
  }, [])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchCustomers({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchCustomers()
    }
  }

  // ** Filter relationship
  const onChangeSelect = (option, event) => {
    const tempValue = option ? option.value : undefined

    if (event.name === 'user') setUserFilter(tempValue)
    if (event.name === 'project') setProjectFilter(tempValue)

    fetchCustomers({
      page: 1,
      userIds: event.name === 'user' ? tempValue : userFilter,
      projectIds: event.name === 'project' ? tempValue : projectFilter
    })
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchCustomers({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchCustomers({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
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
        displayUnit={intl.formatMessage({ id: 'Customer' }).toLowerCase()}
      />
    )
  }

  const handleConfirmCancel = (customer) => {
    return MySweetAlert.fire({
      title: customer.state === STATE.ACTIVE
        ? intl.formatMessage({ id: 'Inactivate customer title' })
        : intl.formatMessage({ id: 'Activate customer title' }),
      html: customer.state === STATE.ACTIVE
        ? intl.formatMessage({ id: 'Inactivate customer message' })
        : intl.formatMessage({ id: 'Activate customer message' }),
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
        if (customer.state === STATE.ACTIVE) {
          await dispatch(inactivateCustomer(customer.id, store.params))
        } else {
          await dispatch(reActivateCustomer({ id: customer.id, activated: true }, store.params))
        }

        MySweetAlert.fire({
          icon: 'success',
          title: customer.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate customer successfully title' })
            : intl.formatMessage({ id: 'Activate customer successfully title' }),
          text: customer.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate customer successfully message' })
            : intl.formatMessage({ id: 'Activate customer successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: customer.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate customer fail title' })
            : intl.formatMessage({ id: 'Activate customer fail title' }),
          text: customer.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate customer fail message' })
            : intl.formatMessage({ id: 'Activate customer fail message' }),
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

  // Handle delete
  const handleConfirmDelete = ({ customer }) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete customer title' }),
      html: intl.formatMessage({ id: 'Delete customer message' }),
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
        setIsOpenConfirmPassword(true)
        setCurrentCustomer(customer)
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

  const handleConfirmPasswordForDelete = (password) => {
    setIsOpenConfirmPassword(false)
    setCurrentCustomer(null)

    const deleteData = {
      data: {
        id: currentCustomer?.id,
        password
      },
      params: store?.params,
      successCBFunc: () => {
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
      }
    }

    dispatch(deleteCustomer(deleteData))
  }

  // Handle Click
  const handleClick = async (projectId) => {
    await handleConfirmCancel(projectId)
  }

  // Set selected customer to store
  const clickOnRow = (row) => {
    viewCustomer(row)
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchCustomers({
      order: `${column.selector} ${direction}`
    })
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
      name: intl.formatMessage({ id: 'Customer name' }),
      selector: 'fullName',
      // eslint-disable-next-line react/display-name
      cell: row => <CardLink className='text-primary' onClick={() => clickOnRow(row)}>
        {row.fullName}
      </CardLink>,
      sortable: true,
      minWidth: '160px'
    },
    {
      name: intl.formatMessage({ id: 'Customer code' }),
      selector: 'code',
      sortable: true,
      minWidth: '160px',
      maxWidth: '160px'
    },
    {
      name: intl.formatMessage({ id: 'Email' }),
      selector: 'email',
      minWidth: '160px',
      maxWidth: '260px',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Phone' }),
      selector: 'phone',
      sortable: true,
      minWidth: '160px',
      maxWidth: '160px'
    },
    {
      name: intl.formatMessage({ id: 'Address' }),
      selector: 'address',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Users' }),
      selector: 'users',
      cell: row => {
        let tempUsersString = ''

        if (row.users && row.users.length) {
          row.users.forEach((user, index) => {
            if (index < 5) {
              tempUsersString += `${index > 0 ? ', ' : ''}${user.fullName}`
            }
          })

          if (row.users.length >= 5) {
            tempUsersString += ',...'
          }
        }

        return tempUsersString
      },
      minWidth: '340px',
      maxWidth: '340px'
    },
    {
      name: intl.formatMessage({ id: 'Project' }),
      selector: 'projects',
      cell: row => {
        const projects = _unionBy(
          row.projects,
          row.partnerProjects,
          row.electricityCustomerProjects,
          row.otherCustomerProjects,
          'id'
        )
        const tempProjectIds = []

        if (projects && projects.length) {
          projects.forEach((project) => {
            if (tempProjectIds.length <= 5) {
              tempProjectIds.push(project.code)
            }
          })

          if (projects.length > 5) {
            tempProjectIds.push('...')
          }
        }

        return tempProjectIds.join(', ')
      },
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'state',
      // eslint-disable-next-line react/display-name
      cell: row => (
        row.state === STATE.ACTIVE
          ?
          <Button.Ripple color='success'>
            <FormattedMessage id='Unlocked'/>
          </Button.Ripple>

          :
          <Button.Ripple color='info'>
            <FormattedMessage id='Locked'/>
          </Button.Ripple>
      ),
      minWidth: '160px',
      maxWidth: '160px',
      sortable: true
    },
    {
      name: '',
      selector: 'action',
      omit: ability.cannot('manage', USER_ABILITY.MANAGE_CUSTOMER),
      minWidth: '200px',
      maxWidth: '200px',
      // eslint-disable-next-line react/display-name
      cell: row => {
        return (
          <div className='d-flex'>
            <Badge onClick={() => editCustomer(row)} id={`editBtn_${row.id}`}>
              <IconEdit/>
            </Badge>
            <UncontrolledTooltip placement='auto' target={`editBtn_${row.id}`}>
              <FormattedMessage id='Edit customer'/>
            </UncontrolledTooltip>
            <Badge
              onClick={() => handleClick(row)}
              id={`inactiveBtn_${row.id}`}
            >
              {row.state === STATE.ACTIVE ? <IconUnlock/> : <IconLock/>}
            </Badge>
            <UncontrolledTooltip placement='auto' target={`inactiveBtn_${row.id}`}>
              <FormattedMessage id={row.state === STATE.ACTIVE ? 'Inactivate customer' : 'Activate customer'}/>
            </UncontrolledTooltip>
            {
              ability.can('manage', USER_ABILITY.CAN_DELETE) &&
              <>
                <Badge
                  onClick={() => handleConfirmDelete({ customer: row })}
                  id={`deleteBtn_${row.id}`}
                >
                  <IconDelete/>
                </Badge>
                <UncontrolledTooltip placement='auto' target={`deleteBtn_${row.id}`}>
                  <FormattedMessage id='Delete'/>
                </UncontrolledTooltip>
              </>
            }
          </div>
        )
      }
    }
  ]

  return (
    <Card className='p-2 mb-0'>
      <Row className='mb-1'>
        <Col lg='4' md='12' className='my-lg-0 mb-1'>
          <InputGroup className='input-group-merge'>
            <Input
              className=''
              type='search'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Customer name' })}, ${intl.formatMessage({ id: 'Email' })}, ${intl.formatMessage(
                { id: 'Phone' })}, ${intl.formatMessage({ id: 'Address' })}`}
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>
                <IconSearch/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <UncontrolledTooltip placement='top' target={`search-input`}>
            {`${intl.formatMessage({ id: 'Customer name' })}, ${intl.formatMessage({ id: 'Email' })}, ${intl.formatMessage(
              { id: 'Phone' })}, ${intl.formatMessage({ id: 'Address' })}`}
          </UncontrolledTooltip>
        </Col>
        <Col lg={2} md={2}>
          <CreatableSelect
            name='user'
            isClearable
            options={userOptions}
            className='line-select'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Select user'/>}
            onChange={onChangeSelect}
          />
        </Col>
        <Col lg={2} md={2} className='my-md-0 my-1'>
          <CreatableSelect
            name='project'
            isClearable
            options={projectOptions}
            className='line-select'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Select project'/>}
            onChange={onChangeSelect}
          />
        </Col>
        <Col
          lg={4}
          md={4}
          className='d-flex justify-content-end align-items-center'
        >
          {
            ability.can('manage', USER_ABILITY.MANAGE_CUSTOMER) &&
            <Button.Ripple
              color='primary'
              className='add-project'
              onClick={addCustomer}
            >
              <FormattedMessage id='Add customer'/>
            </Button.Ripple>
          }
        </Col>
      </Row>
      <DataTable
        noHeader
        pagination
        paginationServer
        className={classnames(
          'react-dataTable react-dataTable--customers hover',
          { 'overflow-hidden': store?.data?.length <= 0 }
        )}
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
      <ConfirmPasswordModal
        title={intl.formatMessage(
          { id: 'Confirm delete title' },
          { name: currentCustomer?.fullName }
        )}
        isOpen={isOpenConfirmPassword}
        setIsOpen={setIsOpenConfirmPassword}
        handleConfirm={handleConfirmPasswordForDelete}
      />
    </Card>
  )
}

CustomerTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addCustomer: PropTypes.func.isRequired,
  editCustomer: PropTypes.func.isRequired,
  viewCustomer: PropTypes.func.isRequired
}

export default injectIntl(CustomerTable)
