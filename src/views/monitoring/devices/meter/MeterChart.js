import { useDispatch, useSelector } from 'react-redux'
import ReactECharts from 'echarts-for-react'
import { Button, Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BarChart2, Calendar, List, RefreshCw, Search } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { FormattedMessage, injectIntl } from 'react-intl'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import PropTypes from 'prop-types'
import { getAllMonitoringMeters } from '@src/views/monitoring/devices/meter/store/actions'
import { useQuery } from '@hooks/useQuery'
import { numberWithCommas } from '@utils'

const MeterChart = ({ intl, fieldParam, unit }) => {
  const dispatch = useDispatch(),
    {
      layout: { skin },
      monitoringMeter: store
    } = useSelector((state) => state),
    query = useQuery(),
    deviceId = query.get('deviceId')
  const [picker, setPicker] = useState([new Date(), new Date()]),
    [isDisplayTable, setIsDisplayTable] = useState(false),
    [timeLabels, setTimeLabel] = useState([]),
    [legends, setLegends] = useState([]),
    [series, setSeries] = useState([]),
    [samplingTime, setSamplingTime] = useState(5)

  const fetchMonitoringData = (params) => {
    dispatch(
      getAllMonitoringMeters({
        ...store.params,
        rowsPerPage: 500,
        fromDate: moment(picker[0]).startOf('d').valueOf(),
        toDate: moment(picker[1]).endOf('d').valueOf(),
        monitoringType: 'sungrowMeter',
        seconds: samplingTime,
        order: 'createDate asc',
        graphKeys: [
          'totalActiveEnergy',
          'totalActiveEnergySub',
          'realActivePower_3SubphaseTotal',
          'realReactivePower_3SubphaseTotal',
          'voltagePhaseA',
          'voltagePhaseB',
          'voltagePhaseC',
          'currentPhaseA',
          'currentPhaseB',
          'currentPhaseC',
          'totalPowerFactor'
        ],
        deviceId,
        ...params
      })
    )
  }

  useEffect(() => {
    fetchMonitoringData()
  }, [])

  // ** Component did mount
  useEffect(() => {
    if (store.allData) {
      const tempTimeLabels = [],
        tempLegends = [],
        tempSeries = []

      const requiredKeys = fieldParam
        ? [fieldParam]
        : [
            'realActivePower_3SubphaseTotal',
            'realReactivePower_3SubphaseTotal',
            'voltagePhaseA',
            'voltagePhaseB',
            'voltagePhaseC',
            'currentPhaseA',
            'currentPhaseB',
            'currentPhaseC',
            'totalPowerFactor'
          ]

      store.allData.forEach((item) => {
        tempTimeLabels.push(moment(Number(item.date)).format(DISPLAY_DATE_TIME_FORMAT))
      })

      requiredKeys.forEach((key) => {
        const tempData = []
        let tempName = ''
        tempLegends.push(intl.formatMessage({ id: key || 'None' }))

        store.allData.forEach((item) => {
          if (item[key] >= 0) {
            tempName = intl.formatMessage({ id: key || 'None' })
          }

          if (key !== 'totalPowerFactor' && (key.includes('Power') || key.includes('ActiveEnergy'))) {
            tempData.push(item[key] / 1000 || 0)
          } else {
            tempData.push(item[key] || 0)
          }
        })

        tempSeries.push({
          name: tempName,
          data: tempData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          yAxisIndex: fieldParam
            ? 0
            : key.includes('totalPowerFactor')
            ? 3
            : key.includes('current')
            ? 2
            : key.includes('voltage')
            ? 1
            : 0
        })
      })

      setTimeLabel(tempTimeLabels)
      setLegends(tempLegends)
      setSeries(tempSeries)
    }
  }, [store.allData])

  const options = {
    grid: {
      top: '80px',
      bottom: '80px',
      left: fieldParam ? '100px' : '130px',
      right: fieldParam ? '100px' : '130px',
      height: 'auto'
    },
    legend: {
      data: legends,
      textStyle: {
        color: skin === 'dark' ? '#b4b7bd' : '#6e6b7b'
      }
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 20
      },
      {
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'filter'
      }
    ],
    xAxis: {
      type: 'category',
      data: timeLabels
    },
    yAxis: [
      {
        type: 'value',
        name: fieldParam
          ? `${intl.formatMessage({ id: fieldParam })}: ${unit}`
          : `${intl.formatMessage({ id: 'Power' })}: KW`,
        position: 'left',
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: `{value} ${fieldParam === 'totalPowerFactor' ? '' : unit ? unit : 'KW'}`
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: `${intl.formatMessage({ id: 'Voltage' })}: V`,
        show: !fieldParam,
        offset: 80,
        position: 'right',
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#91CC75'
          }
        },
        axisLabel: {
          formatter: '{value} V'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: `${intl.formatMessage({ id: 'Current' })}: A`,
        show: !fieldParam,
        position: 'right',
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c975cc'
          }
        },
        axisLabel: {
          formatter: '{value} A'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: 'cos φ',
        show: !fieldParam,
        position: 'left',
        offset: 80,
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#c975cc'
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    series,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      // Custom tooltip
      formatter: (params) => {
        let template = ''

        params.forEach((param, index) => {
          if (index === 0) {
            template = template.concat(`${param.name}<br/>`)
          }

          if (fieldParam) {
            template = template.concat(
              `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${unit}`
            )
          } else {
            if (param.seriesIndex === 0) {
              template = template.concat(
                `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> kW<br/>`
              )
            }

            if (param.seriesIndex === 1) {
              template = template.concat(
                `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> kVAR<br/>`
              )
            }

            if (param.seriesIndex >= 2 && param.seriesIndex <= 4) {
              template = template.concat(
                `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> V<br/>`
              )
            }

            if (param.seriesIndex >= 5 && param.seriesIndex <= 7) {
              template = template.concat(
                `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> A<br/>`
              )
            }

            if (param.seriesIndex === 8) {
              template = template.concat(
                `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong>`
              )
            }
          }
        })

        return template
      }
    }
  }

  const timeOptions = [
    { value: 5, label: `5 ${intl.formatMessage({ id: 'min' })}` },
    { value: 15, label: `15 ${intl.formatMessage({ id: 'min' })}` },
    { value: 30, label: `30 ${intl.formatMessage({ id: 'min' })}` },
    { value: 60, label: `60 ${intl.formatMessage({ id: 'min' })}` }
  ]

  // Close date picker
  const handleCloseDatePicker = async (selectedDates) => {
    const tempDates = []

    if (selectedDates && selectedDates.length === 1) {
      tempDates.push(...selectedDates, ...selectedDates)
    } else if (selectedDates && selectedDates.length === 2) {
      tempDates.push(...selectedDates)
    }

    setPicker(tempDates)
  }

  const filterByDate = () => {
    if (picker && picker.length === 2) {
      fetchMonitoringData({
        fromDate: moment(picker[0]).startOf('d').valueOf(),
        toDate: moment(picker[1]).endOf('d').valueOf()
      })
    }
  }

  const onChangeSelectTime = (event) => {
    setSamplingTime(event.value * 60)
    fetchMonitoringData({ seconds: event.value * 60 })
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">
          <Button.Ripple className="btn-icon ml-1" color="flat-primary">
            <Calendar size={16} />
          </Button.Ripple>
          <Flatpickr
            value={picker}
            onClose={handleCloseDatePicker}
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
              maxDate: moment().endOf('d').valueOf()
            }}
            className="form-control w-50"
          />
          <CreatableSelect
            name="samplingTime"
            options={timeOptions}
            defaultValue={timeOptions[0]}
            className="react-select project-select"
            classNamePrefix="select"
            onChange={onChangeSelectTime}
          />
          <Button.Ripple className="btn-icon ml-1" color="primary" outline onClick={filterByDate}>
            <Search size={16} />
          </Button.Ripple>
        </div>

        <Button.Ripple
          className='btn-icon d-none'
          color='flat-primary'
          id='btnToggleDisplay'
          onClick={() => setIsDisplayTable(!isDisplayTable)}
        >
          {isDisplayTable ? <BarChart2 size={16} /> : <List size={16} />}
        </Button.Ripple>
        <UncontrolledTooltip placement='bottom' target='btnToggleDisplay'>
          <FormattedMessage id={isDisplayTable ? 'Change to Chart display' : 'Change to Table display'} />
        </UncontrolledTooltip>
        <Button.Ripple
          className='btn-icon'
          color='flat-primary'
          id='btnRefreshChart'
          onClick={() => fetchMonitoringData()}
        >
          <RefreshCw size={16} />
        </Button.Ripple>
        <UncontrolledTooltip placement='bottom' target='btnRefreshChart'>
          <FormattedMessage id='Refresh' />
        </UncontrolledTooltip>
      </CardHeader>
      <CardBody>
        {isDisplayTable ? <div>Table Display</div> : <ReactECharts className='react-echarts' option={options} />}
      </CardBody>
    </Card>
  )
}

MeterChart.propTypes = {
  intl: PropTypes.object.isRequired,
  fieldParam: PropTypes.string,
  unit: PropTypes.string
}

export default injectIntl(MeterChart)
