// ** Import react
import { useEffect, useState } from 'react'

// ** Import Third party components
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, Col, Row, Spinner, UncontrolledTooltip } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { RefreshCw } from 'react-feather'
import moment from 'moment'

// ** Import custom components
import ChartModal from '@src/views/monitoring/devices/inverter/ChartModal'
import { getDailyYield, getLatestMonitoringInverterById } from '@src/views/monitoring/devices/inverter/store/actions'
import { useQuery } from '@hooks/useQuery'
import { TYPE_MODEL } from '@constants/project'
import { numberToFixed, numberWithCommas } from '@utils'
import { DISPLAY_DATE_TIME_FORMAT } from '@constants/common'

const convertUnitByKey = (key) => {
  switch (key) {
    case 'dailyYield':
    case 'totalYield':
    case 'dailyPowerYield':
    case 'monthlyPowerYields':
    case 'totalPowerYields':
      return 'kWh'

    case 'sumActivePower':
    case 'nominalActivePower':
    case 'totalActivePower':
      return 'kW'

    case 'sumPowerDc':
    case 'totalDcPower':
      return 'kWp'

    case 'totalReactivePower':
      return 'kVAr'

    case 'averageVoltageLineConductorL1ToN':
    case 'averageVoltageLineConductorL2ToN':
    case 'averageVoltageLineConductorL3ToN':
    case 'averageVoltageDc':
    case 'phaseAVoltage':
    case 'phaseBVoltage':
    case 'phaseCVoltage':
    case 'mPPT1Voltage':
    case 'mPPT2Voltage':
    case 'mPPT3Voltage':
    case 'mPPT4Voltage':
    case 'mPPT5Voltage':
    case 'mPPT6Voltage':
    case 'mPPT7Voltage':
    case 'mPPT8Voltage':
    case 'mPPT9Voltage':
      return 'V'

    case 'sumCurrentLineInverter':
    case 'sumCurrentlineConductorL2Inverter':
    case 'sumCurrentlineConductorL3Inverter':
    case 'averageCurrentDc':
    case 'phaseACurrent':
    case 'phaseBCurrent':
    case 'phaseCCurrent':
    case 'mPPT1Current':
    case 'mPPT2Current':
    case 'mPPT3Current':
    case 'mPPT4Current':
    case 'mPPT5Current':
    case 'mPPT6Current':
    case 'mPPT7Current':
    case 'mPPT8Current':
    case 'mPPT9Current':
      return 'A'

    case 'averagePowerFrequency':
    case 'gridFrequency':
      return 'Hz'

    case 'averageInternalTemperature':
    case 'internalAirTemperature':
      return '°C'

    case 'arrayInsulationResistance':
      return 'kΩ'

    default:
      return ''
  }
}

