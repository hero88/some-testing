// ** React Imports
import React, { useState, useEffect, useContext } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import {
  inactivatePanel,
  getDeviceTypePanels
} from '@src/views/settings/device-types/panel/store/actions'

// ** Third Party Components
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import classnames from 'classnames'
import { ChevronDown} from 'react-feather'
import DataTable from 'react-data-table-component'
import { UncontrolledTooltip, CardLink, Badge } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

// Custom components
import { ROWS_PER_PAGE_DEFAULT, ROWS_PER_PAGE_OPTIONS, STATE, USER_ABILITY } from '@constants/index'
import { AbilityContext } from '@src/utility/context/Can'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import { numberWithOneCommas, numberWithThreeCommas } from '@src/utility/Utils'

import CP from '@src/views/common/pagination'

const MySweetAlert = withReactContent(SweetAlert)

const PanelTable = ({ intl, editPanel, viewPanel }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch()
  const {
    deviceTypePanel: data,
    layout: { skin }
  } = useSelector(state => state)

  const [currentPage, setCurrentPage] = useState(data?.params?.page || 1),
    [rowsPerPage, setRowsPerPage] = useState(data?.params?.rowsPerPage || ROWS_PER_PAGE_DEFAULT),
    [orderBy, setOrderBy] = useState(
      data?.params?.order && data?.params?.order.length
      ? data?.params?.order.split(' ')[0]
      : 'panelModel'
    ),
    [sortDirection, setSortDirection] = useState(
      data?.params?.order && data?.params?.order.length
      ? data?.params?.order.split(' ')[1]
      : 'asc'
    )

  // Fetch Panel API
  const fetchPanels = async (queryParam) => {
    if (!queryParam?.page) {
      setCurrentPage(1)
    }

    const initParam = {
      page: currentPage,
      rowsPerPage,
      order: `${orderBy} ${sortDirection}`,
      state: 'ACTIVE',
      ...queryParam
    }

    await dispatch(getDeviceTypePanels(initParam))
  }

  // ** Get data on mount
  useEffect(async () => {
    await Promise.all([fetchPanels()])
  }, [])

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    fetchPanels({ 
      page: page.selected + 1, 
      q: data.params.q 
    })
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    const perPage = parseInt(e.value)
    const maxPage = Math.ceil(data.total / perPage)

    if (maxPage < currentPage) {
      setCurrentPage(maxPage)
    }

    setRowsPerPage(perPage)
    fetchPanels({
      page: maxPage < currentPage ? maxPage : currentPage,
      rowsPerPage: perPage,
      q: data.params.q
    })
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(data.total / rowsPerPage)

    return (
      <CP
        totalRows={data.total}
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
        displayUnit={intl.formatMessage({ id: 'Panel type' }).toLowerCase()}
      />
    )
  }
  
  const handleConfirmCancel = (panel) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete device type panel title' }), 
      html: intl.formatMessage({ id: 'Delete device type panel message' }),
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
          await dispatch(inactivatePanel(panel.id, data.params))
        } 
        MySweetAlert.fire({
          icon: 'success',
          title: intl.formatMessage({ id: 'Delete device type panel successfully title' }),
          text: intl.formatMessage({ id: 'Delete device type panel successfully message' }),
          customClass: {
            popup: classnames({
              'sweet-alert-popup--dark': skin === 'dark'
            }),
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySweetAlert.DismissReason.cancel) {
        MySweetAlert.fire({
          title:  intl.formatMessage({ id: 'Delete device type panel fail title' }),
          text: intl.formatMessage({ id: 'Delete device type panel fail message' }),
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
  const handleClick = async (panelId) => {
    await handleConfirmCancel(panelId)
  }

  // Set selected panel to store
  const clickOnRow = (row) => {
    viewPanel(row)
  }

  // Custom sort function
  const customSort = async (column, direction) => {
    setOrderBy(column.selector)
    setSortDirection(direction)
    fetchPanels({
      order: `${column.selector} ${direction}`,
      q: data.params.q
    })
  }
   
  // ** Column header
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'Device type model' }),
      selector: 'panelModel',
      // eslint-disable-next-line react/display-name
      cell: row => <CardLink className='text-primary' onClick={() => clickOnRow(row)}>
        {row.panelModel}
      </CardLink>,

      sortable: true,
      minWidth: '220px'
    },
    {
      name: intl.formatMessage({ id: 'Device type producer' }),
      selector: 'manufacturer',
      sortable: true,
      minWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'Device type maximum power' }),
      cell: (row) => row.ppv,
      selector: 'ppv',
      sortable: true,
      center:'true',
      minWidth: '180px'
    },
    {
      name: `${intl.formatMessage({ id: 'Device type area'})} (m²)`,
      selector: 'spv',
      sortable: true,
      center:'true',
      minWidth: '120px'
    },
    {
      name: intl.formatMessage({ id: 'Device type module Efficiency' }),
      cell: (row) => numberWithOneCommas(row.eff),
      selector: 'eff',
      sortable: true,
      center:'true',
      minWidth: '200px'
    },
    {
      name: `${intl.formatMessage({ id: 'Device type ambient temperature'})} (°C)`,
      selector: 'ambTemp',
      sortable: true,
      center:'true',
      minWidth: '200px'
    },
    {
      name: `${intl.formatMessage({ id: 'Device type tempCoEff'})}`,
      cell: (row) => numberWithThreeCommas(row.tempCoEff),
      selector: 'tempCoEff',
      sortable: true,
      center: true,
      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'Device type operation' }),
      selector: 'action',
      omit: ability.cannot('manage', USER_ABILITY.MANAGE_INVERTER),
      allowOverflow: true,
      center:'true',
      minWidth: '150px',
      maxWidth: '150px',
      // eslint-disable-next-line react/display-name
      cell: row => {
        return (
          <div className='d-flex'>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Badge onClick={() => editPanel(row)} id={`editBtn_${row.id}`}>
              <IconEdit />
            </Badge>
            <UncontrolledTooltip placement='auto' target={`editBtn_${row.id}`}>
              <FormattedMessage id='Edit device type panel'/>
            </UncontrolledTooltip>
            <Badge
              onClick={() => handleClick(row)}
              id={`inactiveBtn_${row.id}`}
            >
              <IconDelete/>
            </Badge>
            <UncontrolledTooltip placement='auto' target={`inactiveBtn_${row.id}`}>
              <FormattedMessage id='Delete device type panel'/>
            </UncontrolledTooltip>
          </div>
        )
      }
    }
  ]

  return (
    <DataTable
      noHeader
      pagination
      paginationServer
      className={classnames('react-dataTable react-dataTable--customers hover mb-1', { 'overflow-hidden': data?.data?.length <= 0 })}
      fixedHeader
      fixedHeaderScrollHeight='calc(100vh - 340px)'
      columns={serverSideColumns}
      sortIcon={<ChevronDown size={10}/>}
      paginationComponent={CustomPagination}
      data={data?.data || []}
      persistTableHead
      noDataComponent={''}
      onSort={customSort}
      sortServer
      defaultSortAsc={sortDirection === 'asc'}
      defaultSortField={orderBy}
    />
  )
}

PanelTable.propTypes = {
  intl: PropTypes.object.isRequired,
  editPanel: PropTypes.func.isRequired,
  viewPanel: PropTypes.func.isRequired
}

export default injectIntl(PanelTable)
