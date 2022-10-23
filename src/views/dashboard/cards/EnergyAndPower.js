import { useEffect, useState } from 'react'
import axios from 'axios'
import classnames from 'classnames'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col
} from 'reactstrap'
import Chart from 'react-apexcharts'
import { FormattedMessage } from 'react-intl'
import ReactSpeedometer from "react-d3-speedometer"

const EnergyAndPower = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/card/card-analytics/avg-sessions').then(res => setData(res.data))
  }, [])

  const options = {
      chart: {
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      states: {
        hover: {
          filter: 'none'
        }
      },
      colors: ['#28C76F'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          endingShape: 'flat'
        }
      },
      tooltip: {
        x: { show: false }
      },
      xaxis: {
        type: 'numeric'
      }
    },
    series = [
      {
        name: 'Sessions',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 25))
      }
    ],
    optionsAnnual = {
      chart: {
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      states: {
        hover: {
          filter: 'none'
        }
      },
      colors: ['#01CFE8'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          endingShape: 'flat'
        }
      },
      tooltip: {
        x: { show: false }
      },
      xaxis: {
        type: 'numeric'
      }
    },
    seriesAnnual = [
      {
        name: 'Sessions',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 25))
      }
    ]

  const gaugeValue = 78.16
  const budgetSeries = [
      {
        data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62]
      }
    ],
    budgetOptions = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        sparkline: { enabled: true }
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 5],
        width: [5]
      },
      colors: ['#08A8FF'],
      tooltip: {
        enabled: false
      }
    }

  return data !== null ? (
    <Card>
      <CardHeader className='align-items-start'>
        <CardTitle className='mb-25' tag='h4'>
          <FormattedMessage id='Energy And Power'/>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="align-items-center">
          <Col
            sm={{ size: 4, order: 1 }}
          >
            <Card className='card-statistics'>
              <CardBody className='statistics-body'>
                {/*<Chart options={optionsGauge} series={seriesGauge} type='radialBar' height={550}*/}
                {/*       id='support-tracker-card'/>*/}
                <ReactSpeedometer
                  width={400}
                  height={400}
                  value={gaugeValue}
                  currentValueText={`${gaugeValue} kW`}
                  maxValue={110}
                  segments={2}
                  customSegmentStops={[0, gaugeValue, 110]}
                  // customSegmentLabels={[
                  //   {
                  //     text: `0 kW`,
                  //     position: 'OUTSIDE'
                  //   },
                  //   {
                  //     text: `110.00 kW`,
                  //     position: 'OUTSIDE'
                  //   }
                  // ]}
                  segmentColors={['#F4792C', '#F3F3F3']}
                  startColor={'#F4792C'}
                  endColor={'#FAB157'}
                  ringWidth={50}
                  needleTransitionDuration={5000}
                  needleTransition="easeElastic"
                  needleHeightRatio={0.5}
                  needleColor={'#6C6C6C'}
                  forceRender={true}
                />
              </CardBody>
            </Card>
          </Col>
          <Col
            sm={{ size: 4, order: 2 }}
          >
            <Card className='card-statistics'>
              <CardHeader className={classnames('align-items-start', 'today-header')}>
                <CardText><FormattedMessage id='Today'/></CardText>
                <CardTitle>2,405.60 kWh</CardTitle>
              </CardHeader>
              <CardBody className='statistics-body'>
                <Chart id='budget-chart' type='line' height='300' options={budgetOptions} series={budgetSeries}/>
              </CardBody>
            </Card>
          </Col>
          <Col
            sm={{ size: 4, order: 3 }}
          >
            <Row className='match-height'>
              <Col>
                <Card className='card-statistics'>
                  <CardHeader className='align-items-start'>
                    <CardText><FormattedMessage id='Current month'/></CardText>
                    <CardTitle>284.64 mWh</CardTitle>
                  </CardHeader>
                  <CardBody className='statistics-body'>
                    <Chart options={options} series={series} type='bar' height={150}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className='match-height'>
              <Col>
                <Card className='card-statistics'>
                  <CardHeader className='align-items-start'>
                    <CardText><FormattedMessage id='Current year'/></CardText>
                    <CardTitle>917.42 mWh</CardTitle>
                  </CardHeader>
                  <CardBody className='statistics-body'>
                    <Chart options={optionsAnnual} series={seriesAnnual} type='bar' height={150}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  ) : null
}
export default EnergyAndPower
