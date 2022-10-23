import ReactECharts from 'echarts-for-react'
import { Card } from 'reactstrap'
import PropTypes from 'prop-types'
import { numberWithCommas } from '@utils'
import { FormattedMessage } from 'react-intl'
import _isNumber from 'lodash/isNumber'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const PowerGauge = ({ percentageValue, currentValue, maxValue, lastUpdate }) => {
  const redColor = '#EF0606'
  const orangeColor = '#fd5b34'
  const yellowColor = '#f6d507'
  const greenColor = '#32CD32'

  const [projectPerformance, setProjectPerformance] = useState(percentageValue)

  const renderColorForProgress = () => {
    if (percentageValue > 80) {
      return greenColor
    }

    if (percentageValue > 60) {
      return yellowColor
    }

    if (percentageValue > 40) {
      return orangeColor
    }

    if (percentageValue >= 0) {
      return redColor
    }
  }

  const renderProgressColor = () => {
    const roundCurrentValue = currentValue,
      roundMaxValue = Math.ceil(maxValue / 100) * 100

    if (roundCurrentValue > 0.8 * roundMaxValue) {
      return greenColor
    }

    if (roundCurrentValue > 0.6 * roundMaxValue) {
      return yellowColor
    }

    if (roundCurrentValue > 0.4 * roundMaxValue) {
      return orangeColor
    }

    if (roundCurrentValue >= 0) {
      return redColor
    }
  }

  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '70%',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: Math.ceil(maxValue / 100) * 100,
        splitNumber: 10,
        itemStyle: {
          color: renderColorForProgress()
        },
        progress: {
          show: true,
          width: 25,
          itemStyle: {
            color: renderProgressColor()
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            width: 0,
            color: [
              [0.3, redColor],
              [0.5, orangeColor],
              [0.7, yellowColor],
              [1, greenColor]
            ]
          }
        },
        axisTick: {
          distance: -10,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: 'inherit'
          }
        },
        splitLine: {
          distance: -15,
          length: 10,
          lineStyle: {
            width: 3,
            color: 'auto'
          }
        },
        axisLabel: {
          distance: -35,
          color: 'inherit',
          fontSize: 12
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 25,
          fontWeight: 'bolder',
          formatter: `\n${numberWithCommas(currentValue, 0)} kW`,
          color: 'inherit'
        },
        data: [
          {
            value: currentValue
          }
        ]
      }
    ]
  }

  useEffect(() => {
    setProjectPerformance(percentageValue)
  }, [percentageValue, currentValue, maxValue, lastUpdate])

  return (
    <Card className='power-gauge-card'>
      <ReactECharts
        // className='react-echarts'
        style={{
          height: 'calc(100%)',
          width: 'calc(100%)',
          top: 'calc(50%)',
          left: 'calc(50%)'
        }}
        option={option}
        notMerge
        lazyUpdate
      />
      <div
        className='d-block text-center project-performance' style={{ color: renderColorForProgress() }}
      >
        {`${numberWithCommas(projectPerformance, 1)} %`}
      </div>
      <div className='d-block text-center number-minutes-ago'>
        <FormattedMessage
          id='Number minutes ago'
          values={{
            number: _isNumber(lastUpdate)
              ? moment().diff(moment(lastUpdate), 'minutes')
              : '-'
          }}
        />
      </div>
    </Card>
  )
}

PowerGauge.propTypes = {
  percentageValue: PropTypes.number.isRequired,
  currentValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  lastUpdate: PropTypes.number
}

export default PowerGauge
