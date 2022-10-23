/* eslint-disable implicit-arrow-linebreak */
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'
import Table from '@src/views/common/table/CustomDataTable'
import classnames from 'classnames'
import { object } from 'prop-types'
import { useContext, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import PageHeader from './PageHeader'
import { deleteBillingRoofRentalUnit, getRoofVendor } from './store/actions'
import './styles.scss'
import { ROUTER_URL, ROWS_PER_PAGE_DEFAULT, SET_ROOF_RENTAL_UNIT_PARAMS } from '@src/utility/constants'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const MySweetAlert = withReactContent(SweetAlert)

const RoofVendor = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const history = useHistory()
  const dispatch = useDispatch()
  const { data, params, total } = useSelector((state) => state.roofUnit)

  const { pagination = {}, searchValue } = params || {}
  const {
    layout: { skin }
  } = useSelector((state) => state)

  const fetchRoofVendor = (payload) => {
    dispatch(
      getRoofVendor({
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
    fetchRoofVendor(initParams)
    return () => {
      // hainm check
      dispatch({
        type: SET_ROOF_RENTAL_UNIT_PARAMS,
        payload: initParams
      })
    }
  }, [])
  const handleChangePage = (e) => {
    fetchRoofVendor({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchRoofVendor({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleSearch = (value) => {
    fetchRoofVendor({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: value
    })
  }
  const handleSort = (column, direction) => {
    fetchRoofVendor({
      sortBy: column.selector,
      sortDirection: direction
    })
  }
  const handleRedirectToUpdatePage = (id) => () => {
    if (id) {
      history.push({
        pathname: `${ROUTER_URL.BILLING_ROOF_RENTAL_UNIT}/${id}`,
        state: {
          allowUpdate: true
        }
      })
    }
  }

  const handleRedirectToViewPage = (id) => () => {
    if (id) {
      history.push(`${ROUTER_URL.BILLING_ROOF_RENTAL_UNIT}/${id}`)
    }
  }

  const handleDeleteRoofRentalUnit = (id) => () => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete billing customer title' }),
      html: intl.formatMessage({ id: 'Delete billing information message' }),
      showCancelButton: true,
      showCloseButton: true,
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
          deleteBillingRoofRentalUnit({
            id,
            skin,
            intl,
            callback: () => {
              fetchRoofVendor()
            }
          })
        )
      }
    })
  }
  const columns = [
    {
      name: intl.formatMessage({ id: 'No.' }),
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Unit-code' }),
      selector: 'code',
      sortable: true,
      maxWidth: '125px'
    },
    {
      name: intl.formatMessage({ id: 'Roof rental unit name' }),
      selector: 'name',
      sortable: true,
      // eslint-disable-next-line no-confusing-arrow
      cell: (row) =>
        ability.can(USER_ACTION.DETAIL, USER_FEATURE.RENTAL_COMPANY) ? (
          <Link to={`${ROUTER_URL.BILLING_ROOF_RENTAL_UNIT}/${row.id}`}>{row?.name}</Link>
        ) : (
          row?.name
        ),

      minWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'operation-unit-form-taxCode' }),
      selector: 'taxCode',
      sortable: true
    },

    {
      name: intl.formatMessage({ id: 'Address' }),
      selector: 'address',
      sortable: true,
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
      },
      minWidth: '320px'
    },

    {
      name: intl.formatMessage({ id: 'operation-unit-form-mobile' }),
      selector: 'phone',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Email' }),
      selector: 'email',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'state',
      sortable: true,
      center: true,
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
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',
      cell: (row) => (
        <>
          {ability.can(USER_ACTION.DETAIL, USER_FEATURE.RENTAL_COMPANY) && (
            <>
              <Badge onClick={handleRedirectToViewPage(row.id)}>
                <IconView id={`editBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                <FormattedMessage id="View Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.EDIT, USER_FEATURE.RENTAL_COMPANY) && (
            <>
              <Badge onClick={handleRedirectToUpdatePage(row.id)}>
                <IconEdit id={`updateBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`updateBtn_${row.id}`}>
                <FormattedMessage id="Update Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.DELETE, USER_FEATURE.RENTAL_COMPANY) && (
            <>
              <Badge onClick={handleDeleteRoofRentalUnit(row.id)}>
                <IconDelete id={`deleteBtn_${row.id}`} />
              </Badge>
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
          <PageHeader onSearch={handleSearch} searchValue={searchValue} />
          <Table
            columns={columns}
            data={data}
            total={total}
            onPageChange={handleChangePage}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            defaultSortAsc={params?.sortDirection === 'asc'}
            isSearching={searchValue?.trim()}
            {...pagination}
          />
        </Col>
      </Row>
    </>
  )
}

RoofVendor.propTypes = {
  intl: object.isRequired
}

export default injectIntl(RoofVendor)
