/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
import '@src/@core/scss/billing-sweet-alert.scss'
import { ReactComponent as IconDelete } from '@src/assets/images/svg/table/ic-delete.svg'
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import { ReactComponent as IconView } from '@src/assets/images/svg/table/ic-view.svg'
import { ROUTER_URL, ROWS_PER_PAGE_DEFAULT, SET_PROJECT_PARAMS } from '@src/utility/constants'
import { GENERAL_STATUS as PROJECT_STATUS, mockUser } from '@src/utility/constants/billing'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'
import { AbilityContext } from '@src/utility/context/Can'
import Table from '@src/views/common/table/CustomDataTable'
import classNames from 'classnames'
import { object } from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import SweetAlert from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import PageHeader from './PageHeader'
import { deleteBillingProjectById, getListProject } from './store/actions/index'

const MySweetAlert = withReactContent(SweetAlert)
const Project = ({ intl }) => {
  const ability = useContext(AbilityContext)

  const [cleanData, setCleanData] = useState()
  const history = useHistory()
  const {
    layout: { skin }
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { data, params, total } = useSelector((state) => state.projects)

  const { pagination = {}, searchValue, filterValue } = params || {}

  const fetchProject = (payload) => {
    dispatch(
      getListProject({
        ...params,
        ...payload
      })
    )
  }
  const replaceIdByUserName = (listId) => {
    const newList = JSON.parse(listId)
    let nameString = newList.length > 0 ? '' : '....'
    newList.map((item) => {
      if (mockUser[item - 1]?.label) nameString += `${mockUser[item - 1]?.label},`
    })
    nameString = nameString.slice(0, -1)
    return nameString
  }

  useEffect(() => {
    const newData = data.map((item) => ({ ...item, userIds: replaceIdByUserName(item.userIds) }))
    setCleanData(newData)
  }, [data])

  useEffect(() => {
    const initParamsToFetch = {
      pagination: {
        rowsPerPage: ROWS_PER_PAGE_DEFAULT,
        currentPage: 1
      },
      sortBy: 'code',
      sortDirection: 'asc'
    }
    fetchProject(initParamsToFetch)
    return () => {
      dispatch({
        type: SET_PROJECT_PARAMS,
        payload: initParamsToFetch
      })
    }
  }, [])

  const handleRedirectToUpdatePage = (id) => () => {
    if (id) {
      history.push({
        pathname: `${ROUTER_URL.BILLING_PROJECT}/${id}`,
        state: {
          allowUpdate: true
        }
      })
    }
  }

  const handleRedirectToViewPage = (id) => () => {
    if (id) {
      history.push({
        pathname: `${ROUTER_URL.BILLING_PROJECT}/${id}`
      })
    }
  }

  const handleChangePage = (e) => {
    fetchProject({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }
  const handleSearch = (value) => {
    fetchProject({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: value
    })
  }
  const handleFilter = (value) => {
    fetchProject({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: '',
      filterValue: value
    })
  }
  const handleDeleteProject = (project) => () => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Delete operating customer title' }),
      text: intl.formatMessage({ id: 'Delete billing information message' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'No, Thanks' }),
      customClass: {
        popup: classNames({
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
          deleteBillingProjectById({
            id: project.id,
            callback: fetchProject,
            intl
          })
        )
      }
    })
  }
  const handleNumberPerPageChange = (e) => {
    fetchProject({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleSort = (column, direction) => {
    fetchProject({
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
      name: intl.formatMessage({ id: 'Project code' }),
      selector: 'code',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'Project Name' }),
      sortable: true,
      selector: 'name',
      cell: (row) =>
        ability.can(USER_ACTION.DETAIL, USER_FEATURE.PROJECT) ? (
          <Link to={`${ROUTER_URL.BILLING_PROJECT}/${row.id}`}>{row?.name}</Link>
        ) : (
          row?.name
        ),
      minWidth: '100px'
    },
    {
      name: intl.formatMessage({ id: 'Address' }),
      selector: 'address',
      sortable: true,
      minWidth: '300px',
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
      name: intl.formatMessage({ id: 'Customer Company' }),
      selector: 'companyName',
      sortable: true,

      minWidth: '200px'
    },

    {
      name: intl.formatMessage({ id: 'Assigned accountant' }),
      selector: 'userIds',
      minWidth: '200px'
    },

    {
      name: intl.formatMessage({ id: 'Status' }),
      selector: 'state',
      sortable: true,
      center: true,
      minWidth: '150px',
      cell: (row) => {
        return row.state === PROJECT_STATUS.ACTIVE ? (
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
          {ability.can(USER_ACTION.DETAIL, USER_FEATURE.PROJECT) && (
            <>
              <Badge onClick={handleRedirectToViewPage(row.id)}>
                <IconView id={`editBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`editBtn_${row.id}`}>
                <FormattedMessage id="View Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.EDIT, USER_FEATURE.PROJECT) && (
            <>
              <Badge onClick={handleRedirectToUpdatePage(row.id)}>
                <IconEdit id={`updateBtn_${row.id}`} />
              </Badge>
              <UncontrolledTooltip placement="auto" target={`updateBtn_${row.id}`}>
                <FormattedMessage id="Update Project" />
              </UncontrolledTooltip>
            </>
          )}
          {ability.can(USER_ACTION.DELETE, USER_FEATURE.PROJECT) && (
            <>
              <Badge onClick={handleDeleteProject(row)}>
                <IconDelete id={`deleteBtn_${row.id}`} />
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
          <PageHeader onFilter={handleFilter} searchValue={searchValue} onSearch={handleSearch} />
          <Table
            tableId="project"
            columns={columns}
            data={cleanData}
            total={total}
            onPageChange={handleChangePage}
            onPerPageChange={handleNumberPerPageChange}
            onSort={handleSort}
            defaultSortAsc={params?.sortDirection === 'asc'}
            isSearching={searchValue?.trim() || JSON.stringify(filterValue) !== '{}'}
            {...pagination}
          />
        </Col>
      </Row>
    </>
  )
}

Project.propTypes = {
  intl: object.isRequired
}

export default injectIntl(Project)
