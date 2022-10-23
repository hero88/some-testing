// ** React Imports
import React, { useState, useEffect, useContext } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { reActivateUser, inactivateUser, setSelectedUser, getUsers, deleteUser } from './store/actions'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Button, Badge, UncontrolledTooltip } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconPassword } from '@src/assets/images/svg/table/ic-password.svg'
import { ReactComponent as IconLock } from '@src/assets/images/svg/table/ic-lock.svg'
import { ReactComponent as IconUnlock } from '@src/assets/images/svg/table/ic-unlock.svg'

// ** Custom components
import { showToast } from '@utils'
import Avatar from '@components/avatar'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY, USER_ROLE } from '@constants/user'
import { ROWS_PER_PAGE_DEFAULT, ROWS_PER_PAGE_OPTIONS, STATE } from '@constants/common'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroup from 'reactstrap/es/InputGroup'
import CP from '@src/views/common/pagination'
import ConfirmPasswordModal from '@src/views/common/modal/ConfirmPasswordModal'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'

const MySweetAlert = withReactContent(SweetAlert)

const UserTable = ({ intl, addUser, editUser, changePassword }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch()
  const {
    user: store,
    customer: { allData: customerData },
    project: { allData: projectData },
    auth: { userData },
    layout: { skin }
  } = useSelector(state => state)

  // ** States
  const [currentPage, setCurrentPage] = useState(store?.params?.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [searchValue, setSearchValue] = useState(store?.params?.q || ''),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length
        ? store?.params?.order.split(' ')[0]
        : 'username'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length
        ? store?.params?.order.split(' ')[1]
        : 'asc'
    ),
    [customerOptions, setCustomerOptions] = useState([]),
    [projectOptions, setProjectOptions] = useState([]),
    [customerFilter, setCustomerFilter] = useState(undefined),
    [projectFilter, setProjectFilter] = useState(undefined),
    [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false),
    [currentUser, setCurrentUser] = useState(null)

  // Set customer options
  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setCustomerOptions(customerData.map((customer) => (
        {
          label: customer?.fullName,
          value: customer?.id
        }
      )))
    }
  }, [customerData])

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

  // Fetch user API
  const fetchUsers = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      fk: '["customers", "projects", "group"]',
      customerIds: customerFilter,
      projectIds: projectFilter,
      state: '*',
      ...queryParam
    }

    await dispatch(getUsers(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchUsers()])
  }, [])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchUsers({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchUsers()
    }
  }

  // ** Filter relationship
  const onChangeSelect = (option, event) => {
    const tempValue = option ? option.value : undefined

    if (event.name === 'customer') setCustomerFilter(tempValue)
    if (event.name === 'project') setProjectFilter(tempValue)

    fetchUsers({
      customerIds: event.name === 'customer' ? tempValue : customerFilter,
      projectIds: event.name === 'project' ? tempValue : projectFilter
    })
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchUsers({ page: page.selected + 1 })
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
    fetchUsers({
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
        displayUnit={intl.formatMessage({ id: 'User' }).toLowerCase()}
      />
    )
  }

  const handleConfirmCancel = (user) => {
    return MySweetAlert.fire({
      title: user.state === STATE.ACTIVE
        ? intl.formatMessage({ id: 'Inactivate user title' })
        : intl.formatMessage({ id: 'Activate user title' }),
      html: user.state === STATE.ACTIVE
        ? intl.formatMessage({ id: 'Inactivate user message' })
        : intl.formatMessage({ id: 'Activate user message' }),
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
        if (user.state === STATE.ACTIVE) {
          await dispatch(inactivateUser(user.id, store.params))
        } else {
          await dispatch(reActivateUser({ id: user.id }, store.params, userData.id))
        }

        MySweetAlert.fire({
          icon: 'success',
          title: user.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate user successfully title' })
            : intl.formatMessage({ id: 'Activate user successfully title' }),
          text: user.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate user successfully message' })
            : intl.formatMessage({ id: 'Activate user successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: user.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate user fail title' })
            : intl.formatMessage({ id: 'Activate user fail title' }),
          text: user.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate user fail message' })
            : intl.formatMessage({ id: 'Activate user fail message' }),
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
  const handleConfirmDelete = ({ user }) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete user title' }),
      html: intl.formatMessage({ id: 'Delete user message' }),
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
        setCurrentUser(user)
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Delete user fail title' }),
          text: intl.formatMessage({ id: 'Delete user fail message' }),
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
    setCurrentUser(null)

    const deleteData = {
      data: {
        id: currentUser?.id,
        password
      },
      params: store?.params,
      successCBFunc: () => {
        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Delete user successfully title' }),
          text: intl.formatMessage({ id: 'Delete user successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      }
    }

    dispatch(deleteUser(deleteData))
  }

  // Handle Click
  const handleClick = async (user) => {
    if (user.id === userData.id) {
      showToast('error', 'Can not inactive yourself!!!')
    } else {
      await handleConfirmCancel(user)
    }
  }

  // Set selected customer to store
  const clickOnRow = (row) => {
    dispatch(setSelectedUser(row))
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchUsers({ order: `${column.selector} ${direction}` })
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
      name: intl.formatMessage({ id: 'Username' }),
      selector: 'username',
      sortable: true,
      minWidth: '240px',
      maxWidth: '240px'
    },
    {
      name: intl.formatMessage({ id: 'Full name' }),
      selector: 'fullName',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Phone' }),
      selector: 'phone',
      sortable: true,
      minWidth: '120px',
      maxWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Role' }),
      selector: 'group.name',
      cell: row => (
        row?.group?.name ? intl.formatMessage({ id: row.group.name }) : ''
      ),
      sortable: true,
      minWidth: '220px',
      maxWidth: '220px'
    },
    {
      name: intl.formatMessage({ id: 'Customer' }),
      selector: 'customer',
      cell: row => {
        let tempCustomersString = ''

        if (row.customers && row.customers.length) {
          row.customers.forEach((customer, index) => {
            if (index < 5) {
              tempCustomersString += `${index > 0 ? ', ' : ''}${customer.fullName}`
            }
          })

          if (row.customers.length >= 5) {
            tempCustomersString += ',...'
          }
        }

        return tempCustomersString
      },
      minWidth: '240px',
      maxWidth: '240px'
    },
    {
      name: intl.formatMessage({ id: 'Project' }),
      selector: 'projects',
      cell: row => {
        let tempProjectsString = ''

        if (row.projects && row.projects.length) {
          row.projects.forEach((project, index) => {
            if (index < 5) {
              tempProjectsString += `${index > 0 ? ', ' : ''}${project.code}`
            }
          })

          if (row.projects.length >= 5) {
            tempProjectsString += ',...'
          }
        }

        return tempProjectsString
      },
      minWidth: '260px',
      maxWidth: '260px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'state',
      // eslint-disable-next-line react/display-name
      cell: row => (
        row.state === STATE.ACTIVE
          ? <Button.Ripple color='success' outline>
            <FormattedMessage id='Unlocked' />
          </Button.Ripple>
          :
          <Button.Ripple color='info' outline>
            <FormattedMessage id='Locked' />
          </Button.Ripple>
      ),
      sortable: true,
      center: true,
      minWidth: '100px'
    },
    {
      name: '',
      center: true,
      minWidth: '200px',
      // eslint-disable-next-line react/display-name
      cell: row => {
        return (
          ability.can('edit', USER_ABILITY.EDIT_ADMIN_PORTAL_ADMIN) ||
          (
            ability.can('edit', USER_ABILITY.EDIT_ANOTHER_USER)
            && row?.group?.type !== USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE
            && row?.group?.type !== USER_ROLE.SUPER_ADMIN.VALUE
          ) ||
          row.id === userData?.user?.id
            ? <div className='d-flex'>

              <Badge onClick={() => editUser(row)} id={`editBtn_${row.id}`}>
                <IconEdit />
              </Badge>
              <UncontrolledTooltip placement='auto' target={`editBtn_${row.id}`}>
                <FormattedMessage id='Edit user' />
              </UncontrolledTooltip>

              <Badge onClick={() => changePassword(row)} id={`changePasswordBtn_${row.id}`}>
                <IconPassword color={skin === 'dark' ? '#D1D4D9' : '#000000DE'} />
              </Badge>
              <UncontrolledTooltip placement='auto' target={`changePasswordBtn_${row.id}`}>
                <FormattedMessage id='Change password' />
              </UncontrolledTooltip>
              {
                row.id !== userData?.user?.id &&
                <>
                  <Badge onClick={() => handleClick(row)} id={`inactiveBtn_${row.id}`}>
                    {row.state === STATE.ACTIVE ? <IconUnlock /> : <IconLock />}
                  </Badge>
                  <UncontrolledTooltip placement='auto' target={`inactiveBtn_${row.id}`}>
                    <FormattedMessage id={row.state === STATE.ACTIVE ? 'Inactivate user' : 'Activate user'} />
                  </UncontrolledTooltip>
                </>
              }
              {
                ability.can('manage', USER_ABILITY.CAN_DELETE) &&
                row.id !== userData?.user?.id &&
                <>
                  <Badge
                    onClick={() => handleConfirmDelete({ user: row })}
                    id={`deleteBtn_${row.id}`}
                  >
                    <IconDelete />
                  </Badge>
                  <UncontrolledTooltip placement='auto' target={`deleteBtn_${row.id}`}>
                    <FormattedMessage id='Delete' />
                  </UncontrolledTooltip>
                </>
              }
            </div>
            : null
        )
      }
    }
  ]

  return (
    <Card className='p-2 mb-0'>
      <Row className='mb-1'>
        <Col lg='4' md={12} className='my-lg-0 mb-1'>
          <InputGroup className='input-group-merge'>
            <Input
              className=''
              type='search'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}, ${intl.formatMessage(
                { id: 'Phone' })}`}
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>
                <IconSearch />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <UncontrolledTooltip placement='top' target={`search-input`}>
            {`${intl.formatMessage({ id: 'Username' })}, ${intl.formatMessage({ id: 'Name' })}, ${intl.formatMessage({ id: 'Phone' })}`}
          </UncontrolledTooltip>
        </Col>
        <Col lg={2} md={4} className='my-md-0 mb-1'>
          <CreatableSelect
            name='project'
            isClearable
            options={projectOptions}
            className='line-select'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Select project' />}
            onChange={onChangeSelect}
          />
        </Col>
        <Col lg={2} md={4} className='my-md-0 mb-1'>
          <CreatableSelect
            name='customer'
            isClearable
            className='line-select'
            options={customerOptions}
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Select customer' />}
            onChange={onChangeSelect}
          />
        </Col>
        <Col
          lg={4}
          md={4}
          className='d-flex justify-content-end align-items-center'
        >
          {
            ability.can('manage', USER_ABILITY.MANAGE_USER) &&
            <Button.Ripple
              color='primary'
              className='ml-1'
              onClick={addUser}
            >
              <FormattedMessage id='Add user' />
            </Button.Ripple>
          }
        </Col>
      </Row>
      <DataTable
        noHeader
        pagination
        paginationServer
        className={classnames(
          'react-dataTable react-dataTable--users hover',
          { 'overflow-hidden': store?.data?.length <= 0 }
        )}
        fixedHeader
        fixedHeaderScrollHeight='calc(100vh - 340px)'
        columns={serverSideColumns}
        sortIcon={<ChevronDown size={10} />}
        paginationComponent={CustomPagination}
        data={store.data}
        onRowClicked={clickOnRow}
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
          { name: currentUser?.fullName }
        )}
        isOpen={isOpenConfirmPassword}
        setIsOpen={setIsOpenConfirmPassword}
        handleConfirm={handleConfirmPasswordForDelete}
      />
    </Card>
  )
}

UserTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addUser: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired
}

export default injectIntl(UserTable)
