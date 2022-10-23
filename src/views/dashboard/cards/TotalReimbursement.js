import classnames from 'classnames'
import { Database, Calendar } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Avatar from '@components/avatar'
import { numberWithCommas } from '@utils'

const TotalReimbursement = ({
  cols,
  todayRevenue,
  totalRevenue
}) => {
  const data = [
    {
      title: numberWithCommas(todayRevenue),
      unit: 'đ',
      subtitle: <FormattedMessage id='Today'/>,
      color: 'light-danger',
      icon: <Calendar size={24}/>
    },
    {
      title: numberWithCommas(totalRevenue),
      unit: 'đ',
      subtitle: <FormattedMessage id='Total'/>,
      color: 'light-info',
      icon: <Database size={24}/>
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Row className='mb-3' key={index}>
          <Col
            {...cols}
            className={classnames({
              [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
            })}
          >
            <Media>
              <Avatar color={item.color} icon={item.icon} className='mr-1'/>
              <Media className='my-auto' body>
                <div className='d-flex align-items-center mb-0'>
                  <h4 className='font-weight-bolder'>{item.title}</h4>
                  <span className='unit'>{item.unit}</span>
                </div>
                <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
              </Media>
            </Media>
            {/*<StatsVertical icon={item.icon} color={item.color} stats={item.title} statTitle={item.subtitle}/>*/}
          </Col>
        </Row>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>
          <FormattedMessage id='Total reimbursement'/>
        </CardTitle>
      </CardHeader>
      <CardBody className='statistics-body'>
        {renderData()}
      </CardBody>
    </Card>
  )
}

TotalReimbursement.propTypes = {
  cols: PropTypes.object.isRequired,
  todayRevenue: PropTypes.number.isRequired,
  totalRevenue: PropTypes.number.isRequired
}

export default TotalReimbursement
