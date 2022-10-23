// ** React components
import { Link } from 'react-router-dom'

// ** Third party components
import { Card, CardBody, CardHeader, CardLink, CardSubtitle, CardTitle, Col, Row } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _orderBy from 'lodash/orderBy'

// ** Custom componenets
import { DEVICE_TYPE, PROJECT_STATUS, renderDeviceStatus } from '@constants/project'
import { ROUTER_URL } from '@constants/router'
import { numberToFixed, numberWithCommas } from '@utils'

const ListCard = ({ items, title, deviceType, projectId }) => {
  const renderItems = () => {
    const orderedItems = _orderBy(items, ['name'])
    return orderedItems.map((item, index) => (
      // eslint-disable-next-line react/jsx-key
      <div className='row-table' key={index}>
        <Row>
          <Col xs={1} className='d-flex justify-content-center'>{renderDeviceStatus(item.status, item.id)}</Col>
          <Col xs={3} className='d-flex justify-content-center'>
            <CardLink
              tag={Link}
              to={{
                pathname: item.typeDevice === DEVICE_TYPE.METER
                  ? ROUTER_URL.PROJECT_METER_DETAIL
                  : ROUTER_URL.PROJECT_INVERTER_DETAIL,
                search: item.typeDevice === DEVICE_TYPE.METER
                  ? `projectId=${projectId}&deviceId=${item.id}&meterNetworkPlace=${item.meterNetworkPlace}`
                  : `projectId=${projectId}&deviceId=${item.id}&typeModel=${item.typeModel}`
              }}
              className='text-primary ml-1'
            >
              {item.name ? item.name : item.serialNumber}
            </CardLink>
          </Col>
          <Col
            xs={2}
            className='d-flex justify-content-center'
          >
            {deviceType === DEVICE_TYPE.METER ? item.measuringPointCode : item?.inverterType?.power / 1000 || '-'}
          </Col>
          <Col xs={2} className='d-flex justify-content-center'>
            {
              deviceType === DEVICE_TYPE.METER
                ? numberWithCommas(item.todayActivePower / 1000)
                : numberWithCommas(item.todayActivePower / 1000)
            }
          </Col>
          <Col xs={2} className='d-flex justify-content-center'>{numberWithCommas(numberToFixed(item.dailyYield
            / 1000))}</Col>
          <Col xs={2} className='d-flex justify-content-center'>{numberWithCommas(numberToFixed(item.yesterdayYield
            / 1000))}</Col>
        </Row>
      </div>
    ))
  }

  return (
    <Card
      className={classnames('list-card', {
        ['list-card__meter']: deviceType === DEVICE_TYPE.METER,
        ['list-card__inverter']: deviceType === DEVICE_TYPE.INVERTER
      })}
    >
      <CardHeader>
        <CardTitle tag='h4'>
          <FormattedMessage id={title}/>
        </CardTitle>
        <CardSubtitle>
          {items.length
            ? `${items.filter((item) => item.status && item.status !== PROJECT_STATUS.INACTIVE).length}/${items.length}`
            : '0/0'}
        </CardSubtitle>
      </CardHeader>
      <CardBody>
        <Row className='header-table'>
          <Col xs={1}>&nbsp;</Col>
          <Col xs={3}>
              <span>
                <FormattedMessage id='Device name'/>
              </span>
          </Col>
          {
            <Col xs={2}>
              {
                deviceType === DEVICE_TYPE.METER
                  ? (
                    <>
                      <FormattedMessage id='Measurement point code'/>
                    </>
                  )
                  : (
                    <>
                      <FormattedMessage id='Nominal PV'/><br/>(kW)
                    </>
                  )
              }
            </Col>
          }
          <Col xs={2}>
            <FormattedMessage id='AC P'/><br/>(kW)
          </Col>
          <Col xs={2}>
            <FormattedMessage id='Daily yield'/><br/>(kWh)
          </Col>
          <Col xs={2}>
            <FormattedMessage id='YTD yield'/><br/>(kWh)
          </Col>
        </Row>
        {renderItems()}
      </CardBody>
    </Card>
  )
}

ListCard.propTypes = {
  items: PropTypes.array.isRequired,
  handleClickItem: PropTypes.func.isRequired,
  title: PropTypes.string,
  deviceType: PropTypes.number,
  projectId: PropTypes.number
}

export default ListCard
