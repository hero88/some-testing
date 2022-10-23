import React, {
  useEffect,
  useState
} from 'react'

// ** Third party components
import {
  Card,
  Badge,
  Col,
  Input,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
// import moment from 'moment'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import {
  useDispatch,
  useSelector
} from 'react-redux'

import {
  API_DELETE_APPROVE_DELETE_PROJECT,
  API_PUT_APPROVE_PENDING_APPROVE_PROJECT,
  API_PUT_PROJECT
} from '@constants/api'
import axios from 'axios'
import { showToast } from '@utils'
import {
  DISPLAY_DATE_TIME_FORMAT,
  ROWS_PER_PAGE_DEFAULT,
  ROWS_PER_PAGE_OPTIONS,
  STATE
} from '@constants/common'
import moment from 'moment'
import { getProjectRequests } from '@src/views/settings/projects/store/actions'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import InputGroupText from 'reactstrap/es/InputGroupText'
import InputGroup from 'reactstrap/es/InputGroup'
import { ReactComponent as IconSearch } from '@src/assets/images/svg/table/ic-search.svg'
import { ReactComponent as IconUnlock } from '@src/assets/images/svg/table/ic-unlock.svg'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import CP from '@src/views/common/pagination'

const MySweetAlert = withReactContent(SweetAlert)

