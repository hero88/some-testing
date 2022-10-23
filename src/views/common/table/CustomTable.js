import { Suspense } from 'react'
import { Table } from 'reactstrap'
import PropTypes from 'prop-types'

const CustomTable = ({ columns, data, noTableHead, fixedHeaderScrollHeight }) => {
  return (
    <Suspense fallback={null}>
      <Table className='custom-table'>
        {
          !noTableHead &&
          <thead>
            <tr>
              {
                columns.map((item, index) => <th key={index}>{item.name}</th>)
              }
            </tr>
          </thead>
        }
        <tbody style={{ height: fixedHeaderScrollHeight, overflow: 'auto', display: 'block' }}>
          {
            data.map((row, rIndex) => {
              return (
                <tr key={rIndex}>
                  {
                    columns.map((col, cIndex) => {
                      return (
                        <td
                          key={cIndex}
                          style={{ minWidth: col.minWidth, maxWidth: col.maxWidth }}
                        >
                          {col.cell ? col.cell(row) : row[col.selector]}
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </Suspense>
  )
}

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  noTableHead: PropTypes.bool,
  fixedHeaderScrollHeight: PropTypes.string
}

export default CustomTable
