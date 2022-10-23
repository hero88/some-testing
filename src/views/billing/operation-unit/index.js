/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import {
  DISPLAY_DATE_FORMAT,
  ROUTER_URL,
  ROWS_PER_PAGE_DEFAULT,
  SET_OPERATION_UNIT_PARAMS
} from '@src/utility/constants'
import { GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import { AbilityContext } from '@src/utility/context/Can'
import Table from '@src/views/common/table/CustomDataTable'
import classnames from 'classnames'
import moment from 'moment'
import { object } from 'prop-types'
import { useContext, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import PageHeader from './PageHeader'
import { deleteOperationUnit, getListOperationUnit } from './store/actions/index'

const MySweetAlert = withReactContent(SweetAlert)

const OperationUnit = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const dispatch = useDispatch()
  const { data, params, total } = useSelector((state) => state.company)

  const { pagination = {}, searchValue, filterValue = {} } = params || {}

  const {
    layout: { skin }
  } = useSelector((state) => state)

  const fetchOperationUnit = (payload) => {
    dispatch(
      getListOperationUnit({
        ...params,
        ...payload
      })
    )
  }

  useEffect(() => {
    const initParams = {
      pagination: {
        rowsPerPage: ROWS_PER_PAGE_DEFAULT,
        currentPage: 1
      },
      sortBy: 'code',
      sortDirection: 'asc'
    }
    fetchOperationUnit(initParams)
    return () => {
      dispatch({
        type: SET_OPERATION_UNIT_PARAMS,
        payload: initParams
      })
    }
  }, [])

  const handleRedirectToViewPage = (id) => () => {
    if (id) history.push(`${ROUTER_URL.BILLING_OPERATION_UNIT}/${id}`)
  }
  const handleRedirectToUpdatePage = (id) => () => {
    if (id) {
      history.push({
        pathname: `${ROUTER_URL.BILLING_OPERATION_UNIT}/${id}`,
        state: {
          allowUpdate: true
        }
      })
    }
  }
  const handleChangePage = (e) => {
    fetchOperationUnit({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchOperationUnit({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleSearch = (value) => {
    fetchOperationUnit({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: value
    })
  }

  const handleFilter = (value) => {
    fetchOperationUnit({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: '',
      filterValue: value
    })
  }

  const handleDeleteOperationCompany = (id) => () => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete operating customer title' }),
      text: intl.formatMessage({ id: 'Delete operating customer message' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark',
          'sweet-popup': true
        }),
        header: 'sweet-title',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1',
        actions: 'sweet-actions',
        content: 'sweet-content'
      },
      buttonsStyling: false
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        dispatch(
          deleteOperationUnit({
            id,
            skin,
            intl,
            callback: () => {
              fetchOperationUnit()
            }
          })
        )
      }
    })
  }

  const handleSort = (column, direction) => {
    fetchOperationUnit({
      sortBy: column.selector,
      sortDirection: direction
    })
  }
  const columns = [
    {
      name: intl.formatMessage({ id: 'No.' }),
      // eslint-disable-next-line no-mixed-operators
      cell: (row, index) => index + (pagination?.currentPage - 1) * pagination.rowsPerPage + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'operation-unit-form-code' }),
      selector: 'code',
      sortable: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'operation-unit-form-name' }),
      sortable: true,
      selector: 'name',
      cell: (row) =>
        ability.can(USER_ACTION.DETAIL, USER_FEATURE.OPE_CO) ? (
          <Link to={`${ROUTER_URL.BILLING_OPERATION_UNIT}/${row.id}`}>{row?.name}</Link>
        ) : (
          row?.name
        ),
      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'operation-unit-form-taxCode' }),
      selector: 'taxCode',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'operation-unit-form-address' }),
      selector: 'address',
      sortable: true,
      minWidth: '350px',
      cell: (row) => {
        return (
          <>
            <div id={`view_name${row.id}`}>
              {row?.address?.length > 150 ? `${row.address.slice(0, 150)}...` : row.address}
            </div>
            {row?.address?.length > 150 && (
              <UncontrolledTooltip placement="auto" target={`view_name${row.id}`}>
                <FormattedMessage id={row.address} />
              </UncontrolledTooltip>
            )}
          </>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'operation-unit-form-mobile' }),
      selector: 'phone',
      sortable: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'state',
      sortable: true,
      center: true,
      minWidth: '170px',
      cell: (row) => {
        return row.state === OPERATION_UNIT_STATUS.ACTIVE ? (
          <Badge pill color="light-success" className="custom-bagde">
            <FormattedMessage id="Active" />
          </Badge>
        ) : (
          <Badge pill color="light-muted" className="custom-bagde">
            <FormattedMessage id="Inactive" />
          </Badge>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Update Date' }),
      selector: 'modifyDate',
      sortable: true,
      cell: (row) => moment(row.modifyDate).format(DISPLAY_DATE_FORMAT),
      center: true,
      minWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',

      cell: (row) => (
        <>
          {' '}
          {ability.can(USER_ACTION.DETAIL, USER_FEATURE.OPE_CO) && (
            <>
              {' '}
              <Badge onClick={handleRedirectToViewPage(row.id)}>
                <IconView id={`editBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                <FormattedMessage id="View Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.EDIT, USER_FEATURE.OPE_CO) && (
            <>
              {' '}
              <Badge onClick={handleRedirectToUpdatePage(row.id)}>
                <IconEdit id={`updateBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`updateBtn_${row.id}`}>
                <FormattedMessage id="Update Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.DELETE, USER_FEATURE.OPE_CO) && (
            <>
              {' '}
              <Badge>
                <IconDelete onClick={handleDeleteOperationCompany(row.id)} id={`deleteBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`deleteBtn_${row.id}`}>
                <FormattedMessage id="Delete Project" />
              </UncontrolledTooltip>
            </>
          )}
        </>
      ),
      center: true
    }
  ]
  return (
    <>
      <Row>
        <Col sm="12">
          <PageHeader onSearch={handleSearch} onFilter={handleFilter} searchValue={searchValue} />
          <Table
            tableId="operation-unit"
            columns={columns}
            data={data}
            total={total}
            onPageChange={handleChangePage}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            isSearching={searchValue?.trim() || JSON.stringify(filterValue) !== '{}'}
            {...pagination}
          />
        </Col>
      </Row>
    </>
  )
}

OperationUnit.propTypes = {
  intl: object.isRequired
}

export default injectIntl(OperationUnit)