const MeasuringPointParameter = () => {
  const {
      layout: { skin },
      inverter: { selectedInverter },
      monitoringInverter: { latestData: latestMonitoringData, dailyYield }
    } = useSelector((state) => state),
    dispatch = useDispatch(),
    query = useQuery(),
    deviceId = query.get('deviceId'),
    [isOpenChartModal, setIsOpenChartModal] = useState(false),
    [selectedParam, setSelectedParam] = useState(null),
    [overviewParams, setOverviewParams] = useState([]),
    [mPPTParams, setMPPTParams] = useState([]),
    [isDailyYieldLoading, setIsDailyYieldLoading] = useState(false)

  const fetchLatestMonitoringData = async () => {
    setIsDailyYieldLoading(true)

    await Promise.all([
      dispatch(
        getLatestMonitoringInverterById({
          deviceId,
          rowsPerPage: 1,
          order: 'createDate desc',
          monitoringType: selectedInverter?.typeModel === TYPE_MODEL.SMA ? 'smaInverter' : 'sungrowInverter'
        })
      ),
      dispatch(
        getDailyYield({
          interval: 'daily',
          deviceIds: [selectedInverter?.id].toString()
        })
      )
    ])

    setIsDailyYieldLoading(false)
  }

  useEffect(async () => {
    if (selectedInverter?.typeModel) {
      await fetchLatestMonitoringData()
    }
  }, [selectedInverter])

  const readSMAParams = async (latestData) => {
    const overviewKeys = [
      'dailyYield',
      'sumActivePower',
      'totalYield',
      'sumPowerDc',
      'averageVoltageLineConductorL1ToN',
      'averageVoltageLineConductorL2ToN',
      'averageVoltageLineConductorL3ToN',
      'sumCurrentLineInverter',
      'sumCurrentlineConductorL2Inverter',
      'sumCurrentlineConductorL3Inverter',
      'averagePowerFrequency',
      'averageInternalTemperature'
    ]

    const mPPTInformationKeys = ['averageCurrentDc', 'averageVoltageDc']

    const tempOverviewParams = []
    const tempMPPTParams = []

    await Promise.all([
      overviewKeys.forEach((key) => {
        tempOverviewParams.push({
          id: key,
          title: key,
          unit: convertUnitByKey(key),
          value:
            key === 'dailyYield' ? (
              isDailyYieldLoading ? (
                <Spinner color='warning' />
              ) : (
                numberWithCommas(numberToFixed(dailyYield?.smaTotalPY / 1000))
              )
            ) : key.includes('Yield') || key.includes('Power') ? (
              numberWithCommas(numberToFixed(latestData?.[key]?.value / 1000)) || '0'
            ) : (
                  numberWithCommas(numberToFixed(latestData?.[key]?.value)) || '0'
                ),
          icon: latestData && latestData[key] && !isNaN(latestData[key]?.value) && (
            <span className='btn-icon font-medium-3 text-info cursor-pointer'>
              <i className='icofont-chart-line' />
            </span>
          )
        })
      }),
      mPPTInformationKeys.forEach((key) => {
        tempMPPTParams.push({
          id: key,
          title: key,
          unit: convertUnitByKey(key),
          value:
            latestData && latestData[key] && !isNaN(latestData[key]?.value)
            ? numberWithCommas(Number(Number(latestData[key].value)?.toFixed(2)))
            : '0',
          icon: latestData && latestData[key] && !isNaN(latestData[key]?.value) && (
            <span className='btn-icon font-medium-3 text-info cursor-pointer'>
              <i className='icofont-chart-line' />
            </span>
          )
        })
      })
    ])

    setOverviewParams(tempOverviewParams)
    setMPPTParams(tempMPPTParams)
  }

  const readSungrowParams = async (latestData) => {
    const overviewKeys = [
      'dailyPowerYield',
      'monthlyPowerYields',
      'totalPowerYields',
      'nominalActivePower',
      'totalActivePower',
      'totalDcPower',
      'phaseAVoltage',
      'phaseBVoltage',
      'phaseCVoltage',
      'phaseACurrent',
      'phaseBCurrent',
      'phaseCCurrent',
      'totalReactivePower',
      'arrayInsulationResistance',
      'gridFrequency',
      'internalAirTemperature'
    ]
    const mPPTInformationKeys = [
      'mPPT1Voltage',
      'mPPT1Current',
      'mPPT2Voltage',
      'mPPT2Current',
      'mPPT3Voltage',
      'mPPT3Current',
      'mPPT4Voltage',
      'mPPT4Current',
      'mPPT5Voltage',
      'mPPT5Current',
      'mPPT6Voltage',
      'mPPT6Current',
      'mPPT7Voltage',
      'mPPT7Current',
      'mPPT8Voltage',
      'mPPT8Current',
      'mPPT9Voltage',
      'mPPT9Current'
    ]

    const tempOverviewParams = []
    const tempMPPTParams = []

    await Promise.all([
      overviewKeys.forEach((key) => {
        tempOverviewParams.push({
          id: key,
          title: key,
          unit: convertUnitByKey(key),
          value:
            key.includes('Yield') || key.includes('Power')
            ? numberWithCommas(numberToFixed(latestData?.[key]?.value / 1000)) || '0'
            : numberWithCommas(numberToFixed(latestData?.[key]?.value)) || '0',
          icon: latestData && latestData[key] && !isNaN(latestData[key]?.value) && (
            <span className='btn-icon font-medium-3 text-info cursor-pointer'>
              <i className='icofont-chart-line' />
            </span>
          )
        })
      }),
      mPPTInformationKeys.forEach((key) => {
        tempMPPTParams.push({
          id: key,
          title: key,
          unit: convertUnitByKey(key),
          value:
            latestData && latestData[key] && !isNaN(latestData[key]?.value)
            ? numberWithCommas(Number(Number(latestData[key].value)?.toFixed(2)))
            : '0',
          icon: latestData && latestData[key] && !isNaN(latestData[key]?.value) && (
            <span className='btn-icon font-medium-3 text-info cursor-pointer'>
              <i className='icofont-chart-line' />
            </span>
          )
        })
      })
    ])

    setOverviewParams(tempOverviewParams)
    setMPPTParams(tempMPPTParams)
  }

  useEffect(async () => {
    if (latestMonitoringData && latestMonitoringData.length) {
      const latestData = latestMonitoringData[0]
      selectedInverter?.typeModel === TYPE_MODEL.SMA
      ? await readSMAParams(latestData)
      : await readSungrowParams(latestData)
    }

    setIsDailyYieldLoading(false)
  }, [latestMonitoringData, dailyYield])

  const renderParams = (items) => {
    return items.map((param) => (
      <Col key={param.id} xl={3} md={4} sm={6} className='d-flex measuring__row__col'>
        <div className={`measuring__row__col__title w-50 ${skin === 'dark' ? 'measuring__row__col__title--dark' : ''}`}>
          <FormattedMessage id={param.title} />
        </div>
        <div className='measuring__row__col__value w-50'>
          {param.value}&nbsp;
          {param.unit}
          <Button.Ripple
            className='btn-icon text-info'
            color='flat'
            onClick={() => {
              setSelectedParam(param)
              setIsOpenChartModal(true)
            }}
          >
            {param.icon}
          </Button.Ripple>
        </div>
      </Col>
    ))
  }

  return (
    <Card className='measuring'>
      <CardBody>
        <Row className='mb-1'>
          <Col className='d-flex justify-content-between'>
            <h4>
              <FormattedMessage id='Overview information' />
            </h4>
            <div>
              <FormattedMessage id='Data update time:' />
              &nbsp;
              {latestMonitoringData?.length > 0
               ? moment(Number(latestMonitoringData[0].createDate)).format(DISPLAY_DATE_TIME_FORMAT)
               : ''}
              <Button.Ripple
                id='btnRefreshLatestParams'
                className='btn-icon'
                color='flat-success'
                onClick={() => fetchLatestMonitoringData()}
              >
                <RefreshCw size={16} />
              </Button.Ripple>
              <UncontrolledTooltip placement='bottom' target='btnRefreshLatestParams'>
                <FormattedMessage id='Refresh' />
              </UncontrolledTooltip>
            </div>
          </Col>
        </Row>
        <Row className='measuring__row mb-1'>{renderParams(overviewParams)}</Row>
        <Row className='mb-1'>
          <Col>
            <h4>
              <FormattedMessage id='MPPT information' />
            </h4>
          </Col>
        </Row>
        <Row className='measuring__row mb-1'>{renderParams(mPPTParams)}</Row>
        {
          isOpenChartModal &&
          <ChartModal
            toggle={() => setIsOpenChartModal(!isOpenChartModal)}
            isOpen={isOpenChartModal}
            selectedParam={selectedParam}
          />
        }
      </CardBody>
    </Card>
  )
}

MeasuringPointParameter.propTypes = {}

export default MeasuringPointParameter
