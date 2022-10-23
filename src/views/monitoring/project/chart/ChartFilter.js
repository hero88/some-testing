import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import PropTypes from 'prop-types'
import AppCollapse from '@components/app-collapse'
import {
  Button,
  Col,
  CustomInput
} from 'reactstrap'
import {
  API_MONITORING_CHART_TYPE,
  CHART_PARAM_TYPE,
  CHART_TYPE,
  STATISTICAL_PATTERN_TYPE
} from '@constants/common'
import React from 'react'
import {
  METER_TYPE,
  TYPE_MODEL
} from '@constants/project'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  addChartParam,
  getProjectChartData,
  removeChartParam
} from '@src/views/monitoring/projects/store/actions'
import { randomColor } from '@utils'
import smaInverterParams from './params/SMAInverterParams'
import sungrowInverterParams from './params/SungrowInverterParams'

const ChartFilter = ({ intl, project, inverters, meters }) => {
  const dispatch = useDispatch(),
    {
      customerProject: { chart }
    } = useSelector(state => state)

  const addParam = (item) => {
    dispatch(addChartParam(item))
  }

  const removeParam = (item) => {
    dispatch(removeChartParam(item))
  }

  const renderItems = (items) => <AppCollapse data={items}/>

  const renderCheckboxItems = ({ items, parentId, data }) => (
    items.map((item, index) => {
      const currentData = {
        ...data,
        ...item,
        display: randomColor(),
        measuringPoint: `${data.name} / ${intl.formatMessage({ id: item.title })}`,
        paramId: `${parentId}_${item.key}`,
        projectId: project.id
      }

      return (
        <CustomInput
          key={index}
          type='checkbox'
          className='custom-control-Primary'
          checked={chart.paramData.findIndex(param => param.paramId === `${parentId}_${item.key}`) > -1}
          value={`${parentId}_${item.key}`}
          onChange={(e) => {
            e.target.checked
              ? addParam(currentData)
              : removeParam(currentData)
          }}
          id={`${parentId}_${item.key}`}
          label={intl.formatMessage({ id: item.title })}
        />
      )
    })
  )

  const solarMeterParams = [
      {
        title: 'Cos phi',
        key: 'cosphi',
        unit: '',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Daily yield',
        key: 'dailyYield',
        unit: 'kWh',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase A voltage',
        key: 'phaseAVoltage',
        unit: 'V',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase B voltage',
        key: 'phaseBVoltage',
        unit: 'V',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase C voltage',
        key: 'phaseCVoltage',
        unit: 'V',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase A current',
        key: 'phaseACurrent',
        unit: 'A',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase B current',
        key: 'phaseBCurrent',
        unit: 'A',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase C current',
        key: 'phaseCCurrent',
        unit: 'A',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Active power',
        key: 'activePower',
        unit: 'kW',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Reactive power',
        key: 'reactivePower',
        unit: 'kVAr',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      }
    ],
    gridMeterParams = [
      {
        title: 'Cos phi',
        key: 'cosphi',
        unit: '',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase A voltage',
        key: 'phaseAVoltage',
        unit: 'V',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase B voltage',
        key: 'phaseBVoltage',
        unit: 'V',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase C voltage',
        key: 'phaseCVoltage',
        unit: 'V',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase A current',
        key: 'phaseACurrent',
        unit: 'A',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase B current',
        key: 'phaseBCurrent',
        unit: 'A',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Phase C current',
        key: 'phaseCCurrent',
        unit: 'A',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Push grid yield',
        key: 'pushGridYield',
        unit: 'kWh',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Pull grid yield',
        key: 'pullGridYield',
        unit: 'kWh',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Active power',
        key: 'activePower',
        unit: 'kW',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      },
      {
        title: 'Reactive power',
        key: 'reactivePower',
        unit: 'kVAr',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
        monitoringType: 'sungrowMeter'
      }
    ],
    projectParams = [
      {
        title: 'Daily yield',
        key: 'dailyYield',
        unit: 'kWh',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      },
      {
        title: 'Project PR',
        key: 'PR',
        unit: '%',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      },
      {
        title: 'Irradiation',
        key: 'IRR',
        unit: 'W/m2',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      },
      {
        title: 'Irradiation yield',
        key: 'irrYield',
        unit: 'kWh',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      },
      {
        title: 'Active power',
        key: 'activePower',
        unit: 'kW',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      },
      {
        title: 'Reactive power',
        key: 'reactivePower',
        unit: 'kVAr',
        multiply: 1000,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      },
      {
        title: 'PV temperature',
        key: 'pvTemperature',
        unit: '°C',
        multiply: 1,
        type: CHART_TYPE.BAR,
        pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
      }
    ]

  const renderInverterData = (items) => (
    items.map((item) => {
      const filteredParams = item.typeModel === TYPE_MODEL.SMA
        ? smaInverterParams.filter(param => {
          if (param.mpptPosition) {
            return param.mpptPosition <= item?.inverterType?.numberOfMPPT
          }

          if (param.stringPosition) {
            return param?.stringPosition <= item?.inverterType?.numberOfStringPerMPPT * item?.inverterType?.numberOfMPPT
          }

          return true
        })
        : sungrowInverterParams.filter(param => {
          if (param.mpptPosition) {
            return param.mpptPosition <= item?.inverterType?.numberOfMPPT
          }

          if (param.stringPosition) {
            return param?.stringPosition <= item?.inverterType?.numberOfStringPerMPPT * item?.inverterType?.numberOfMPPT
          }

          return true
        })

      return (
        {
          title: item.name,
          content: renderCheckboxItems({
            items: filteredParams,
            parentId: item.id,
            data: {
              deviceId: item.id,
              name: item.name,
              paramType: CHART_PARAM_TYPE.DEVICE
            }
          })
        }
      )
    })
  )

  const renderMeterData = (items) => (
    items.map((item) => {
      return (
        {
          title: item.name,
          content: renderCheckboxItems(
            {
              items: item.meterNetworkPlace === METER_TYPE.GRID
                ? gridMeterParams
                : solarMeterParams,
              parentId: item.id,
              data: {
                deviceId: item.id,
                name: item.name,
                paramType: CHART_PARAM_TYPE.DEVICE
              }
            }
          )
        }
      )
    })
  )

  const inverterData = renderInverterData(inverters),
    meterData = renderMeterData(meters),
    data = [
      { title: intl.formatMessage({ id: 'Inverter' }), content: renderItems(inverterData) },
      { title: intl.formatMessage({ id: 'Meter' }), content: renderItems(meterData) },
      {
        title: intl.formatMessage({ id: 'Project' }),
        content: renderCheckboxItems({
          items: projectParams,
          parentId: 'project',
          data: {
            projectId: project.id,
            name: project.name,
            paramType: CHART_PARAM_TYPE.PROJECT
          }
        })
      }
    ]

  return <>
    <Col className='report-filter chart-filter'>
      <AppCollapse data={data}/>
    </Col>
    <Button.Ripple
      color='primary'
      className='col-md-12'
      onClick={() => {
        if (chart.paramData.length) {
          chart.paramData.forEach(param => {
            dispatch(getProjectChartData({
              chartType: API_MONITORING_CHART_TYPE.COMMON,
              projectId: param.projectId,
              deviceId: param.deviceId,
              monitoringType: param.monitoringType,
              seconds: chart.seconds,
              timeStep: chart.timeStep,
              timeUnit: chart.timeUnit,
              fromDate: chart.fromDate,
              toDate: chart.toDate,
              order: 'createDate asc',
              fields: [param.key],
              paramId: param.paramId,
              paramType: param.paramType,
              multiply: param.multiply
            }))
          })
        }
      }}
      disabled={chart.paramData.length < 1}
    >
      <FormattedMessage id='View chart'/>
    </Button.Ripple>
  </>
}

ChartFilter.propTypes = {
  intl: PropTypes.object,
  project: PropTypes.object.isRequired,
  inverters: PropTypes.array.isRequired,
  meters: PropTypes.array.isRequired
}

export default injectIntl(ChartFilter)
