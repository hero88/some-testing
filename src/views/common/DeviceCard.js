import { Link } from 'react-router-dom'
// ** Import third party components
import { Button, Card, CardBody, CardHeader, CardSubtitle, UncontrolledTooltip } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

// ** Custom components
import { DEVICE_TYPE, renderDeviceStatus, selectTypeDeviceLabel } from '@constants/project'
import { ReactComponent as SolarPanelIcon } from '@src/assets/images/svg/solar-panel.svg'
import { useDispatch } from 'react-redux'
import { setSelectedInverter } from '@src/views/monitoring/project/devices/inverters/store/actions'
import { ROUTER_URL } from '@constants/router'
import { numberToFixed, numberWithCommas } from '@utils'
import { useLayoutEffect, useRef, useState } from 'react'
import moment from 'moment'
import { DISPLAY_DATE_FORMAT } from '@constants/common'

const convertNumber = ({ key, value }) => {
  const powerKeys = ['todayActivePower']
  const yieldKeys = ['dailyYield', 'totalYield']

  if (powerKeys.includes(key) && value > 1000000) {
    return {
      key,
      value: value / 1000000,
      unit: 'MW'
    }
  }

  if (powerKeys.includes(key) && value <= 1000000) {
    return {
      key,
      value: value / 1000,
      unit: 'KW'
    }
  }

  if (yieldKeys.includes(key) && value > 1000000) {
    return {
      key,
      value: value / 1000000,
      unit: 'MWh'
    }
  }

  if (yieldKeys.includes(key) && value <= 1000000) {
    return {
      key,
      value: value / 1000,
      unit: 'KWh'
    }
  }

  return { key, value, unit: '' }
}

const DeviceCard = ({ item, setIsShowSolarPanelList, projectId }) => {
  const dispatch = useDispatch()
  const labelRef = useRef()
  const paramInfoRef = useRef()
  const [isShowLabelTooltip, setIsShowLabelTooltip] = useState(false),
    [isShowInfoTooltip, setIsShowInfoTooltip] = useState(false)

  useLayoutEffect(() => {
    setIsShowLabelTooltip(labelRef?.current?.clientWidth < labelRef?.current?.scrollWidth)
  }, [labelRef])

  useLayoutEffect(() => {
    setIsShowInfoTooltip(paramInfoRef?.current?.clientWidth < paramInfoRef?.current?.scrollWidth)
  }, [paramInfoRef])

  const renderParam = ({ key, convertedObject, item }) => {
    if (key === 'verificationTime') {
      return Number(item[key]) ? moment(Number(item[key])).format(DISPLAY_DATE_FORMAT) : ''
    }

    if (key === 'manufacturer') {
      if (item.typeDevice === DEVICE_TYPE.INVERTER) {
        return item?.inverterType?.manufacturer || ''
      }

      if (item.typeDevice === DEVICE_TYPE.PANEL) {
        return item?.panelType?.manufacturer || ''
      }
    }

    if (isNaN(item[key]) || key === 'serialNumber') {
      return item[key]
    }

    return `${numberWithCommas(numberToFixed(convertedObject.value)) || 0} ${convertedObject.unit}`
  }

  const renderData = () => {
    const itemKeys = [
      'serialNumber',
      'todayActivePower',
      'dailyYield',
      'totalYield',
      'manufacturer',
      'verificationTime'
    ]

    return itemKeys.map((key, index) => {
      const convertedObject = convertNumber({ key, value: item[key] })

      return (
        <div key={key} className='device-info'>
          <span id={`label${item.id}${index}`} ref={labelRef}>
            <FormattedMessage id={key} />
          </span>
          {
            isShowLabelTooltip &&
            <UncontrolledTooltip placement='top' target={`label${item.id}${index}`}>
              <FormattedMessage id={key} />
            </UncontrolledTooltip>
          }

          <span id={`deviceInfoParam${item.id}${index}`} ref={paramInfoRef}>
            {renderParam({ key, convertedObject, item })}
          </span>
          {
            isShowInfoTooltip &&
            <UncontrolledTooltip placement='top' target={`deviceInfoParam${item.id}${index}`}>
              {renderParam({ key, convertedObject, item })}
            </UncontrolledTooltip>
          }
        </div>
      )
    })
  }
  return (
    <Card className='device-card'>
      <CardHeader className='pb-0'>
        <div className='media'>
          <div className='justify-content-center align-self-center mr-1'>
            {renderDeviceStatus(item.status, item.id)}
          </div>
          <div className='media-body'>
            <Link
              to={{
                pathname: ROUTER_URL.MONITORING_DEVICE,
                search: `deviceId=${item.id}&typeDevice=${item.typeDevice}&projectId=${projectId}`
              }}
            >
              {item.name ? item.name : item.serialNumber}
            </Link>
            <CardSubtitle className='mt-0'>
              <FormattedMessage id={selectTypeDeviceLabel(item.typeDevice)} />
            </CardSubtitle>
          </div>
        </div>
        {item.typeDevice === DEVICE_TYPE.INVERTER && (
          <>
            <Button.Ripple
              id={`btn_${item.id}`}
              className='btn-icon rounded-circle text-success'
              color='flat-success'
              onClick={() => {
                dispatch(setSelectedInverter(item))
                setIsShowSolarPanelList(true)
              }}
            >
              <SolarPanelIcon />
            </Button.Ripple>
            <UncontrolledTooltip placement='top' target={`btn_${item.id}`}>
              <FormattedMessage id={'Show solar panel list'} />
            </UncontrolledTooltip>
          </>
        )}
      </CardHeader>
      <CardBody>
        <hr />
        {renderData()}
      </CardBody>
    </Card>
  )
}

DeviceCard.propTypes = {
  item: PropTypes.object.isRequired,
  setIsShowSolarPanelList: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired
}

export default DeviceCard
