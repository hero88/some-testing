import moment from 'moment'
import PropTypes from 'prop-types'
import { Card } from 'reactstrap'
import ReactECharts from 'echarts-for-react'
import { numberWithCommas } from '@utils'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const SevenDayYieldChart = ({ totalYield7DaysByProvince, setSelectedProjectIds }) => {
  const { layout: { skin } } = useSelector(state => state)
  const splitLineColor = skin === 'dark' ? '#3D4457' : '#CCCCCC'
  const [selectedLegend, setSelectedLegend] = useState(totalYield7DaysByProvince.reduce((a, v) => (
    { ...a, [v.name]: true }
  ), {}))

  const renderTimeLabels = () => {
    const tempLabels = []
    for (let i = 6; i >= 0; i--) {
      tempLabels.push(moment().subtract(i, 'day').format('D/M'))
    }

    return tempLabels
  }

  const renderColors = () => {
    const colors = [
      '#F8B48F', '#FAD38E', '#B2C8D6', '#8DCDFA', '#A6CDE2',
      '#F26F2A', '#F5AC27', '#6C96B0', '#26A0F6', '#559FC8',
      '#A84009', '#AB7007', '#3E5F74', '#0667AC', '#2B6686',
      '#431903', '#442C02', '#18262e', '#022944', '#112935'
    ]

    if (totalYield7DaysByProvince?.length > 0) {
      return totalYield7DaysByProvince.map((item, index) => {
        return colors[index % 20]
      })
    }

    return ['rgba(3, 103, 165, 1)']
  }

  const renderLegends = (items) => {
    return items.map(item => item.name)
  }

  const renderSeries = (series) => {
    const colors = renderColors()
    return series.map((serie, index, originSeries) => {
      return {
        name: serie.name,
        data: serie.data,
        type: 'bar',
        stack: originSeries[0].name,
        smooth: false,
        showSymbol: false,
        itemStyle: {
          color: colors[index]
        },
        lineStyle: {
          color: colors[index]
        },
        yAxisIndex: 0
      }
    })
  }

  const options = {
    grid: {
      top: '50px',
      bottom: '50px',
      left: '80px',
      right: '80px',
      height: 'auto'
    },
    legend: {
      data: renderLegends(totalYield7DaysByProvince),
      selected: selectedLegend,
      textStyle: {
        color: renderColors()
      },
      top: 'bottom',
      icon: 'roundRect',
      type: 'scroll'
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
      data: renderTimeLabels(),
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: skin === 'dark' ? '#838A9C' : '#000000'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'MWh',
        position: 'left',
        scale: true,
        min: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: skin === 'dark' ? '#838A9C' : '#000000'
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
      }
    ],
    series: renderSeries(totalYield7DaysByProvince),
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
            template = template.concat(`<strong>${param.name}</strong><hr>`)
          }

          if (index === params.length - 1) {
            template =
              template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> MWh`)
          } else {
            template =
              template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> MWh<br/>`)
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
        notMerge
        lazyUpdate
        onEvents={{
          legendselectchanged: (params) => {
            const tempSelectedProjectIds = []

            totalYield7DaysByProvince.forEach(province => {
              if (params.selected[province.name] && Array.isArray(province.projectIds)) {
                tempSelectedProjectIds.push(...province.projectIds)
              }
            })

            setSelectedProjectIds(tempSelectedProjectIds)
            setSelectedLegend(params.selected)
          }
        }}
      />
    </Card>
  )
}

SevenDayYieldChart.propTypes = {
  totalYield7DaysByProvince: PropTypes.array.isRequired,
  setSelectedProjectIds: PropTypes.func.isRequired
}

export default SevenDayYieldChart
