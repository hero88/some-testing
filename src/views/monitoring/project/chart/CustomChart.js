import { useSelector } from 'react-redux'
import ReactECharts from 'echarts-for-react'
import {
  useEffect,
  useState
} from 'react'
import {
  calculateDiffInArray,
  numberWithCommas
} from '@utils'
import { STATISTICAL_PATTERN_TYPE } from '@constants/common'

const CustomChart = () => {
  const { layout: { skin }, customerProject: { chart } } = useSelector((state) => state)

  const [options, setOptions] = useState({
    grid: {
      top: '60px',
      bottom: '80px',
      left: '80px',
      right: '80px',
      height: 'auto'
    },
    legend: {
      data: [],
      textStyle: {
        color: skin === 'dark'
          ? '#b4b7bd'
          : '#6e6b7b'
      },
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
        filterMode: 'filter'
      }
    ],
    xAxis: {
      type: 'category',
      data: chart.dataObj.timeLabel
    },
    yAxis: [
      {
        type: 'value',
        name: 'kW',
        position: 'left',
        scale: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: 'V',
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
          formatter: '{value}'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      // Custom tooltip
      formatter: (params) => {
        let template = ''

        params.forEach((param, index) => {
          const tempUnit = chart?.paramData?.[param.seriesIndex]?.unit || ''

          if (index === 0) {
            template = template.concat(`${param.name}<br/>`)
          }

          if (index === params.length - 1) {
            template =
              template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${tempUnit}`)
          } else {
            template =
              template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${tempUnit}<br/>`)
          }
        })

        return template
      }
    }
  })

  useEffect(() => {
    const renderLegends = (data) => {
      return data.map(item => item.measuringPoint)
    }

    const renderSeries = (series) => {
      return series.map(serie => {
        const tempChartData = chart.dataObj[serie.paramId]

        return (
          {
            name: serie.measuringPoint,
            data: serie.pattern === STATISTICAL_PATTERN_TYPE.DIFFERENCE
              ? calculateDiffInArray(tempChartData)
              : tempChartData,
            type: serie.type,
            smooth: false,
            yAxisIndex: serie.key.toLowerCase().includes('voltage')
              ? 1
              : 0,
            lineStyle: {
              color: serie.display
            },
            itemStyle: {
              color: serie.display
            }
          }
        )
      })
    }
    setOptions(state => ({
      ...state,
      grid: {
        top: '60px',
        bottom: '80px',
        left: '80px',
        right: '80px',
        height: 'auto'
      },
      legend: {
        data: renderLegends(chart.paramData),
        textStyle: {
          color: skin === 'dark'
            ? '#b4b7bd'
            : '#6e6b7b'
        },
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
          filterMode: 'filter'
        }
      ],
      xAxis: {
        type: 'category',
        data: chart.dataObj.timeLabel
      },
      yAxis: [
        {
          type: 'value',
          name: 'kW',
          position: 'left',
          scale: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5470C6'
            }
          },
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: 'V',
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
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: renderSeries(chart.paramData),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        // Custom tooltip
        formatter: (params) => {
          let template = ''

          params.forEach((param, index) => {
            const tempUnit = chart?.paramData?.[param.seriesIndex]?.unit || ''

            if (index === 0) {
              template = template.concat(`${param.name}<br/>`)
            }

            if (index === params.length - 1) {
              template =
                template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${tempUnit}`)
            } else {
              template =
                template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${tempUnit}<br/>`)
            }
          })

          return template
        }
      }
    }))
  }, [chart])

  return (
    <ReactECharts
      className='react-echarts'
      option={options}
      notMerge
    />
  )
}

CustomChart.propTypes = {}

export default CustomChart
