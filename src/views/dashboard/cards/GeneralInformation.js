import classnames from 'classnames'
import { Activity, Cpu, Database, Server } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Avatar from '@components/avatar'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { numberWithCommas, sumProjectPower } from '@utils'

const GeneralInformation = ({ cols, todayYield, yesterdayYield, totalYield, averageProjectCF }) => {
  const projectStore = useSelector((state) => state.customerProject),
    [projects, setProjects] = useState([])

  useEffect(() => {
    setProjects(projectStore.allData)
  }, [projectStore])

  const data = [
    {
      title: projects.length,
      unit: '',
      subtitle: <FormattedMessage id='Projects' />,
      color: 'light-warning',
      icon: <Cpu size={24} />
    },
    {
      title: projects.length ? numberWithCommas(sumProjectPower(projects, 'wattageAC')) : 0,
      unit: 'MW',
      subtitle: <FormattedMessage id='Total power AC' />,
      color: 'light-info',
      icon: <Database size={24} />
    },
    {
      title: projects.length ? numberWithCommas(sumProjectPower(projects, 'wattageDC')) : 0,
      unit: 'MWp',
      subtitle: <FormattedMessage id='Total power DC' />,
      color: 'light-info',
      icon: <Database size={24} />
    },
    {
      title: numberWithCommas(totalYield / 10000000),
      unit: 'MWh',
      subtitle: <FormattedMessage id='Total yield' />,
      color: 'light-success',
      icon: <Server size={24} />
    },
    {
      title: numberWithCommas(todayYield / 1000000),
      unit: 'MWh',
      subtitle: <FormattedMessage id='Today yield' />,
      color: 'light-success',
      icon: <Server size={24} />
    },
    {
      title: numberWithCommas(yesterdayYield / 1000000),
      unit: 'MWh',
      subtitle: <FormattedMessage id='Yesterday yield' />,
      color: 'light-success',
      icon: <Server size={24} />
    },
    {
      title: numberWithCommas(averageProjectCF * 100),
      unit: '%',
      subtitle: <FormattedMessage id='CF ratio' />,
      color: 'light-danger',
      icon: <Activity size={24} />
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Row className='mb-2' key={index}>
          <Col
            {...cols}
            className={classnames({
              [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
            })}
          >
            <Media>
              <Avatar color={item.color} icon={item.icon} className='mr-1' />
              <Media className='my-auto' body>
                <div className='d-flex align-items-center mb-0'>
                  <h4 className='font-weight-bolder'>{item.title}</h4>
                  <span className='unit'>{item.unit}</span>
                </div>
                <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
              </Media>
            </Media>
          </Col>
        </Row>
      )
    })
  }

  return (
    <Card className='card-statistics' style={{ minHeight: 1027 }}>
      <CardHeader>
        <CardTitle tag='h4'>
          <FormattedMessage id='General information' />
        </CardTitle>
      </CardHeader>
      <CardBody className='statistics-body'>{renderData()}</CardBody>
    </Card>
  )
}

GeneralInformation.propTypes = {
  cols: PropTypes.object.isRequired,
  todayActivePower: PropTypes.number.isRequired,
  todayYield: PropTypes.number.isRequired,
  yesterdayYield: PropTypes.number.isRequired,
  totalYield: PropTypes.number.isRequired,
  averageProjectCF: PropTypes.number.isRequired
}

export default GeneralInformation
