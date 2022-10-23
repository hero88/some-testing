import classNames from 'classnames'
import { array, bool, element, func, number } from 'prop-types'
import React from 'react'
import DataTable from 'react-data-table-component'
import { Code } from 'react-feather'
import { FormattedMessage } from 'react-intl'
import NoDataCOM from '../../NoDataCOM'
import Pagination from './Pagination'
import './style.scss'

const Table = ({
  data,
  columns,
  onSort,
  total,
  rowsPerPage = 10,
  currentPage = 1,
  rowsPerPageOptions,
  onPerPageChange,
  onPageChange,
  noDataTitle,
  isSearching,
  ...rest
}) => {
  const paginationProps = {
    total,
    rowsPerPage,
    currentPage,
    rowsPerPageOptions,
    handlePerPage: onPerPageChange,
    onPageChange
  }

  const PaginationCOM = () => <Pagination {...paginationProps} />

  return (
    <>
      <DataTable
        noHeader
        pagination
        paginationServer
        className={classNames(`react-dataTable react-dataTable--projects hover react-dataTable-version-2`, {
          'overflow-hidden': data?.length <= 0
        })}
        // fixedHeader
        // fixedHeaderScrollHeight="calc(100vh - 340px)"
        columns={columns.filter((item) => !item.isHidden)}
        sortIcon={
          <div className="custom-sort-icon">
            <Code />
          </div>
        }
        paginationComponent={PaginationCOM}
        data={data || []}
        persistTableHead
        noDataComponent={''}
        onSort={onSort}
        sortServer
        {...rest}
      />
      {!(data || []).length > 0 && (
        <NoDataCOM
          title={
            noDataTitle ||
            (isSearching ? (
              <FormattedMessage id="Not found any result. Please try again" />
            ) : (
              <FormattedMessage id="Add or update record later" />
            ))
          }
        />
      )}
    </>
  )
}

Table.propTypes = {
  data: array.isRequired,
  columns: array.isRequired,
  onSort: func,
  total: number,
  rowsPerPage: number,
  currentPage: number,
  rowsPerPageOptions: array,
  onPerPageChange: func,
  onPageChange: func,
  noDataTitle: element,
  isSearching: bool
}

export default Table
