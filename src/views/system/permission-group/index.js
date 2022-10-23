/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import Table from '@src/views/common/table/CustomDataTable'
import { useContext, useEffect } from 'react'
import { FormattedMessage, injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import PageHeader from './PageHeader'
import './styles.scss'
import { DISPLAY_DATE_FORMAT, RESET_PERMISSION_GROUP_PARAM, ROUTER_URL, ROWS_PER_PAGE_DEFAULT } from '@src/utility/constants'
import { getRoles } from './store/actions'
import moment from 'moment'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const PermissionGroup = () => {
  const ability = useContext(AbilityContext)
  const history = useHistory()
  const dispatch = useDispatch()
  const { roles, params, total } = useSelector((state) => state.permissionGroup)
  const { pagination = {}, searchValue } = params || {}


  const fetchRole = (payload) => {
    dispatch(getRoles({
      ...params,
      ...payload
    }))
  }
  const intl = useIntl()
  useEffect(() => {
    const initParamsToFetch = {
      pagination: {
        rowsPerPage: ROWS_PER_PAGE_DEFAULT,
        currentPage: 1
      },
      sortBy: 'code',
      sortDirection: 'asc'
    }
    fetchRole(initParamsToFetch)
    return () => {
      dispatch({
        type: RESET_PERMISSION_GROUP_PARAM,
        payload: initParamsToFetch
      })
    }
  }, [])

  const handleSearch = (value) => {
    fetchRole({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: value
    })
  }
  const handleChangePage = (e) => {
    fetchRole({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchRole({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }
  const handleRedirectToUpdatePage = (id) => () => {
    if (id) {
      history.push({
        pathname: `${ROUTER_URL.SYSTEM_PERMISSION_GROUP}/${id}`,
        state: {
          allowUpdate: true
        }
      })
    }
  }

  const handleRedirectToViewPage = (id) => () => {
    if (id) {
      history.push(`${ROUTER_URL.SYSTEM_PERMISSION_GROUP}/${id}`)
    }
  }


  const columns = [
    {
      name: intl.formatMessage({ id: 'No.' }),
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '50px'
    },
    {
      name: intl.formatMessage({ id: 'Rights group code' }),
      selector: 'code',
      maxWidth: '180px'
    },
    {
      name: intl.formatMessage({ id: 'Rights group name' }),
      selector: 'name'
    },
    {
      name: intl.formatMessage({ id: 'Created by' }),
      selector: '',
      maxWidth: '200px',
      cell: () => 'System'
    },

    {
      name: intl.formatMessage({ id: 'CreatedDate' }),
      selector: 'createDate',
      maxWidth: '200px',
      cell: (row) => moment(row.createDate).format(DISPLAY_DATE_FORMAT)
    },

    {
      name: intl.formatMessage({ id: 'Application features' }),
      cell: (row) =>
        row.featuresApply?.length > 100 ? `${row.featuresApply?.substring(0, 100)}...` : row.featuresApply
    },

    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',
      cell: (row) => (
        <>
          {ability.can(USER_ACTION.DETAIL, USER_FEATURE.GROUP_MANAGER) && (
            <>
              <Badge onClick={handleRedirectToViewPage(row.id)}>
                <IconView id={`editBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                <FormattedMessage id="View Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.EDIT, USER_FEATURE.GROUP_MANAGER) && (
            <>
              <Badge onClick={handleRedirectToUpdatePage(row.id)}>
                <IconEdit id={`updateBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`updateBtn_${row.id}`}>
                <FormattedMessage id="Update Project" />
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
          <PageHeader
            onSearch={handleSearch}
            searchValue={searchValue}
          />
          <Table
            columns={columns}
            data={roles}
            onPageChange={handleChangePage}
            onPerPageChange={handlePerPageChange}
            total={total}
            defaultSortAsc={params?.sortDirection === 'asc'}
            isSearching={searchValue?.trim()}
            noDataTitle={intl.formatMessage({ id: 'There are no records to display' })}
          />
        </Col>
      </Row>
    </>
  )
}

PermissionGroup.propTypes = {}

export default injectIntl(PermissionGroup)
