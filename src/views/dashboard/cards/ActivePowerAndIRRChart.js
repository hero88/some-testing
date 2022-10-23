// ** React Imports
import { useState } from 'react'

// ** Third party components
import { Card } from 'reactstrap'
import { injectIntl } from 'react-intl'
import ReactECharts from 'echarts-for-react'
import PropTypes from 'prop-types'

import { numberWithCommas } from '@utils'
import { useSelector } from 'react-redux'

const ActivePowerAndIRRChart = ({
  intl,
  activePowerData,
  irrData,
  timeData,
  isLoading
}) => {
  const { layout: { skin } } = useSelector(state => state)
  const powerName = 'AC INV',
    irrName = intl.formatMessage({ id: 'Irradiation' })
  const [legends] = useState([powerName, irrName])
  const powerColor = '#048ABF',
    effColor = '#79D414'

  const textColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b'
  const splitLineColor = skin === 'dark' ? '#3D4457' : '#CCCCCC'
  const options = {
    grid: {
      top: '50px',
      bottom: '50px',
      left: '80px',
      right: '80px',
      height: 'auto'
    },
    legend: {
      data: legends,
      textStyle: {
        color: textColor
      },
      top: 'bottom',
      icon: 'roundRect'
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
        filterMode: 'filter',
        show: false
      }
    ],
    xAxis: {
      type: 'category',
      data: timeData,
      splitLine: {
        show: false,
        lineStyle: {
          color: splitLineColor
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: `MW`,
        position: 'right',
        scale: true,
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: powerColor
          }
        },
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: splitLineColor
          }
        }
      },
      {
        type: 'value',
        name: `W/m²`,
        position: 'left',
        scale: true,
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: effColor
          }
        },
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: powerName,
        data: activePowerData,
        type: 'line',
        smooth: false,
        showSymbol: false,
        itemStyle: {
          color: powerColor
        },
        lineStyle: {
          color: powerColor
        },
        yAxisIndex: 0
      },
      {
        name: irrName,
        data: irrData,
        type: 'line',
        smooth: false,
        showSymbol: false,
        itemStyle: {
          color: effColor
        },
        lineStyle: {
          color: effColor
        },
        yAxisIndex: 1
      }
    ],
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

          if (index === params.length - 1) {
            template =
              template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> W/m²`)
          } else {
            template =
              template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> MW<br/>`)
          }
        })

        return template
      }
    }
  }

  return (
    <Card className='power-irr-chart-card'>
      <ReactECharts
        className='react-echarts react-echarts--dashboard'
        option={options}
        showLoading={isLoading}
      />
    </Card>
  )
}

ActivePowerAndIRRChart.propTypes = {
  intl: PropTypes.object.isRequired,
  timeData: PropTypes.array.isRequired,
  activePowerData: PropTypes.array.isRequired,
  irrData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default injectIntl(ActivePowerAndIRRChart)
