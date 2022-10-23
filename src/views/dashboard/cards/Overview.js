// ** Import React components
import { Fragment, useEffect, useState } from 'react'

// ** Import Third party components
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row, Table } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { Code } from 'react-feather'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import moment from 'moment'

// ** Import custom component
import { getProvinceLabel } from '@constants/province'
import CustomGoogleMap from '@src/views/common/google-map'
import { numberWithCommas } from '@utils'
import { DISPLAY_DATE_FORMAT } from '@constants/common'

const Overview = ({ intl, totalYield7DaysByProvince }) => {
  const projectStore = useSelector((state) => state.customerProject),
    [projects, setProjects] = useState([])

  useEffect(() => {
    if (projectStore?.allData) {
      setProjects(projectStore.allData)
    }
  }, [projectStore])

  const computeCapacityByProvince = () => {
    const tempPlant = {}

    if (projects && projects.length) {
      projects.forEach((project) => {
        const province = project?.provinceCode ? project.provinceCode : null
        if (province) {
          if (!tempPlant[province]) {
            tempPlant[province] = {
              capacityAC: 0,
              capacityDC: 0
            }
          }
          tempPlant[province].capacityAC += Number(project.wattageAC)
          tempPlant[province].capacityDC += Number(project.wattageDC)
        }
      })
    }

    return Object.keys(tempPlant).map((item) => ({
      province: getProvinceLabel(item) ? intl.formatMessage({ id: getProvinceLabel(item) }) : '',
      capacityAC: numberWithCommas(tempPlant[item].capacityAC / 1000),
      capacityDC: numberWithCommas(tempPlant[item].capacityDC / 1000)
    }))
  }

  const renderTable = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.province}</td>
        <td>{item.capacityAC}</td>
        <td>{item.capacityDC}</td>
      </tr>
    ))
  }

  const renderTimeLabels = () => {
    const tempLabels = []
    for (let i = 7; i > 0; i--) {
      tempLabels.push(moment().subtract(i, 'day').format(DISPLAY_DATE_FORMAT))
    }

    return tempLabels
  }

  const renderColors = () => {
    if (totalYield7DaysByProvince?.length > 0) {
      return totalYield7DaysByProvince.map((item, index) => {
        // eslint-disable-next-line no-mixed-operators
        return `rgba(255,${130 - index * 10},51,${1 - index * 0.02})`
      })
    }

    return ['rgba(255,130,51,1)']
  }

  const options = {
    chart: {
      height: 400,
      type: 'bar',
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '35%'
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'top',
      horizontalAlign: 'start'
    },
    colors: renderColors(),
    stroke: {
      show: true,
      colors: ['transparent']
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: renderTimeLabels()
    },
    fill: {
      opacity: 1
    },
    yaxis: {
      opposite: false
    }
  }

  return (
    <Fragment>
      {/*GOOGLE MAP*/}
      <Row>
        <Col md={12}>
          <Card>
            <CustomGoogleMap projects={projects} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className='chart-overview' style={{ height: 590 }}>
            <CardHeader className='d-flex align-items-center'>
              <CardTitle tag='h5'>
                <FormattedMessage id='The corresponding cumulative total output' /> (MWh)
              </CardTitle>
              <Button.Ripple className='d-none' color='flat-primary'>
                <Code size={16} />
              </Button.Ripple>
            </CardHeader>
            <CardBody style={{ minHeight: 510 }}>
              <Row>
                <Col className='justify-content-center align-self-center'>
                  <Chart options={options} series={totalYield7DaysByProvince} type='bar' height={500} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card className='total-installed-capacity' style={{ height: 590 }}>
            <CardHeader className='d-flex align-items-center'>
              <CardTitle tag='h5'>
                <FormattedMessage id='Total installed capacity by province' />
              </CardTitle>
            </CardHeader>
            <Row className='mx-0 mt-1 mb-50 d-flex align-items-center'>
              <Col className='d-none align-items-center justify-content-sm-end' md='6'>
                <Label className='mr-1' for='search-input'>
                  <FormattedMessage id='Search' />
                </Label>
                <Input
                  className='dataTable-filter w-50'
                  placeholder='Search'
                  type='text'
                  bsSize='sm'
                  id='search-input'
                />
              </Col>
            </Row>
            <Table className='' responsive hover>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id='Province' />
                  </th>
                  <th>
                    <FormattedMessage id='Total installed capacity AC' /> (KW)
                  </th>
                  <th>
                    <FormattedMessage id='Total installed capacity DC' /> (KWp)
                  </th>
                </tr>
              </thead>
              <tbody>{renderTable(computeCapacityByProvince())}</tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

Overview.propTypes = {
  intl: PropTypes.object.isRequired,
  totalYield7DaysByProvince: PropTypes.array.isRequired
}

export default injectIntl(Overview)
