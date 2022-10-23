import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import PropTypes from 'prop-types'

const PieChart = ({ percentage = 0 }) => {
  const option = {
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['85%', '100%'],
        avoidLabelOverlap: false,
        startAngle: 0,
        clockWise: false,
        label: {
          show: false,
          position: 'center',
          fontSize: '20',
          fontWeight: 'bold',
          color: '#02F79C',
          formatter: () => {
            return `${percentage}%\n\nAC/DC`
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: percentage,
            name: '',
            itemStyle: {
              normal: {
                //color gradient
                color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
                  { offset: 0.1, color: 'rgba(0, 0, 0, 0.4)' },
                  { offset: 0.3, color: '#02F79C' },
                  { offset: 0.9, color: '#03AEF6' }
                ])
              }
            }
          },
          {
            value: 100 - percentage,
            name: '',
            itemStyle: {
              normal: {//color gradient
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [{offset: 1, color: '#C8DAF1'}]
                )
              }
            }
          }
        ]
      }
    ]
  }

  return (
    <ReactECharts
      option={option}
    />
  )
}

PieChart.propTypes = {
  percentage: PropTypes.number.isRequired
}

export default PieChart
