import { Table, Badge } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

const PlanList = (props) => {
  const { planList } = props

  const renderPlantList = () => {
    return planList.map((item, index) => (
      <tr key={index}>
        <td>
          <span className='align-middle font-weight-bold'>{item.name}</span>
        </td>
        <td>
          <Badge pill color={item.status === 'Active' ? 'light-success' : 'light-dark'} className='mr-1'>
            {item.status}
          </Badge>
        </td>
      </tr>
    ))
  }

  return (
    <Table className='' responsive hover>
      <thead>
        <tr>
          <th><FormattedMessage id={'Project name'}/></th>
          <th><FormattedMessage id={'Status'}/></th>
        </tr>
      </thead>
      <tbody>
        {renderPlantList()}
      </tbody>
    </Table>
  )
}

PlanList.propTypes = {
  planList: PropTypes.array.isRequired
}

export default PlanList
