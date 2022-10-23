import { ROWS_PER_PAGE_OPTIONS } from '@src/utility/constants'
import CP from '@src/views/common/pagination'
import { array, func, number } from 'prop-types'

const Pagination = ({
  total,
  rowsPerPage,
  currentPage,
  onPageChange = () => {},
  rowsPerPageOptions = ROWS_PER_PAGE_OPTIONS,
  handlePerPage = () => {},
  ...rest
}) => {
  
  const count = Math.ceil(total / rowsPerPage)

  return (
    <CP
      totalRows={total}
      previousLabel={''}
      nextLabel={''}
      breakLabel="..."
      pageCount={count || 1}
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      activeClassName="active"
      forcePage={currentPage !== 0 ? currentPage - 1 : 0}
      onPageChange={onPageChange}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName={'pagination react-paginate'}
      pageRange={2}
      nextPagesClassName={'page-item next'}
      nextPagesLinkClassName={'page-link double'}
      nextPagesLabel={''}
      previousPagesClassName={'page-item prev'}
      previousPagesLinkClassName={'page-link double'}
      previousPagesLabel={''}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      handlePerPage={handlePerPage}
      {...rest}
    />
  )
}

Pagination.propTypes = {
  total: number.isRequired,
  rowsPerPage: number.isRequired,
  currentPage: number.isRequired,
  onPageChange: func,
  rowsPerPageOptions: array,
  handlePerPage: func
}

export default Pagination
