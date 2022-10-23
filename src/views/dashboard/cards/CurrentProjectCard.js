import classnames from 'classnames'
import Avatar from '@components/avatar'
import {Database, Calendar, Cpu} from 'react-feather'
import {Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media} from 'reactstrap'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'

const CurrentProjectCard = ({cols}) => {
  const data = [
    {
      title: '2,280.96 kwp',
      subtitle: 'Nominal PV power',
      color: 'info',
      icon: <Database size={24}/>
    },
    {
      title: '01/01/2021',
      subtitle: 'Date of commissioning',
      color: 'danger',
      icon: <Calendar size={24}/>
    },
    {
      title: 'On-Grid',
      subtitle: 'Operating mode',
      color: 'success',
      icon: <Cpu size={24}/>
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
          })}
        >
          <Media>
            <Avatar color={item.color} icon={item.icon} className='mr-2'/>
            <Media className='my-auto' body>
              <h4 className='font-weight-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </Media>
          </Media>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>
          <FormattedMessage id='Current Project'/>
        </CardTitle>
        <a href="#">P051-052 # BDU-TDS</a>
        <CardText className='card-text font-small-2 mr-25 mb-0'><FormattedMessage id='Updated 1 month ago'/></CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

CurrentProjectCard.propTypes = {
  cols: PropTypes.object.isRequired
}

export default CurrentProjectCard
