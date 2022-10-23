// ** React Imports
import React, { useContext, useEffect, useState } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteInverter,
  getInverters,
  getInverterTypes,
  reActiveInverter,
  removeInverter,
  setSelectedInverter
} from './store/actions'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Button, UncontrolledTooltip, Row } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link, useHistory } from 'react-router-dom'

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
import CP from '@src/views/common/pagination'
import { numberWithCommas } from '@utils'
import { ReactComponent as EditIcon } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as SolarPanelIcon } from '@src/assets/images/svg/table/ic-solar-panel.svg'
import { ReactComponent as LockIcon } from '@src/assets/images/svg/table/ic-lock.svg'
import { ReactComponent as UnlockIcon } from '@src/assets/images/svg/table/ic-unlock.svg'
import { ReactComponent as PlusIcon } from '@src/assets/images/svg/table/ic-plus.svg'
import ConfirmPasswordModal from '@src/views/common/modal/ConfirmPasswordModal'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'

const MySweetAlert = withReactContent(SweetAlert)

const InverterTable = ({
  intl,
  addInverter,
  editInverter,
  setIsShowCreatePanelByFile
}) => {
  // History
  const history = useHistory()

  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    query = useQuery(),
    projectId = query.get('projectId'),
    {
      inverter: store,
      layout: { skin }
    } = useSelector((state) => state)

  // ** States
  const [currentPage, setCurrentPage] = useState(store?.params?.page),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage),
    [searchValue] = useState(store?.params?.q),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[0] : 'name'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[1] : 'asc'
    ),
    [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false),
    [currentInverter, setCurrentInverter] = useState(null)

  // Fetch inverter API
  const fetchInverters = (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      state: '*',
      fk: '*',
      projectId,
      ...queryParam
    }

    // ** Set data to store
    dispatch(getInverters(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([
      fetchInverters(),
      dispatch(getInverterTypes({ rowsPerPage: -1, state: STATE.ACTIVE }))
    ])
  }, [])

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    fetchInverters({ page: page.selected + 1 })
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
    fetchInverters({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(store?.total / rowsPerPage)

    return (
      <CP
        totalRows={store?.total || 1}
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
        containerClassName={'pagination react-paginate px-1'}
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
        displayUnit={intl.formatMessage({ id: 'Inverter' }).toLowerCase()}
      />
    )
  }

  const handleConfirmCancel = (inverter) => {
    return MySweetAlert.fire({
      title:
        inverter.state === STATE.ACTIVE
          ? intl.formatMessage({ id: 'Inactivate inverter title' })
          : intl.formatMessage({ id: 'Activate inverter title' }),
      html:
        inverter.state === STATE.ACTIVE
          ? intl.formatMessage({ id: 'Inactivate inverter message' })
          : intl.formatMessage({ id: 'Activate inverter message' }),
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
        if (inverter.state === STATE.ACTIVE) {
          await dispatch(removeInverter(inverter.id, store.params))
        } else {
          await dispatch(reActiveInverter({ id: inverter.id, state: STATE.ACTIVE }, store.params))
        }

        MySweetAlert.fire({
          icon: 'success',
          title:
            inverter.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate inverter successfully title' })
              : intl.formatMessage({ id: 'Activate inverter successfully title' }),
          text:
            inverter.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate inverter successfully message' })
              : intl.formatMessage({ id: 'Activate inverter successfully message' }),
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
            inverter.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate inverter fail title' })
              : intl.formatMessage({ id: 'Activate inverter fail title' }),
          text:
            inverter.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate inverter fail message' })
              : intl.formatMessage({ id: 'Activate inverter fail message' }),
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
  const handleConfirmDelete = ({ inverter }) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete inverter title' }),
      html: intl.formatMessage({ id: 'Delete inverter message' }),
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
        setCurrentInverter(inverter)
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: intl.formatMessage({ id: 'Delete inverter fail title' }),
          text: intl.formatMessage({ id: 'Delete inverter fail message' }),
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
    setCurrentInverter(null)

    const deleteData = {
      data: {
        id: currentInverter?.id,
        password
      },
      params: store?.params,
      successCBFunc: () => {
        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Delete inverter successfully title' }),
          text: intl.formatMessage({ id: 'Delete inverter successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      }
    }

    dispatch(deleteInverter(deleteData))
  }

  // Handle Click
  const handleClick = async (projectId) => {
    await handleConfirmCancel(projectId)
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchInverters({ order: `${column.selector} ${direction}` })
  }

  // ** Column header
  const serverSideColumns = [
    {
      name: '',
      selector: 'status',
      // eslint-disable-next-line react/display-name
      cell: (row) => renderDeviceStatus(row.status, row.id),
      sortable: true,
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Device name' }),
      selector: 'name',
      // eslint-disable-next-line react/display-name
      cell: (row) => (
        row.state === STATE.ACTIVE
          ? <Link
            to={{
              pathname: ROUTER_URL.PROJECT_INVERTER_DETAIL,
              search: `projectId=${projectId}&deviceId=${row.id}&typeModel=${row.typeModel}`
            }}
          >
            {row.name}
          </Link>
          : row.name
      ),
      sortable: true,
      minWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Serial number' }),
      selector: 'serialNumber',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: `${intl.formatMessage({ id: 'Rated power' })} (kW)`,
      selector: 'nominalActivePower',
      cell: (row) => (
        row?.inverterType?.power ? numberWithCommas(row?.inverterType?.power / 1000) : '-'
      ),
      sortable: true,
      center: true,
      minWidth: '130px',
      maxWidth: '130px'
    },
    {
      name: `${intl.formatMessage({ id: 'Realtime power' })} (kW)`,
      selector: 'todayActivePower',
      cell: (row) => numberWithCommas(row?.todayActivePower / 1000),
      sortable: true,
      center: true,
      minWidth: '130px',
      maxWidth: '130px'
    },
    {
      name: `${intl.formatMessage({ id: 'Daily yield' })} (kWh)`,
      selector: 'dailyYield',
      cell: row => numberWithCommas(row?.dailyYield / 1000),
      sortable: true,
      center: true,
      minWidth: '130px',
      maxWidth: '130px'
    },
    {
      name: `${intl.formatMessage({ id: 'Yesterday yield' })} (kWh)`,
      selector: 'yesterdayYield',
      cell: row => numberWithCommas(row?.yesterdayYield / 1000),
      sortable: true,
      center: true,
      minWidth: '120px',
      maxWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'activated',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return row.state === STATE.ACTIVE
          ? (
            <div className='text-success'>
              <FormattedMessage id='Active'/>
            </div>
          )
          : (
            <div className='text-dark'>
              <FormattedMessage id='Inactive'/>
            </div>
          )
      },
      sortable: true,
      center: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: 'action',
      center: true,
      minWidth: '200px',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          <div className='d-flex'>
            {
              ability.can('manage', USER_ABILITY.MANAGE_DEVICE) &&
              <>
                <Button.Ripple
                  className='btn-icon'
                  color='flat'
                  onClick={() => {
                    dispatch(setSelectedInverter(row))
                    editInverter(row)
                  }}
                  id={`editBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
                >
                  <EditIcon/>
                </Button.Ripple>
                <UncontrolledTooltip placement='auto' target={`editBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
                  <FormattedMessage id='Edit inverter'/>
                </UncontrolledTooltip>
              </>
            }

            <Button.Ripple
              id='btnShowSolarPanel'
              className='btn-icon text-success'
              color='flat'
              onClick={() => {
                dispatch(setSelectedInverter(row))
                history.push({
                  pathname: ROUTER_URL.PROJECT_PANEL,
                  search: `projectId=${projectId}&inverterId=${row.id}`
                })
              }}
            >
              <SolarPanelIcon/>
            </Button.Ripple>
            <UncontrolledTooltip placement='auto' target={'btnShowSolarPanel'}>
              <FormattedMessage id={'Show solar panel list'}/>
            </UncontrolledTooltip>

            {
              ability.can('manage', USER_ABILITY.MANAGE_DEVICE) &&
              <>
                <Button.Ripple
                  className='btn-icon'
                  color='flat'
                  onClick={() => handleClick(row)}
                  id={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
                >
                  {row.state === STATE.ACTIVE ? <UnlockIcon/> : <LockIcon/>}
                </Button.Ripple>
                <UncontrolledTooltip placement='auto' target={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
                  <FormattedMessage id={row.state === STATE.ACTIVE ? 'Inactivate inverter' : 'Activate inverter'}/>
                </UncontrolledTooltip>
              </>
            }

            {
              ability.can('manage', USER_ABILITY.CAN_DELETE) &&
              <>
                <Button.Ripple
                  className='btn-icon'
                  color='flat'
                  onClick={() => handleConfirmDelete({ inverter: row })}
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
          <Button
            color='secondary'
            className='mr-1'
            onClick={() => {
              setIsShowCreatePanelByFile(true)
            }}
          >
            <FormattedMessage id='Add new solar panel'/>
          </Button>
          <Button.Ripple
            color='primary'
            className='add-button'
            onClick={addInverter}
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
          'react-dataTable react-dataTable--inverters hover',
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
          { name: currentInverter?.name }
        )}
        isOpen={isOpenConfirmPassword}
        setIsOpen={setIsOpenConfirmPassword}
        handleConfirm={handleConfirmPasswordForDelete}
      />
    </Card>
  )
}

InverterTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addInverter: PropTypes.func.isRequired,
  editInverter: PropTypes.func.isRequired,
  setIsShowCreatePanelByFile: PropTypes.func.isRequired
}

export default injectIntl(InverterTable)
