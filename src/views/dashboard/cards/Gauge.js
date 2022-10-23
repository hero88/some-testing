// ** Import react component
import { Fragment, useState } from 'react'

// ** Third party components
import { Card, CardBody, Row, Col, PopoverHeader, PopoverBody, Popover } from 'reactstrap'
import { Sunset, Sunrise } from 'react-feather'
import ReactSpeedometer from 'react-d3-speedometer'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import PowerGaugeIcon from '@src/views/common/icons/PowerGaugeIcon'
import { DISPLAY_DATE_FORMAT } from '@constants/common'

const Gauge = ({ nominalPower, todayActivePower }) => {
  // ** Store Vars
  const { weather } = useSelector((state) => state.customerProject)

  // ** State
  const [popoverOpen, setPopoverOpen] = useState(false)

  const renderForecast = () => {
    if (weather && weather.daily) {
      return weather.daily.map((item, index) => (
        <Fragment key={index}>
          <Row>
            <Col md={2}>
              <img
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="Weather icon"
                height={46}
              />
            </Col>
            <Col md={10}>
              <h6>{item.weather[0].description}</h6>
              <div className="temperature">
                {item.temp.min}&nbsp;-&nbsp;{item.temp.max} °C&nbsp;
                <span className="text-primary">{moment().add(index, 'd').format(DISPLAY_DATE_FORMAT)}</span>
              </div>
            </Col>
          </Row>

          <Row className="sunrise">
            <Col className="text-capitalize">
              <Sunrise size={14} />
              &nbsp;
              {moment(item.sunrise * 1000).format('h:mm A')}
            </Col>
            <Col className="text-capitalize ml-1">
              <Sunset size={14} />
              &nbsp;
              {moment(item.sunset * 1000).format('h:mm A')}
            </Col>
          </Row>
          {index < weather?.daily.length - 1 && <hr />}
        </Fragment>
      ))
    }
  }

  return (
    <Card className="gauge-card">
      <CardBody style={{ position: 'relative' }}>
        {weather && weather.daily && (
          <>
            <div
              className="weather"
              id="weather"
              onMouseOver={() => setPopoverOpen(true)}
              onMouseLeave={() => setPopoverOpen(false)}
            >
              <Row>
                <Col>
                  <img
                    src={`http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png`}
                    alt="Weather icon"
                    height={46}
                  />
                </Col>
                <Col>
                  <h6>{weather?.daily[0].weather[0].description}</h6>
                  <div className="temperature">
                    {weather?.daily[0].temp.min}&nbsp;-&nbsp;{weather?.daily[0].temp.max} °C
                    <span className="text-primary">
                      <FormattedMessage id="Today" />
                    </span>
                  </div>
                </Col>
              </Row>

              <Row className="sunrise">
                <Col className="text-capitalize">
                  <Sunrise size={10} />
                  &nbsp;
                  {moment(weather.daily[0].sunrise * 1000).format('h:mm A')}
                </Col>
                <Col className="text-capitalize ml-1">
                  <Sunset size={10} />
                  &nbsp;
                  {moment(weather.daily[0].sunset * 1000).format('h:mm A')}
                </Col>
              </Row>
            </div>
            <Popover placement="left" isOpen={popoverOpen} target="weather" toggle={() => setPopoverOpen(!popoverOpen)}>
              <PopoverHeader>
                <FormattedMessage id="Forecast" />
              </PopoverHeader>
              <PopoverBody>{renderForecast()}</PopoverBody>
            </Popover>
          </>
        )}
        <span>
          <PowerGaugeIcon todayActivePower={todayActivePower} />
        </span>
        <ReactSpeedometer
          width={220}
          height={220}
          value={Number((todayActivePower / 1000)?.toFixed(1))}
          currentValueText={`${Number((todayActivePower / 1000)?.toFixed(1))} kW`}
          maxValue={nominalPower > 0 ? nominalPower : 10000}
          segments={2}
          customSegmentStops={[
            0,
            Number((todayActivePower / 1000)?.toFixed(1)),
            nominalPower > 0 ? nominalPower : 10000
          ]}
          segmentColors={['#F4792C', '#F3F3F3']}
          startColor={'#F4792C'}
          endColor={'#FAB157'}
          ringWidth={25}
          needleTransitionDuration={5000}
          needleTransition="easeElastic"
          needleHeightRatio={0.5}
          needleColor={'#6C6C6C'}
          forceRender={true}
        />
      </CardBody>
    </Card>
  )
}

Gauge.propTypes = {
  nominalPower: PropTypes.number.isRequired,
  todayActivePower: PropTypes.number.isRequired
}

export default Gauge
