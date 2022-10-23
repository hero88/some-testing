import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Code } from 'react-feather'
import ReactECharts from 'echarts-for-react'
import PropTypes from 'prop-types'
import { useSkin } from '@hooks/useSkin'
import { useState } from 'react'

const YieldByLocationChart = ({ intl, timeLabels, totalYield7DaysByProvince }) => {
  const [skin] = useSkin()

  const [chartLegend] = useState([`${intl.formatMessage({ id: 'Total active power' })} (W)`])

  const textColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b'

  const options = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      data: chartLegend,
      textStyle: {
        color: textColor
      }
    },
    xAxis: {
      type: 'category',
      data: timeLabels
    },
    yAxis: {
      type: 'value',
      name: `${intl.formatMessage({ id: 'Total active power' })} (W)`
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    series: totalYield7DaysByProvince
  }

  return (
    <Card className="chart-overview">
      <CardHeader className="d-flex align-items-center">
        <CardTitle tag="h5">
          <FormattedMessage id="The corresponding cumulative total output" />
        </CardTitle>
        <Button.Ripple color="flat-primary">
          <Code size={16} />
        </Button.Ripple>
      </CardHeader>
      <CardBody>
        <ReactECharts option={options} />
      </CardBody>
    </Card>
  )
}

YieldByLocationChart.propTypes = {
  intl: PropTypes.object.isRequired,
  timeLabels: PropTypes.array.isRequired,
  totalYield7DaysByProvince: PropTypes.array.isRequired
}

export default injectIntl(YieldByLocationChart)
