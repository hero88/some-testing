import { ROWS_PER_PAGE_DEFAULT } from '@constants/common'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import { ROUTER_URL, SET_BILLING_SETTING_PARAMS } from '@src/utility/constants'
import { GENERAL_STATUS as OPERATION_UNIT_STATUS } from '@src/utility/constants/billing'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import { AbilityContext } from '@src/utility/context/Can'
import Table from '@src/views/common/table/CustomDataTable'
import { object } from 'prop-types'
import { useContext, useEffect } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import PageHeader from './PageHeader'
import { getListBillingSetting } from './store/actions'

const OperationUnit = ({ intl }) => {
  const ability = useContext(AbilityContext)
  const history = useHistory()
  const dispatch = useDispatch()

  const { data, params, total } = useSelector((state) => state.settings)

  const { pagination = {}, searchValue } = params

  const fetchBillingSetting = (payload) => {
    const tmpPayload = {
      ...params,
      ...payload
    }
    dispatch(getListBillingSetting(tmpPayload))
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
    fetchBillingSetting(initParams)
    return () => {
      dispatch({
        type: SET_BILLING_SETTING_PARAMS,
        payload: initParams
      })
    }
  }, [])

  const handleRedirectToUpdatePage = (id) => () => {
    if (id) history.push(`${ROUTER_URL.BILLING_SETTING}/${id}`)
  }

  const handleChangePage = (e) => {
    fetchBillingSetting({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchBillingSetting({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleSort = (column, direction) => {
    fetchBillingSetting({
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
      name: intl.formatMessage({ id: 'Config Code' }),
      selector: 'code',
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'Config Name' }),
      sortable: true,
      selector: 'name',
      cell: (row) => <Link to={`${ROUTER_URL.BILLING_SETTING}/${row.id}`}>{row?.name}</Link>
    },
    {
      name: intl.formatMessage({ id: 'description' }),
      sortable: true,
      selector: 'description'
    },
    {
      name: intl.formatMessage({ id: 'Status' }),
      center: true,
      selector: 'state',
      sortable: true,
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
      cell: (row) => {
        const checkDetailAbility = ability.can(USER_ACTION.DETAIL, USER_FEATURE.CONFIG)

        return (
          checkDetailAbility && (
            <>
              <Badge onClick={handleRedirectToUpdatePage(row.id)}>
                <IconView id={`editBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                <FormattedMessage id="View Project" />
              </UncontrolledTooltip>
            </>
          )
        )
      },
      center: true
    }
  ]

  const handleSearch = (value) => {
    fetchBillingSetting({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: value
    })
  }
  return (
    <>
      <Row>
        <Col sm="12">
          <PageHeader searchValue={searchValue} onSearch={handleSearch} />
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

OperationUnit.propTypes = {
  intl: object.isRequired
}

export default injectIntl(OperationUnit)
