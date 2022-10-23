import classnames from 'classnames'
import Avatar from '@components/avatar'
import { Circle } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

const ProjectStatusCard = ({ cols }) => {
  const data = [
    {
      title: 'P051-052 # BDU-TBS',
      subtitle: 'Sales',
      color: 'light-primary',
      icon: <Circle size={24}/>
    },
    {
      title: 'P059-062 # BDU-TBS',
      subtitle: 'Customers',
      color: 'light-primary',
      icon: <Circle size={24}/>
    },
    {
      title: 'EDMM',
      subtitle: 'Products',
      color: 'light-primary',
      icon: <Circle size={24}/>
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
              <CardText className='font-small-6 mb-0'>{item.title}</CardText>
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
          <FormattedMessage id='Project Status'/>
        </CardTitle>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

ProjectStatusCard.propTypes = {
  cols: PropTypes.object.isRequired
}

export default ProjectStatusCard
