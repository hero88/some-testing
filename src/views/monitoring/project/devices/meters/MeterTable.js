// ** React Imports
import React, { useContext, useEffect, useState } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { deleteMeter, getMeters, reActiveMeter, removeMeter } from './store/actions'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Button, UncontrolledTooltip, Row } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

// Constants
import {
  NORMAL_CHARACTER,
  renderDeviceStatus,
  ROUTER_URL,
  ROWS_PER_PAGE_OPTIONS,
  STATE,
  USER_ABILITY
} from '@constants/index'
import { useQuery } from '@hooks/useQuery'
import { AbilityContext } from '@src/utility/context/Can'
import moment from 'moment'
import CP from '@src/views/common/pagination'
import { numberWithCommas } from '@utils'
import { ReactComponent as PlusIcon } from '@src/assets/images/svg/table/ic-plus.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconLock } from '@src/assets/images/svg/table/ic-lock.svg'
import { ReactComponent as IconUnlock } from '@src/assets/images/svg/table/ic-unlock.svg'
import ConfirmPasswordModal from '@src/views/common/modal/ConfirmPasswordModal'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'

const MySweetAlert = withReactContent(SweetAlert)

const MeterTable = ({ intl, editMeter, addMeter }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    query = useQuery(),
    projectId = query.get('projectId'),
    { meter: store, layout: { skin } } = useSelector(state => state)

  // ** States
  const [currentPage, setCurrentPage] = useState(store?.params?.page),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage),
    [searchValue] = useState(store?.params?.q),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length
        ? store?.params?.order.split(' ')[0]
        : 'name'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length
        ? store?.params?.order.split(' ')[1]
        : 'asc'
    ),
    [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false),
    [currentMeter, setCurrentMeter] = useState(null)

  // Fetch meter API
  const fetchMeters = (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      state: '*',
      projectId,
      ...queryParam
    }

    // ** Set data to store
    dispatch(getMeters(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchMeters()])
  }, [])

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchMeters({ page: page.selected + 1 })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(store.total / perPage)

    fetchMeters({
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
        totalRows={store.total || 1}
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
        displayUnit={intl.formatMessage({ id: 'Meter' }).toLowerCase()}
      />
    )
  }

  const handleConfirmCancel = (meter) => {
    return MySweetAlert.fire({
      title: meter.state === STATE.ACTIVE
        ? intl.formatMessage({ id: 'Inactivate meter title' })
        : intl.formatMessage({ id: 'Activate meter title' }),
      html: meter.state === STATE.ACTIVE
        ? intl.formatMessage({ id: 'Inactivate meter message' })
        : intl.formatMessage({ id: 'Activate meter message' }),
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
        if (meter.state === STATE.ACTIVE) {
          await dispatch(removeMeter(meter.id, store.params))
        } else {
          await dispatch(reActiveMeter({ id: meter.id, state: STATE.ACTIVE }, store.params))
        }

        MySweetAlert.fire({
          icon: 'success',
          title: meter.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate meter successfully title' })
            : intl.formatMessage({ id: 'Activate meter successfully title' }),
          text: meter.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate meter successfully message' })
            : intl.formatMessage({ id: 'Activate meter successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: meter.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate meter fail title' })
            : intl.formatMessage({ id: 'Activate meter fail title' }),
          text: meter.state === STATE.ACTIVE
            ? intl.formatMessage({ id: 'Inactivate meter fail message' })
            : intl.formatMessage({ id: 'Activate meter fail message' }),
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
  const handleConfirmDelete = ({ meter }) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete meter title' }),
      html: intl.formatMessage({ id: 'Delete meter message' }),
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
        setCurrentMeter(meter)
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Delete meter fail title' }),
          text: intl.formatMessage({ id: 'Delete meter fail message' }),
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
    setCurrentMeter(null)

    const deleteData = {
      data: {
        id: currentMeter?.id,
        password
      },
      params: store?.params,
      successCBFunc: () => {
        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Delete meter successfully title' }),
          text: intl.formatMessage({ id: 'Delete meter successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      }
    }

    dispatch(deleteMeter(deleteData))
  }

  // Handle Click
  const handleClick = async (meter) => {
    await handleConfirmCancel(meter)
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchMeters({ order: `${column.selector} ${direction}` })
  }

  // ** Column header
  const serverSideColumns = [
    {
      name: '',
      selector: 'status',
      // eslint-disable-next-line react/display-name
      cell: row => renderDeviceStatus(row.status, row.id),
      sortable: true,
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Device name' }),
      selector: 'name',
      // eslint-disable-next-line react/display-name
      cell: row => (
        row.state === STATE.ACTIVE
          ? <Link
            to={{
              pathname: ROUTER_URL.PROJECT_METER_DETAIL,
              search: `projectId=${projectId}&deviceId=${row.id}&typeDevice=${row.typeDevice}`
            }}
          >
            {row.name}
          </Link>
          : row.name
      ),
      sortable: true,
      minWidth: '140px',
      maxWidth: '140px'
    },
    {
      name: intl.formatMessage({ id: 'Serial number' }),
      selector: 'serialNumber',
      sortable: true,
      minWidth: '90px'
    },
    {
      name: intl.formatMessage({ id: 'Measurement point code' }),
      selector: 'measuringPointCode',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Installed date' }),
      selector: 'dateOfInstallation',
      cell: row => (
        row.dateOfInstallation ? moment(Number(row.dateOfInstallation)).format('DD/MM/YYYY') : ''
      ),
      sortable: true,
      center: true,
      minWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Inspection valid until' }),
      selector: 'verificationTime',
      cell: row => (
        row.verificationTime ? moment(Number(row.verificationTime)).format('DD/MM/YYYY') : ''
      ),
      sortable: true,
      center: true,
      minWidth: '120px'
    },
    {
      name: `${intl.formatMessage({ id: 'Realtime power' })} (kW)`,
      selector: 'realActivePower3SubphaseTotal',
      cell: row => numberWithCommas(row.todayActivePower / 1000),
      sortable: true,
      center: true,
      minWidth: '140px'
    },
    {
      name: `${intl.formatMessage({ id: 'Daily yield' })} (kWh)`,
      selector: 'dailyYield',
      // eslint-disable-next-line react/display-name
      cell: row => numberWithCommas(row.dailyYield / 1000),
      sortable: true,
      center: true,
      minWidth: '120px'
    },
    {
      name: `${intl.formatMessage({ id: 'Period receive yield' })} (kWh)`,
      selector: 'periodReceiveYield',
      sortable: true,
      center: true,
      minWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'activated',
      // eslint-disable-next-line react/display-name
      cell: row => (
        row.state === STATE.ACTIVE
          ? <div className='text-success'>
            <FormattedMessage id='Active'/>
          </div>
          : <div className='text-dark'>
            <FormattedMessage id='Inactive'/>
          </div>
      ),
      sortable: true,
      center: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: 'action',
      omit: ability.cannot('manage', USER_ABILITY.MANAGE_DEVICE),
      center: true,
      minWidth: '150px',
      // eslint-disable-next-line react/display-name
      cell: row => {
        return (
          <div className='d-flex'>
            <Button.Ripple
              className='btn-icon'
              color='flat'
              onClick={() => editMeter(row)} id={`editBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
            >
              <IconEdit/>
            </Button.Ripple>
            <UncontrolledTooltip placement='auto' target={`editBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
              <FormattedMessage id='Edit meter'/>
            </UncontrolledTooltip>
            <Button.Ripple
              className='btn-icon'
              color='flat'
              onClick={() => handleClick(row)}
              id={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
            >
              {row.state === STATE.ACTIVE ? <IconUnlock/> : <IconLock/>}
            </Button.Ripple>
            <UncontrolledTooltip placement='auto' target={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
              <FormattedMessage id={row.state === STATE.ACTIVE ? 'Inactivate meter' : 'Activate meter'}/>
            </UncontrolledTooltip>
            {
              ability.can('manage', USER_ABILITY.CAN_DELETE) &&
              <>
                <Button.Ripple
                  className='btn-icon'
                  color='flat'
                  onClick={() => handleConfirmDelete({ meter: row })}
                  id={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
                >
                  <IconDelete/>
                </Button.Ripple>
                <UncontrolledTooltip placement='auto' target={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
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
    <Card>
      {
        ability.can('manage', USER_ABILITY.MANAGE_DEVICE) &&
        <Row className='d-flex justify-content-end p-1'>
          <Button.Ripple
            color='primary'
            className='add-button'
            onClick={addMeter}
          >
            <PlusIcon/>
          </Button.Ripple>
        </Row>
      }

      <DataTable
        noHeader
        pagination
        paginationServer
        striped
        className={classnames(
          'react-dataTable react-dataTable--meters hover',
          { 'overflow-hidden': store?.data?.length <= 0 }
        )}
        fixedHeader
        fixedHeaderScrollHeight='calc(100vh - 400px)'
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
          { name: currentMeter?.name }
        )}
        isOpen={isOpenConfirmPassword}
        setIsOpen={setIsOpenConfirmPassword}
        handleConfirm={handleConfirmPasswordForDelete}
      />
    </Card>
  )
}

MeterTable.propTypes = {
  intl: PropTypes.object.isRequired,
  editMeter: PropTypes.func.isRequired,
  addMeter: PropTypes.func.isRequired
}

export default injectIntl(MeterTable)
