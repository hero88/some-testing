// ** React Imports
import React, { Fragment, useContext, useEffect, useState } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { deletePanel, getPanels, getPanelTypes, reActivePanel, removePanel } from './store/actions'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Button, UncontrolledTooltip } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Constants
import { USER_ABILITY } from '@constants/user'
import { AbilityContext } from '@src/utility/context/Can'
import { ROWS_PER_PAGE_OPTIONS, STATE } from '@constants/common'
import CP from '@src/views/common/pagination'
import { useQuery } from '@hooks/useQuery'
import { getInverterById } from '@src/views/monitoring/project/devices/inverters/store/actions'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import { NORMAL_CHARACTER } from '@constants/regex'
import { ReactComponent as UnlockIcon } from '@src/assets/images/svg/table/ic-unlock.svg'
import { ReactComponent as LockIcon } from '@src/assets/images/svg/table/ic-lock.svg'
import { ReactComponent as EditIcon } from '@src/assets/images/svg/table/ic-edit.svg'
import { numberWithCommas } from '@utils'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import ConfirmPasswordModal from '@src/views/common/modal/ConfirmPasswordModal'

const MySweetAlert = withReactContent(SweetAlert)

const PanelTable = ({ intl, addPanel, editPanel }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      inverter: { selectedInverter },
      panel: store,
      layout: { skin }
    } = useSelector((state) => state),
    query = useQuery(),
    projectId = query.get('projectId'),
    inverterId = query.get('inverterId')

  // ** States
  const [currentPage, setCurrentPage] = useState(store?.params?.page),
    [rowsPerPage, setRowsPerPage] = useState(store?.params?.rowsPerPage),
    [searchValue, setSearchValue] = useState(store?.params?.q),
    [orderBy, setOrderBy] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[0] : 'name'
    ),
    [sortDirection, setSortDirection] = useState(
      store?.params?.order && store?.params?.order.length ? store?.params?.order.split(' ')[1] : 'asc'
    ),
    [isOpenConfirmPassword, setIsOpenConfirmPassword] = useState(false),
    [selectedPanel, setSelectedPanel] = useState(null),
    [isDeleteAll, setIsDeleteAll] = useState(false)

  // Fetch panel API
  const fetchPanels = (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      q: searchValue,
      order: `${orderBy} ${sortDirection}`,
      withInverter: selectedInverter?.id,
      state: '*',
      fk: '*',
      ...queryParam
    }

    // ** Set data to store
    dispatch(getPanels(initParam))
  }

  useEffect(() => {
    if (selectedInverter) {
      fetchPanels()
    }
  }, [selectedInverter])

  // Component did mount
  useEffect(() => {
    if (inverterId) {
      dispatch(getInverterById({ id: inverterId, fk: JSON.stringify(['project']) }))
    }
  }, [inverterId])

  useEffect(() => {
    if (projectId) {
      dispatch(
        getProjectById({
          id: projectId,
          fk: JSON.stringify(['users', 'devices', 'contacts', 'customer'])
        })
      )
      dispatch(getPanelTypes({ rowsPerPage: -1, state: STATE.ACTIVE }))
    }
  }, [projectId])

  // ** Change search value
  const handleChangeSearch = (e) => {
    const { target: { value }, nativeEvent: { inputType } } = e

    setSearchValue(value)

    if (!inputType && value === '') {
      setCurrentPage(1)
      fetchPanels({ q: value, page: 1 })
    }
  }

  // ** Function to handle filter
  const handleFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      fetchPanels({ page: 1 })
    }
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    fetchPanels({ page: page.selected + 1 })
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
    fetchPanels({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage
    })
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
        displayUnit={intl.formatMessage({ id: 'Panel' }).toLowerCase()}
      />
    )
  }

  const handleConfirmCancel = (panel) => {
    return MySweetAlert.fire({
      title:
        panel.state === STATE.ACTIVE
          ? intl.formatMessage({ id: 'Inactivate panel title' })
          : intl.formatMessage({ id: 'Activate panel title' }),
      html:
        panel.state === STATE.ACTIVE
          ? intl.formatMessage({ id: 'Inactivate panel message' })
          : intl.formatMessage({ id: 'Activate panel message' }),
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
        if (panel.state === STATE.ACTIVE) {
          await dispatch(removePanel(panel.id, store.params))
        } else {
          await dispatch(reActivePanel({ id: panel.id, state: STATE.ACTIVE }, store.params))
        }

        MySweetAlert.fire({
          icon: 'success',
          title:
            panel.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate panel successfully title' })
              : intl.formatMessage({ id: 'Activate panel successfully title' }),
          text:
            panel.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate panel successfully message' })
              : intl.formatMessage({ id: 'Activate panel successfully message' }),
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
            panel.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate panel fail title' })
              : intl.formatMessage({ id: 'Activate panel fail title' }),
          text:
            panel.state === STATE.ACTIVE
              ? intl.formatMessage({ id: 'Inactivate panel fail message' })
              : intl.formatMessage({ id: 'Activate panel fail message' }),
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
  const handleConfirmDelete = ({ panel, isDeleteAll: isDelAll }) => {
    return MySweetAlert.fire({
      title: isDelAll
        ? intl.formatMessage({ id: 'Delete all panel title' })
        : intl.formatMessage({ id: 'Delete panel title' }),
      html: isDelAll
        ? intl.formatMessage({ id: 'Delete all panel message' })
        : intl.formatMessage({ id: 'Delete panel message' }),
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
        setSelectedPanel(panel)
        setIsDeleteAll(isDelAll)
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title: isDeleteAll
            ? intl.formatMessage({ id: 'Delete all panel fail title' })
            : intl.formatMessage({ id: 'Delete panel fail title' }),
          text: isDeleteAll
            ? intl.formatMessage({ id: 'Delete all panel fail message' })
            : intl.formatMessage({ id: 'Delete panel fail message' }),
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
    setSelectedPanel(null)

    const deleteData = {
      data: {
        deletePanelsByInverterId: isDeleteAll ? inverterId : undefined,
        id: isDeleteAll ? undefined : selectedPanel?.id,
        password
      },
      params: store?.params,
      successCBFunc: () => {
        MySweetAlert.fire({
          icon: 'success',
          title: isDeleteAll
            ? intl.formatMessage({ id: 'Delete all panel successfully title' })
            : intl.formatMessage({ id: 'Delete panel successfully title' }),
          text: isDeleteAll
            ? intl.formatMessage({ id: 'Delete all panel successfully message' })
            : intl.formatMessage({ id: 'Delete panel successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      }
    }

    dispatch(deletePanel(deleteData))
  }

  // Handle Click
  const handleClick = async (projectId) => {
    await handleConfirmCancel(projectId)
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setCurrentPage(1)
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchPanels({ order: `${column.selector} ${direction}`, page: 1 })
  }

  // ** Column header
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'Device name' }),
      selector: 'name',
      sortable: true,
      minWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'S/N' }),
      selector: 'serialNumber',
      sortable: true,
      minWidth: '160px'
    },
    {
      name: intl.formatMessage({ id: 'Model' }),
      selector: 'panelModel',
      cell: (row) => row?.panelType?.panelModel || '',
      sortable: true,
      minWidth: '160px'
    },
    {
      name: intl.formatMessage({ id: 'MPPT position' }),
      selector: 'panelMPPTPosition',
      sortable: true,
      center: true,
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Array' }),
      selector: 'array',
      sortable: true,
      center: true,
      minWidth: '50px',
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Manufacturer' }),
      selector: 'manufacturer',
      cell: (row) => row?.panelType?.manufacturer || '',
      sortable: true,
      minWidth: '120px'
    },
    {
      name: `${intl.formatMessage({ id: 'Nominal PV' })} (Wp)`,
      selector: 'nominalPV',
      cell: (row) => (
        row?.panelType?.ppv ? numberWithCommas(row?.panelType?.ppv) : '-'
      ),
      center: true,
      sortable: true,
      minWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'activated',
      center: true,
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return row.state === STATE.ACTIVE
          ? (
            <div className='text-success'>
              <FormattedMessage id='Active' />
            </div>
          )
          : (
            <div className='text-dark'>
              <FormattedMessage id='Inactive' />
            </div>
          )
      },
      sortable: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: 'action',
      omit: ability.cannot('manage', USER_ABILITY.MANAGE_DEVICE),
      center: true,
      minWidth: '150px',
      // eslint-disable-next-line react/display-name
      cell: (row) => {
        return (
          <div className='d-flex'>
            <Button.Ripple
              className='btn-icon'
              color='flat'
              onClick={() => editPanel(row)}
              id={`editBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
            >
              <EditIcon />
            </Button.Ripple>
            <UncontrolledTooltip placement='auto' target={`editBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
              <FormattedMessage id='Edit solar panel' />
            </UncontrolledTooltip>
            <Button.Ripple
              className='btn-icon'
              color='flat'
              onClick={() => handleClick(row)}
              id={`inactiveBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
            >
              {row.state === STATE.ACTIVE ? <UnlockIcon /> : <LockIcon />}
            </Button.Ripple>
            <UncontrolledTooltip placement='auto' target={`inactiveBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
              <FormattedMessage id={row.state === STATE.ACTIVE ? 'Inactivate solar panel' : 'Activate solar panel'} />
            </UncontrolledTooltip>

            {
              ability.can('manage', USER_ABILITY.CAN_DELETE) &&
              <>
                <Button.Ripple
                  className='btn-icon'
                  color='flat'
                  onClick={() => handleConfirmDelete({ panel: row, isDeleteAll: false })}
                  id={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}
                >
                  <IconDelete />
                </Button.Ripple>
                <UncontrolledTooltip placement='auto' target={`deleteBtn_${row.id.replaceAll(NORMAL_CHARACTER, '')}`}>
                  <FormattedMessage id='Delete' />
                </UncontrolledTooltip>
              </>
            }
          </div>
        )
      }
    }
  ]

  return (
    <Fragment>
      <Card>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <span className='font-weight-bolder'>
                {selectedInverter?.name}
              </span>
              &nbsp;-&nbsp;
              <span>
                {selectedInverter?.serialNumber}
              </span>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1 px-0' sm='6'>
            <Input
              className='dataTable-filter mr-1'
              type='search'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleChangeSearch}
              onKeyPress={handleFilterKeyPress}
              placeholder={`${intl.formatMessage({ id: 'Device name' })}, ${intl.formatMessage({
                id: 'serialNumber'
              })}, ${intl.formatMessage({ id: 'Model' })}, ${intl.formatMessage({ id: 'Manufacturer' })}`}
            />
            <UncontrolledTooltip placement='top' target={`search-input`}>
              {`${intl.formatMessage({ id: 'Device name' })}, ${intl.formatMessage({
                id: 'serialNumber'
              })}, ${intl.formatMessage({ id: 'Model' })}, ${intl.formatMessage({ id: 'Manufacturer' })}`}
            </UncontrolledTooltip>
            {ability.can('manage', USER_ABILITY.MANAGE_DEVICE) && (
              <Button.Ripple className='btn-icon' color='primary' onClick={() => addPanel()}>
                <FormattedMessage id={'Add new solar panel'} />
              </Button.Ripple>
            )}
            {ability.can('manage', USER_ABILITY.CAN_DELETE) && (
              <Button.Ripple
                className='btn-icon ml-1'
                color='danger'
                onClick={() => handleConfirmDelete({ isDeleteAll: true })}
              >
                <FormattedMessage id={'Delete all'} />
              </Button.Ripple>
            )}
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className={classnames(
            'react-dataTable react-dataTable--panels hover',
            { 'overflow-hidden': store?.data?.length <= 0 }
          )}
          fixedHeader
          fixedHeaderScrollHeight='calc(100vh - 400px)'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
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
            {
              name: isDeleteAll
                ? intl.formatMessage({ id: 'All' })
                : selectedPanel?.name
            }
          )}
          isOpen={isOpenConfirmPassword}
          setIsOpen={setIsOpenConfirmPassword}
          handleConfirm={handleConfirmPasswordForDelete}
        />
      </Card>
    </Fragment>
  )
}

PanelTable.propTypes = {
  intl: PropTypes.object.isRequired,
  addPanel: PropTypes.func.isRequired,
  editPanel: PropTypes.func.isRequired
}

export default injectIntl(PanelTable)
