// ** Third party component
import { FormattedMessage } from 'react-intl'
import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Label, Media, Row } from 'reactstrap'
import Avatar from '@components/avatar'
import { Cpu } from 'react-feather'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import { numberToFixed, numberWithCommas } from '@utils'
import { ReactComponent as Factory } from '@src/assets/images/svg/customer-icon.svg'
import { ReactComponent as EVN } from '@src/assets/images/svg/grid-icon.svg'

const TotalYield = ({
  nominalPower = 0,
  todayActivePower = 0,
  todayPowerYield = 0,
  yesterdayPowerYield = 0,
  totalPowerYield = 0,
  saleToEVN,
  saleToCustomer
}) => {
  const rate = nominalPower > 0 && todayActivePower > 0 ? (todayActivePower / nominalPower) * 100 : 0
  const totalYieldOptions = {
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
          endingShape: 'rounded'
        }
      },
      tooltip: {
        x: { show: false }
      },
      xaxis: {
        type: 'numeric'
      }
    },
    totalYieldSeries = [
      {
        name: 'Sessions',
        // eslint-disable-next-line no-mixed-operators
        data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 25 + 5))
      }
    ],
    options = {
      legend: {
        show: false,
        position: 'bottom'
      },
      labels: ['Plant PR', 'Note 1'],
      colors: ['#28C76F', '#FEA9A9'],
      dataLabels: {
        enabled: false,
        formatter(val) {
          return `${parseInt(val)}%`
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '10px',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '10px',
                fontFamily: 'Montserrat',
                formatter(val) {
                  return `${parseInt(val)}%`
                }
              },
              total: {
                show: true,
                fontSize: '1px',
                label: 'Plant PR',
                formatter() {
                  return `${parseInt(rate)}%`
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 200
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 200
            }
          }
        }
      ]
    }

  const series = [parseInt(rate), 100 - parseInt(rate)]

  return (
    <Card className="total-yield-card">
      <CardHeader>
        <CardTitle tag="h4">
          <FormattedMessage id="Yield" />
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="d-flex align-items-center">
          <Col md={4} sm={12}>
            <Chart
              options={totalYieldOptions}
              series={totalYieldSeries}
              type="bar"
              height={50}
              width={130}
              className="mt-2 mb-2"
            />
            <CardText>
              <FormattedMessage id="Today yield" />
            </CardText>
            <span className="font-weight-bold">
              {numberWithCommas(numberToFixed(todayPowerYield / 1000))}&nbsp;
              <Label className="font-weight-light">kWh</Label>
            </span>
            <CardText>
              <FormattedMessage id="Yesterday yield" />
            </CardText>
            <span className="font-weight-bold">
              {numberWithCommas(numberToFixed(yesterdayPowerYield / 1000))}&nbsp;
              <Label className="font-weight-light">kWh</Label>
            </span>
          </Col>
          <Col md={5} sm={12}>
            <Row className="mb-2">
              <Col>
                <Media>
                  <Avatar color="light-info" icon={<Cpu />} size={48} className="mr-2" />
                  <Media className="my-auto" body>
                    <h4 className="font-weight-bolder mb-0">
                      {numberWithCommas(numberToFixed(totalPowerYield / 1000000))}&nbsp;
                      <Label className="font-weight-light">MWh</Label>
                    </h4>
                    <CardText className="font-small-3 mb-0">
                      <FormattedMessage id="Total yield" />
                    </CardText>
                  </Media>
                </Media>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Media>
                  <Avatar color="light-warning" icon={<Factory />} size={48} className="mr-2" />
                  <Media className="my-auto" body>
                    <h4 className="font-weight-bolder mb-0">
                      {numberWithCommas(numberToFixed(saleToCustomer / 1000000))}&nbsp;
                      <Label className="font-weight-light">MWh</Label>
                    </h4>
                    <CardText className="font-small-3 mb-0">
                      <FormattedMessage id="Sale to factory" />
                    </CardText>
                  </Media>
                </Media>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <Media>
                  <Avatar color="light-success" icon={<EVN />} size={48} className="mr-2" />
                  <Media className="my-auto" body>
                    <h4 className="font-weight-bolder mb-0">
                      {numberWithCommas(numberToFixed(saleToEVN / 1000000))}&nbsp;
                      <Label className="font-weight-light">MWh</Label>
                    </h4>
                    <CardText className="font-small-3 mb-0">
                      <FormattedMessage id="Sale to EVN" />
                    </CardText>
                  </Media>
                </Media>
              </Col>
            </Row>
          </Col>
          <Col md={3} sm={12}>
            <Chart options={options} series={series} type="donut" height={150} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

TotalYield.propTypes = {
  nominalPower: PropTypes.number.isRequired,
  todayActivePower: PropTypes.number.isRequired,
  todayPowerYield: PropTypes.number.isRequired,
  yesterdayPowerYield: PropTypes.number.isRequired,
  totalPowerYield: PropTypes.number.isRequired,
  saleToEVN: PropTypes.number,
  saleToCustomer: PropTypes.number
}

export default TotalYield