const RequestPage = ({ intl }) => {
  // ** Store Vars
  const {
    layout: { skin },
    project: { pendingProject }
  } = useSelector(state => state)
  const dispatch = useDispatch()

  // ** States
  const [currentPage, setCurrentPage] = useState(pendingProject?.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(pendingProject?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [searchValue, setSearchValue] = useState(pendingProject?.q || ''),
    [orderBy, setOrderBy] = useState('createDate'),
    [sortDirection, setSortDirection] = useState('asc')

  // Fetch project API
  const fetchRequests = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      // rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      getAll: 1,
      ...queryParam
    }

    try {
      // ** Set data to store
      await Promise.all(
        [dispatch(getProjectRequests({ ...initParam }))]
      )
    } catch (err) {
      showToast(
        'error',
        `${err.response
          ? err.response.data.message
          : err.message}`
      )
    }
  }

  // ** Approve project:
  const approveProject = async (data) => {
    await axios.put(
      API_PUT_APPROVE_PENDING_APPROVE_PROJECT,
      { id: data.id }
    )
      .catch(err => {
        showToast(
          'error',
          `${err.response
            ? err.response.data.message
            : err.message}`
        )
      })
  }

  // ** Reject project:
  const rejectProject = async (data) => {
    await axios.delete(
      API_DELETE_APPROVE_DELETE_PROJECT, {
        data: {
          id: data.id
        }
      }
    )
      .catch(err => {
        showToast(
          'error',
          `${err.response
            ? err.response.data.message
            : err.message}`
        )
      })
  }

  // ** Reject project:
  const confirmDeleteProject = async (data) => {
    await axios.put(
      API_PUT_PROJECT, {
        id: data.id,
        state: STATE.TRASH
      }
    )
      .catch(err => {
        showToast(
          'error',
          `${err.response
            ? err.response.data.message
            : err.message}`
        )
      })
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchRequests()])
  }, [dispatch])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      fetchRequests({ q: value })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchRequests()
    }
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchRequests({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(pendingProject?.total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchRequests({
      page: maxPage < currentPage
        ? maxPage
        : currentPage,
      rowsPerPage: perPage
    })
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchRequests({ order: `${column.selector} ${direction}` })
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(pendingProject?.total / rowsPerPage)

    return (
      <CP
        totalRows={pendingProject?.total || 1}
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0
          ? currentPage - 1
          : 0}
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

  const handleVerify = async (row) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Verify request title' }),
      html: intl.formatMessage({ id: 'Verify request message' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Accept request Yes button' }),
      cancelButtonText: intl.formatMessage({ id: 'Accept request Cancel button' }),
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
        if (row?.state === STATE.PENDING_NEW) {
          await approveProject(row)
        } else if (row?.state === STATE.PENDING_DELETE) {
          await confirmDeleteProject(row)
        }

        await fetchRequests()
        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Verify request successfully title' }),
          text: intl.formatMessage({ id: 'Verify request successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Verify request fail title' }),
          text: intl.formatMessage({ id: 'Verify request fail message' }),
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

  const handleReject = (row) => {
    return MySweetAlert.fire({
      title: row?.state === STATE.PENDING_NEW
        ? intl.formatMessage({ id: 'Reject request title' })
        : intl.formatMessage({ id: 'Reject delete request title' }),
      html: row?.state === STATE.PENDING_NEW
        ? intl.formatMessage({ id: 'Reject request message' })
        : intl.formatMessage({ id: 'Reject delete request message' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Accept request Yes button' }),
      cancelButtonText: intl.formatMessage({ id: 'Accept request Cancel button' }),
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
        if (row?.state === STATE.PENDING_NEW) {
          await rejectProject(row)
        } else if (row?.state === STATE.PENDING_DELETE) {
          await approveProject(row)
        }
        await fetchRequests()
        MySweetAlert.fire({
          icon: 'success',
          title: row?.state === STATE.PENDING_NEW
            ? intl.formatMessage({ id: 'Reject request successfully title' })
            : intl.formatMessage({ id: 'Reject delete request successfully title' }),
          text: row?.state === STATE.PENDING_NEW
            ? intl.formatMessage({ id: 'Reject request successfully message' })
            : intl.formatMessage({ id: 'Reject delete request successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Reject request fail title' }),
          text: intl.formatMessage({ id: 'Reject request fail message' }),
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

  const renderInfo = (row) => Object.keys(row).map((prop, index) => {
    if (prop !== 'id') {
      return (
        <Row
          key={index}
          className='mt-1'
        >
          <Col
            className='text-left'
            md={3}
          >{intl.formatMessage({ id: prop })}</Col>
          <Col
            className='text-left'
            md={9}
          >{
            prop === 'state'
              ? row[prop] === STATE.PENDING_NEW
                ? <span className='text-success'>{intl.formatMessage({ id: STATE.PENDING_NEW })}</span>
                : <span className='text-danger'>{intl.formatMessage({ id: STATE.PENDING_DELETE })}</span>
              : row[prop]
          }</Col>
        </Row>
      )
    }

    return null
  })

  const handleAccept = (row) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Accept request title' }),
      html: (<>{renderInfo(row)}</>),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Accept request Yes button' }),
      cancelButtonText: intl.formatMessage({ id: 'Accept request Cancel button' }),
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
        await handleVerify(row)
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        await handleReject(row)
      }
    })
  }

  const serverSideColumns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      minWidth: '60px',
      maxWidth: '60px'
    },
    {
      name: intl.formatMessage({ id: 'Content' }),
      // eslint-disable-next-line react/display-name
      cell: row => <>
        {
          row?.state === STATE.PENDING_NEW
            ? <div>
              <FormattedMessage id='Request'/>: &nbsp;
              <span className='text-success'><FormattedMessage id='Add'/></span>&nbsp;
              <span className='text-primary'>{row?.name}</span>
            </div>
            : <div>
              <FormattedMessage id='Request'/>: &nbsp;
              <span className='text-danger'><FormattedMessage id='Delete'/></span>&nbsp;
              <span className='text-primary'>{row?.name}</span>
            </div>
        }
      </>,
      minWidth: '400px'
    },
    {
      name: intl.formatMessage({ id: 'From' }),
      cell: row => row?.author?.fullName,
      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Date' }),
      cell: row => moment(Number(row?.createDate)).format(DISPLAY_DATE_TIME_FORMAT),
      minWidth: '200px'
    },
    {
      name: '',
      // eslint-disable-next-line react/display-name
      cell: row => {
        return (
          <div className='d-flex'>
            <Badge
              onClick={() => handleAccept({
                id: row?.id,
                projectName: row?.name,
                from: row?.author?.fullName,
                date: moment(Number(row?.createDate)).format(DISPLAY_DATE_TIME_FORMAT),
                state: row?.state
              })}
              id={`editBtn_${row.id}`}
            >
              <IconUnlock/>
            </Badge>
            <Badge
              onClick={() => handleReject(row)}
              id={`inactiveBtn_${row.id}`}
            >
              <IconDelete/>
            </Badge>
            <UncontrolledTooltip
              placement='auto'
              target={`editBtn_${row.id}`}
            >
              <FormattedMessage id={'Confirm request'}/>
            </UncontrolledTooltip>
            <UncontrolledTooltip
              placement='auto'
              target={`inactiveBtn_${row.id}`}
            >
              <FormattedMessage id={'Deny request'}/>
            </UncontrolledTooltip>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <Card className='p-2'>
        <Row className='mb-1'>
          <Col md='4'>
            <InputGroup className='input-group-merge'>
              <Input
                className=''
                type='search'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={handleChangeSearch}
                onKeyPress={handleFilterKeyPress}
                placeholder={`${intl.formatMessage({ id: 'Project name' })}`}
              />
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <InputGroupAddon addonType='append'>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <InputGroupText>
                  {/* eslint-disable-next-line react/jsx-no-undef */}
                  <IconSearch/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <UncontrolledTooltip
              placement='top'
              target={`search-input`}
            >
              {`${intl.formatMessage({ id: 'Project name' })}`}
            </UncontrolledTooltip>
          </Col>

        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className={classnames(
            'react-dataTable react-dataTable--projects',
            { 'overflow-hidden': pendingProject?.data?.length <= 0 }
          )}
          fixedHeader
          fixedHeaderScrollHeight='calc(100vh - 340px)'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10}/>}
          paginationComponent={CustomPagination}
          data={pendingProject?.data}
          persistTableHead
          noDataComponent={''}
          onSort={customSort}
          sortServer
          defaultSortAsc={sortDirection === 'asc'}
          defaultSortField={orderBy}
        />
      </Card>
    </>
  )
}

RequestPage.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(RequestPage)
