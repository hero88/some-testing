// ** React Imports
import React, { useState, useEffect, useContext } from 'react'

// ** Store & Actions
import { reActivateProject, inactivateProject, deleteProject, getProjects } from './store/actions'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Button, UncontrolledTooltip, CardLink, Badge } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import CreatableSelect from 'react-select/creatable'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

// ** Custom components
import { setSelectedProject } from '@src/views/monitoring/projects/store/actions'
import { getProvinceOptions } from '@constants/province'
import { ROUTER_URL } from '@constants/router'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { ROWS_PER_PAGE_DEFAULT, ROWS_PER_PAGE_OPTIONS, STATE } from '@constants/common'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import { ReactComponent as IconLock } from '@src/assets/images/svg/table/ic-lock.svg'
import { ReactComponent as IconUnlock } from '@src/assets/images/svg/table/ic-unlock.svg'

import InputGroup from 'reactstrap/es/InputGroup'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import CP from '@src/views/common/pagination'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import ConfirmPasswordModal from '@src/views/common/modal/ConfirmPasswordModal'

const MySweetAlert = withReactContent(SweetAlert)

const ProjectTable = ({ intl, addProject, editProject }) => {
  const dispatch = useDispatch(),
    history = useHistory()

  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const {
    layout: { skin },
    project: store,
    user: { allData: userData },
    customer: { allData: customerData }
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
    ),
    [userOptions, setUserOptions] = useState([]),
    [customerOptions, setCustomerOptions] = useState([]),
    [userFilter, setUserFilter] = useState(undefined),
    [customerFilter, setCustomerFilter] = useState(undefined),
    [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false),
    [currentProject, setCurrentProject] = useState(null)

  // Set user options
  useEffect(() => {
    if (userData && userData.length > 0) {
      setUserOptions(
        userData.map((user) => (
          {
            label: user?.fullName,
            value: user?.id
          }
        ))
      )
    }
  }, [userData])

  // Set customer options
  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setCustomerOptions(
        customerData.map((customer) => (
          {
            label: customer?.fullName,
            value: customer?.id
          }
        ))
      )
    }
  }, [customerData])

  // Fetch project API
  const fetchProjects = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: 1,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      fk: '*',
      userIds: userFilter,
      partnerId: customerFilter,
      state: '*',
      ...queryParam
    }

    // ** Set data to store
    await dispatch(getProjects(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchProjects()])
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
    if (event.name === 'customer') setCustomerFilter(tempValue)

    fetchProjects({
      userIds: event.name === 'user' ? tempValue : userFilter,
      partnerId: event.name === 'customer' ? tempValue : customerFilter
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

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchProjects({
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
        displayUnit={intl.formatMessage({ id: 'Project' }).toLowerCase()}
      />
    )
  }

  const handleConfirmCancel = (project) => {
    return MySweetAlert.fire({
      title:
        project.state === STATE.ACTIVE
          ? intl.formatMessage({ id: 'Inactivate project title' })
          : intl.formatMessage({ id: 'Activate project title' }),
      html:
        project.state === STATE.ACTIVE
          ? intl.formatMessage({ id: 'Inactivate project message' })
          : intl.formatMessage({ id: 'Activate project message' }),
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
        if (project.state === STATE.ACTIVE) {
          ability.can('manage', USER_ABILITY.NO_NEED_CONFIRM)
            ? await dispatch(inactivateProject(project?.id, store.params))
            : await dispatch(deleteProject({
              data: { id: project?.id },
              params: store.params
            }))
        } else {
          await dispatch(reActivateProject({ id: project?.id, activated: true }, store.params))
        }

        MySweetAlert.fire({
          icon: 'success',
          title:
            project.state === STATE.ACTIVE
              ? ability.can('manage', USER_ABILITY.NO_NEED_CONFIRM)
                ? intl.formatMessage({ id: 'Inactivate project successfully title' })
                : intl.formatMessage({ id: 'Inactivate project confirm successfully title' })
              : ability.can('manage', USER_ABILITY.NO_NEED_CONFIRM)
                ? intl.formatMessage({ id: 'Activate project successfully title' })
                : intl.formatMessage({ id: 'Activate project confirm successfully title' }),
          text:
            project.state === STATE.ACTIVE
              ? ability.can('manage', USER_ABILITY.NO_NEED_CONFIRM)
                ? intl.formatMessage({ id: 'Inactivate project successfully message' })
                : intl.formatMessage({ id: 'Inactivate project confirm successfully message' })
              : ability.can('manage', USER_ABILITY.NO_NEED_CONFIRM)
                ? intl.formatMessage({ id: 'Activate project successfully message' })
                : intl.formatMessage({ id: 'Activate project confirm successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title:
            project.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate project fail title' })
              : intl.formatMessage({ id: 'Activate project fail title' }),
          text:
            project.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate project fail message' })
              : intl.formatMessage({ id: 'Activate project fail message' }),
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
  const handleConfirmDelete = ({ project }) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete project title' }),
      html: intl.formatMessage({ id: 'Delete project message' }),
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
        setCurrentProject(project)
        setIsOpenConfirmPassword(true)
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Delete project fail title' }),
          text: intl.formatMessage({ id: 'Delete project fail message' }),
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
    setCurrentProject(null)

    const deleteData = {
      data: {
        id: currentProject?.id,
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

    dispatch(deleteProject(deleteData))
  }

  // Handle Click
  const handleClick = async (projectId) => {
    await handleConfirmCancel(projectId)
  }

  const handleClickProjectRow = (row) => {
    dispatch(setSelectedProject(row))
    history.push({
      pathname: ROUTER_URL.PROJECT_OVERVIEW,
      search: `?projectId=${row?.id}`
    })
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchProjects({ order: `${column.selector} ${direction}` })
  }

  // ** Column header
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'Project code' }),
      selector: 'code',
      cell: (row) => (
        typeof row.code === 'string' ? row.code.substring(0, 4) : ''
      ),
      sortable: true,
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'Project name' }),
      selector: 'name',
      wrap: true,
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return row?.state === STATE.ACTIVE ? (
          <CardLink className='text-primary' onClick={() => handleClickProjectRow(row)}>
            {row.name}
          </CardLink>
        ) : (
          row.name
        )
      },
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Partner' }),
      selector: 'customer',
      wrap: true,
      cell: (row) => (
        row.customer ? row.partner?.fullName : ''
      ),
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Users' }),
      selector: 'users',
      wrap: true,
      cell: (row) => {
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
      minWidth: '260px',
      maxWidth: '260px'
    },
    {
      name: intl.formatMessage({ id: 'Investor' }),
      selector: 'investorName',
      cell: (row) => row?.investor?.name,
      wrap: true,
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Address' }),
      selector: 'address',
      wrap: true,
      sortable: true,
      minWidth: '360px',
      maxWidth: '360px'
    },
    {
      name: intl.formatMessage({ id: 'Phone' }),
      selector: 'phone',
      wrap: true,
      sortable: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Date of commission' }),
      selector: 'startDate',
      wrap: true,
      cell: (row) => (
        row.startDate ? moment(Number(row.startDate)).format('DD/MM/YYYY') : ''
      ),
      sortable: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'state',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return row.state === STATE.PENDING_NEW ? (
          <Button.Ripple color='warning'>
            <FormattedMessage id='Need confirm adding'/>
          </Button.Ripple>
        ) : row.state === STATE.PENDING_DELETE ? (

          <Button.Ripple color='danger'>
            <FormattedMessage id='Need confirm deleting'/>
          </Button.Ripple>

        ) : row.state === STATE.ACTIVE ? (

          <Button.Ripple color='success'>
            <FormattedMessage id='Unlocked'/>
          </Button.Ripple>

        ) : (

          <Button.Ripple color='info'>
            <FormattedMessage id='Locked'/>
          </Button.Ripple>
        )
      },
      sortable: true,
      minWidth: '100px',
      center: true
    },
    {
      name: '',
      selector: 'action',
      omit: ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT),
      allowOverflow: true,
      minWidth: '120px',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        if (row?.state === STATE.ACTIVE || row?.state === STATE.INACTIVE) {
          return (
            <div className='d-flex'>
              <Badge
                onClick={() => editProject(row)}
                id={`editBtn_${row?.id}`}
              >
                <IconEdit/>
              </Badge>
              <UncontrolledTooltip placement='auto' target={`editBtn_${row?.id}`}>
                <FormattedMessage id='Edit project'/>
              </UncontrolledTooltip>
              <Badge
                onClick={() => handleClick(row)}
                id={`inactiveBtn_${row?.id}`}
              >
                {row.state === STATE.ACTIVE ? <IconUnlock/> : <IconLock/>}
              </Badge>
              <UncontrolledTooltip placement='auto' target={`inactiveBtn_${row?.id}`}>
                <FormattedMessage id={row.state === STATE.ACTIVE ? 'Inactivate project' : 'Activate project'}/>
              </UncontrolledTooltip>
              {
                ability.can('manage', USER_ABILITY.CAN_DELETE) &&
                row.id !== userData?.user?.id &&
                <>
                  <Badge
                    onClick={() => handleConfirmDelete({ project: row })}
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
    }
  ]

  const provinceOptions = getProvinceOptions()

  return (
    <Card className='p-2 mb-0'>
      <Row className='mb-1'>
        <Col lg='4' md='12' className='my-lg-0 mb-1'>
          <InputGroup className='input-group-merge'>
            <Input
              className='dataTable-filter'
              type='search'
              bsSize='sm'
              id='search-input-projects'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Project name' })}, ${intl.formatMessage({
                id: 'Investor'
              })}, ${intl.formatMessage({ id: 'Address' })}, ${intl.formatMessage({ id: 'Phone' })}`}
            />
            <InputGroupAddon addonType='append'>
              <InputGroupText>
                <IconSearch/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <UncontrolledTooltip placement='top' target={`search-input-projects`}>
            {`${intl.formatMessage({ id: 'Project name' })}, ${intl.formatMessage({
              id: 'Investor'
            })}, ${intl.formatMessage({ id: 'Address' })}, ${intl.formatMessage({ id: 'Phone' })}`}
          </UncontrolledTooltip>
        </Col>
        <Col lg={2} md={2}>
          <CreatableSelect
            name='province'
            isClearable
            options={provinceOptions}
            className='d-none line-select'
            classNamePrefix='select'
            onChange={onChangeSelect}
            placeholder={intl.formatMessage({ id: 'Select province' })}
            formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
          />
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
            name='customer'
            isClearable
            options={customerOptions}
            className='line-select'
            classNamePrefix='select'
            placeholder={<FormattedMessage id='Select partner'/>}
            onChange={onChangeSelect}
          />
        </Col>
        <Col
          lg={'4'}
          md={'4'}
          className='d-flex justify-content-end align-items-center'
        >
          {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
            <Button.Ripple color='primary' className='ml-1' onClick={() => addProject({ isAuto: false })}>
              <FormattedMessage id='Add project'/>
            </Button.Ripple>
          )}
        </Col>
      </Row>
      <DataTable
        noHeader
        pagination
        paginationServer
        responsive={true}
        className={classnames(
          'react-dataTable react-dataTable--projects',
          { 'overflow-hidden': store?.data?.length <= 0 }
        )}
        fixedHeader
        fixedHeaderScrollHeight='calc(100vh - 340px)'
        columns={serverSideColumns}
        sortIcon={<ChevronDown size={10}/>}
        paginationComponent={CustomPagination}
        data={store?.data ? store.data : []}
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
          { name: currentProject?.name }
        )}
        isOpen={isOpenConfirmPassword}
        setIsOpen={setIsOpenConfirmPassword}
        handleConfirm={handleConfirmPasswordForDelete}
      />
    </Card>
  )
}

ProjectTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addProject: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired
}

export default injectIntl(ProjectTable)
