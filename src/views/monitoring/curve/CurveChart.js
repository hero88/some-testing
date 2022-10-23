import { useSelector } from 'react-redux'
import ReactECharts from 'echarts-for-react'
import { Button, ButtonGroup, Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BarChart2, Calendar, List, RefreshCw, Search } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { FormattedMessage, injectIntl } from 'react-intl'
import CreatableSelect from 'react-select/creatable/dist/react-select.esm'
import PropTypes from 'prop-types'

const CurveChart = ({ intl, isParam, selectedParam }) => {
  const { skin } = useSelector((state) => state.layout)
  const time = moment(),
    [picker, setPicker] = useState(new Date()),
    [isDisplayTable, setIsDisplayTable] = useState(false)

  const renderTimeLabels = () => [...Array(16)].map(() => time.add(1, 'h').format('YYYY-MM-DD HH:mm'))

  const renderRandomVoltages = () => [...Array(16)].map((_, i) => {
      if (i < 5) return 0

      return Number((
        225.0 + Math.random()
      )?.toFixed(2))
    })

  const renderRandomCurrents = () => [...Array(16)].map((_, i) => {
      if (i < 7) return 0

      return Number((
        4.0 + (
          Math.random() * i)
      )?.toFixed(2))
    })

  const [phaseAVoltages, setPhaseAVoltages] = useState([]),
    [phaseBVoltages, setPhaseBVoltages] = useState([]),
    [phaseCVoltages, setPhaseCVoltages] = useState([]),
    [phaseACurrents, setPhaseACurrents] = useState([]),
    [phaseBCurrents, setPhaseBCurrents] = useState([]),
    [phaseCCurrents, setPhaseCCurrents] = useState([]),
    [totalActivePowers, setTotalActivePowers] = useState([])

  // Component did mount
  useEffect(() => {
    setPhaseAVoltages(renderRandomVoltages())
    setPhaseBVoltages(renderRandomVoltages())
    setPhaseCVoltages(renderRandomVoltages())

    setPhaseACurrents(renderRandomCurrents())
    setPhaseBCurrents(renderRandomCurrents())
    setPhaseCCurrents(renderRandomCurrents())
  }, [])

  const calculateTotalActivePowers = () => {
    let totalActivePower = 0

    return phaseAVoltages.map((phaseAVoltage, index) => {
      const averageVoltage = (
        phaseAVoltage + phaseBVoltages[index] + phaseCVoltages[index]
      ) / 3
      const averageCurrent = (
        phaseACurrents[index] + phaseBCurrents[index] + phaseCCurrents[index]
      ) / 3
      totalActivePower +=
        Number((
          (
            Math.sqrt(3) * averageVoltage * averageCurrent
          ) / 1000
        )?.toFixed(3))

      return Number(totalActivePower?.toFixed(3))
    })
  }

  useEffect(() => {
    if (
      phaseACurrents.length &&
      phaseBCurrents.length &&
      phaseCCurrents.length &&
      phaseAVoltages.length &&
      phaseBVoltages.length &&
      phaseCVoltages.length
    ) {
      setTotalActivePowers(calculateTotalActivePowers())
    }
  }, [phaseAVoltages, phaseBVoltages, phaseCVoltages, phaseACurrents, phaseBCurrents, phaseCCurrents])

  const options = {
    grid: {
      top: '60px',
      bottom: '80px',
      left: '80px',
      right: '80px',
      height: 'auto'
    },
    legend: {
      data: [
        'Total Active Power',
        'Phase A Voltage',
        'Phase B Voltage',
        'Phase C Voltage',
        'Phase A Current',
        'Phase B Current',
        'Phase C Current'
      ],
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
      data: renderTimeLabels()
    },
    yAxis: [
      {
        type: 'value',
        name: 'Unit: kW',
        min: 0,
        max: Math.round(Math.max(...totalActivePowers) + 10),
        interval: 10,
        position: 'left',
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: '{value} kW'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: 'Unit: V',
        min: 0,
        max: 250,
        interval: 50,
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
      }
    ],
    series: [
      {
        name: 'Total Active Power',
        data: totalActivePowers,
        type: 'line',
        smooth: true,
        yAxisIndex: 0
      },
      {
        name: 'Phase A Voltage',
        data: phaseAVoltages,
        type: 'line',
        smooth: true,
        yAxisIndex: 1
      },
      {
        name: 'Phase B Voltage',
        data: phaseBVoltages,
        type: 'line',
        smooth: true,
        yAxisIndex: 1
      },
      {
        name: 'Phase C Voltage',
        data: phaseCVoltages,
        type: 'line',
        smooth: true,
        yAxisIndex: 1
      },
      {
        name: 'Phase A Current',
        data: phaseACurrents,
        type: 'line',
        smooth: true,
        yAxisIndex: 0
      },
      {
        name: 'Phase B Current',
        data: phaseBCurrents,
        type: 'line',
        smooth: true,
        yAxisIndex: 0
      },
      {
        name: 'Phase C Current',
        data: phaseCCurrents,
        type: 'line',
        smooth: true,
        yAxisIndex: 0
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    }
  }

  const paramOptions = {
    grid: {
      top: '60px',
      bottom: '80px',
      left: '80px',
      right: '80px',
      height: 'auto'
    },
    legend: {
      data: [`${selectedParam ? selectedParam.title : ''}`],
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
      data: renderTimeLabels()
    },
    yAxis: [
      {
        type: 'value',
        name: `Unit: ${selectedParam ? selectedParam.unit : ''}`,
        min: 0,
        max: Math.round(Math.max(...totalActivePowers) + 10),
        interval: 10,
        position: 'left',
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: `{value} ${selectedParam ? selectedParam.unit : ''}`
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: `${selectedParam ? selectedParam.title : ''}`,
        data: totalActivePowers,
        type: 'line',
        smooth: true,
        yAxisIndex: 0
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    }
  }

  const timeOptions = [
    { value: 1, label: `10 ${intl.formatMessage({ id: 's' })}` },
    { value: 2, label: `5 ${intl.formatMessage({ id: 'min' })}` },
    { value: 3, label: `15 ${intl.formatMessage({ id: 'min' })}` },
    { value: 4, label: `30 ${intl.formatMessage({ id: 'min' })}` },
    { value: 5, label: `60 ${intl.formatMessage({ id: 'min' })}` }
  ]

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between'>
        <div className='d-flex justify-content-start'>
          <Button.Ripple className='btn-icon ml-1' color='flat-primary'>
            <Calendar size={16} />
          </Button.Ripple>
          <Flatpickr
            value={picker}
            onChange={(date) => setPicker(date)}
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y'
            }}
            className='form-control w-50'
          />
          <CreatableSelect options={timeOptions} className='react-select project-select' classNamePrefix='select' />
          <Button.Ripple className='btn-icon ml-1' color='primary' outline>
            <Search size={16} />
          </Button.Ripple>
        </div>

        <ButtonGroup>
          <Button.Ripple color='primary' outline>
            <FormattedMessage id='Template library' />
          </Button.Ripple>
          <Button.Ripple color='primary' outline>
            <FormattedMessage id='Save template' />
          </Button.Ripple>
          <Button.Ripple
            className='btn-icon'
            color='flat-primary'
            id='btnToggleDisplay'
            onClick={() => setIsDisplayTable(!isDisplayTable)}
          >
            {isDisplayTable ? <BarChart2 size={16} /> : <List size={16} />}
          </Button.Ripple>
          <UncontrolledTooltip placement='bottom' target='btnToggleDisplay'>
            <FormattedMessage id={isDisplayTable ? 'Change to Chart display' : 'Change to Table display'} />
          </UncontrolledTooltip>
          <Button.Ripple className='btn-icon' color='flat-primary' id='btnRefreshChart'>
            <RefreshCw size={16} />
          </Button.Ripple>
          <UncontrolledTooltip placement='bottom' target='btnRefreshChart'>
            <FormattedMessage id='Refresh' />
          </UncontrolledTooltip>
        </ButtonGroup>
      </CardHeader>
      <CardBody>
        {isDisplayTable ? (
          <div>Table Display</div>
        ) : (
          <ReactECharts className='react-echarts' option={isParam ? paramOptions : options} />
        )}
      </CardBody>
    </Card>
  )
}

CurveChart.propTypes = {
  intl: PropTypes.object.isRequired,
  isParam: PropTypes.bool,
  selectedParam: PropTypes.object
}

export default injectIntl(CurveChart)
