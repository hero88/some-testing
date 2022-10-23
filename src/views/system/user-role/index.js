/* eslint-disable implicit-arrow-linebreak */
import { ReactComponent as IconEdit } from '@src/assets/images/svg/table/ic-edit.svg'
import Table from '@src/views/common/table/CustomDataTable'
import { object } from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, injectIntl, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Col, Row, UncontrolledTooltip } from 'reactstrap'
import PageHeader from './PageHeader'
import './styles.scss'
import { RESET_USER_ROLE, ROWS_PER_PAGE_DEFAULT } from '@src/utility/constants'
import EditUserRoleModal from './EditUserRoleModal'
import { getListUserRole } from './store/actions'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ACTION, USER_FEATURE } from '@src/utility/constants/permissions'

const RoofVendor = () => {
  const ability = useContext(AbilityContext)

  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { data, params, total } = useSelector((state) => state.userRole)
  const [selectUser, setSelectUser] = useState()
  const { pagination = {}, searchValue, filterValue } = params || {}
  const intl = useIntl()
  const fetchRole = (param) => {
    dispatch(getListUserRole({ ...params, ...param }))
  }

  useEffect(() => {
    const initParams = {
      pagination: {
        rowsPerPage: ROWS_PER_PAGE_DEFAULT,
        currentPage: 1
      }
    }
    fetchRole(initParams)
    return () => {
      dispatch({
        type: RESET_USER_ROLE,
        payload: initParams
      })
    }
  }, [])
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

  const handleSearch = ({ name, roleId }) => {
    fetchRole({
      pagination: {
        ...pagination,
        currentPage: 1
      },
      searchValue: name || '',
      filterValue: roleId || filterValue
    })
  }
  const handleSort = (column, direction) => {
    fetchRole({
      sortBy: column.selector,
      sortDirection: direction
    })
  }
  const handldeClickIconEdit = (row) => () => {
    setSelectUser(row)
    setIsOpen(true)
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
      name: intl.formatMessage({ id: 'Username' }),
      selector: 'username'
    },
    {
      name: intl.formatMessage({ id: 'Full name' }),
      selector: 'fullName'
    },
    {
      name: intl.formatMessage({ id: 'permission-group' }),
      selector: '',

      maxWidth: '200px',
      cell: (row) => row?.role?.name
    },

    {
      name: intl.formatMessage({ id: 'Actions' }),
      selector: '#',
      cell: (row) =>
        ability.can(USER_ACTION.EDIT, USER_FEATURE.ROLE_ASSIGNMENT) && (
          <>
            {' '}
            <Badge onClick={handldeClickIconEdit(row)}>
              <IconEdit id={`updateBtn_${row.id}`} />
            </Badge>
            <UncontrolledTooltip placement="auto" target={`updateBtn_${row.id}`}>
              <FormattedMessage id="Update Project" />
            </UncontrolledTooltip>
          </>
        ),
      center: true
    }
  ]
  const handldeOpenModal = (value) => {
    setIsOpen(value)
  }
  const handleFetchRole = () => {
    fetchRole(params)
  }
  return (
    <>
      <EditUserRoleModal
        handleFetchRoles={handleFetchRole}
        initValue={selectUser}
        handldeOpenModal={handldeOpenModal}
        isOpen={isOpen}
      />
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
            noDataTitle={intl.formatMessage({ id: 'There are no records to display' })}
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
