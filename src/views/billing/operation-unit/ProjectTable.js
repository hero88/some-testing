import React, { useEffect, useState } from 'react'
import { Col, Row, UncontrolledTooltip } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { object } from 'prop-types'
import Table from '@src/views/common/table/CustomDataTable'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getListProjectByCompanyUnitId } from '../project/store/actions'
import { ROWS_PER_PAGE_DEFAULT } from '@src/utility/constants'
import { isEqual } from 'lodash'

const ProjectTable = ({ intl }) => {
  const { id } = useParams()
  const [projects, setProjects] = useState([])
  const dispatch = useDispatch()
  const [pagination, setPagination] = useState({})
  const [params, setParams] = useState({})

  const [total, setTotal] = useState(0)

  const fetchListProject = (payload = {}, isSort) => {
    const tempPayload = {
      operationUnitId: id,
      pagination,
      params,
      ...payload
    }

    dispatch(
      getListProjectByCompanyUnitId({
        payload: tempPayload,
        callback: (res) => {
          if (isSort && isEqual(res.data, projects)) {
            fetchListProject({
              ...tempPayload,
              params: {
                ...tempPayload.params,
                sortDirection: tempPayload.params?.sortDirection === 'asc' ? 'desc' : 'asc'
              }
            })
            return
          }
          setProjects(res.data || [])
          setTotal(res?.count || 0)
          setPagination(tempPayload.pagination)
          setParams(tempPayload.params)
        }
      })
    )
  }

  useEffect(() => {
    fetchListProject({
      params: { sortBy: 'code', sortDirection: 'asc' },
      pagination: { rowsPerPage: ROWS_PER_PAGE_DEFAULT, currentPage: 1 }
    })
  }, [])

  const handleChangePage = (e) => {
    fetchListProject({
      pagination: {
        ...pagination,
        currentPage: e.selected + 1
      }
    })
  }

  const handlePerPageChange = (e) => {
    fetchListProject({
      pagination: {
        rowsPerPage: e.value,
        currentPage: 1
      }
    })
  }

  const handleSort = (column, direction) => {
    fetchListProject(
      {
        params: {
          sortBy: column.selector,
          sortDirection: direction
        }
      },
      true
    )
  }
  const columns = [
    {
      name: intl.formatMessage({ id: 'No.' }),
      cell: (row, index) => index + 1,
      center: true,
      maxWidth: '40px'
    },
    {
      name: intl.formatMessage({ id: 'projectCode' }),
      selector: 'code',
      sortable: true,
      maxWidth: '125px'
    },
    {
      name: intl.formatMessage({ id: 'projectName' }),
      selector: 'name',

      sortable: true,
      cell: (row) => <span>{row.name}</span>
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
      }
    },
    {
      name: intl.formatMessage({ id: 'PatternBillElectricity' }),
      selector: 'contractName',
      cell: (row) => row.contractName?.replaceAll(',', ',  ')?.replaceAll('"', ''),
      sortable: true
    },
    {
      name: intl.formatMessage({ id: 'operation-units' }),
      selector: 'operationCompanyName',
      sortable: true
    }
  ]

  return (
    <>
      <Row>
        <Col sm="12">
          <Table
            columns={columns}
            data={projects}
            total={total}
            onPageChange={handleChangePage}
            onPerPageChange={handlePerPageChange}
            onSort={handleSort}
            {...pagination}
            keyField="contractId"
            defaultSortAsc={params?.sortDirection === 'asc'}
            defaultSortField={params?.sortBy}
          />
        </Col>
      </Row>
    </>
  )
}

ProjectTable.propTypes = {
  intl: object.isRequired
}

export default injectIntl(ProjectTable)
