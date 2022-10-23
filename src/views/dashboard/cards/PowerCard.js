// ** React Imports
import {
  useEffect,
  useState
} from 'react'

// ** Third party components
import {
  Card,
  CardHeader,
  ButtonGroup,
  Button,
  Spinner
} from 'reactstrap'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { DatePicker } from 'element-react/next'
import _isNumber from 'lodash/isNumber'

import { useSkin } from '@hooks/useSkin'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  numberToFixed,
  numberWithCommas
} from '@utils'
import {
  DISPLAY_DATE_FORMAT,
  INTERVAL_BUTTON,
  INTERVAL_YIELD
} from '@constants/common'

const PowerCard = ({
  intl,
  totalActivePowerData,
  totalEffData,
  totalIRRData,
  handleChangeChartView,
  rSelected,
  setRSelected,
  selectedDate,
  setSelectedDate,
  chartType,
  setChartType,
  isCFLoading,
  yieldChartData,
  selectedProject
}) => {
  const [skin] = useSkin(),
    [timeData, setTimeData] = useState([]),
    [pvData, setPVData] = useState([]),
    [yieldData, setYieldData] = useState([]),
    [yieldInterval, setYieldInterval] = useState([]),
    [effData, setEffData] = useState([]),
    [irrData, setIRRData] = useState([]),
    [legends, setLegends] = useState([
      intl.formatMessage({
        id: chartType === 'line'
          ? 'AC INV'
          : 'Yield'
      }),
      intl.formatMessage({ id: 'Project CF' })
    ])
  const powerColor = '#088DCD',
    irrColor = '#9750C8',
    effColor = '#65CAE0'

  const filterDataByTime = (currentTime) => {
    return (
      (
        (
          currentTime.hours() < 6 || currentTime.hours() > 17
        ) && (
          currentTime.minutes() >= 0 && currentTime.minutes() < 5
        )
      ) || (
        currentTime.hours() >= 6 && currentTime.hours() <= 17
      )
    ) && moment().diff(currentTime, 'seconds', true) >= 0
  }

  const filterByTime = ({ currentTime, data }) => {
    if (
      (
        (
          (
            currentTime.hours() < 6 || currentTime.hours() > 17
          ) && (
            currentTime.minutes() >= 0 && currentTime.minutes() < 5
          )
        ) || (
          currentTime.hours() >= 6 && currentTime.hours() <= 17
        )
      ) && moment().diff(currentTime, 'seconds', true) >= 0
    ) {
      return data
    }

    return null
  }

  const renderTimeLabels = () => {
    const fromDate = moment().startOf('d')
    const toDate = moment().endOf('d')
    const currentTime = fromDate
    const tempTimeLabel = []

    while (toDate.diff(currentTime, 'seconds', true) >= 0) {
      if (
        (
          (
            currentTime.hours() < 6 || currentTime.hours() > 17
          ) && currentTime.minutes() === 0
        ) || (
          currentTime.hours() >= 6 && currentTime.hours() <= 17
        )
      ) {
        tempTimeLabel.push(currentTime.format('HH:mm'))
      }

      currentTime.add(300, 'seconds')
    }

    return tempTimeLabel
  }

  useEffect(() => {
    const tempTimeData = renderTimeLabels()
    setTimeData(tempTimeData)

    if (totalActivePowerData?.length >= 0) {
      const tempAPData = [...totalActivePowerData]
      const tempPVData = []

      tempTimeData.forEach(item => {
        const currentLabelTime = moment(item, 'HH:mm')
        let isFiltered = false

        for (let i = 0; i < tempAPData.length; i++) {
          const currentPVTime = moment(Number(tempAPData[0]?.date)).format('HH:mm')
          const convertedPVTime = moment(currentPVTime, 'HH:mm')

          if (convertedPVTime.diff(currentLabelTime, 'seconds') < 300) {
            const validData = tempAPData.shift()

            // Check for duplicate data in 5 min
            if (!isFiltered) {
              tempPVData.push(
                numberToFixed(validData?.totalActivePower / 1000)
                || numberToFixed(validData?.sumActivePower / 1000)
                || 0
              )
              isFiltered = true
            }
          } else {
            if (!isFiltered) {
              tempPVData.push(null)
              isFiltered = true
            } else {
              return
            }
          }
        }
      })

      setPVData(tempPVData)
    }

    if (totalEffData.length >= 0 && rSelected !== INTERVAL_BUTTON.DAY) {
      const validDateFormat = rSelected === INTERVAL_BUTTON.YEAR
        ? 'MM/YYYY'
        : 'DD/MM/YYYY HH:mm:ss'

      if (rSelected === INTERVAL_BUTTON.TOTAL) {
        const result = totalEffData
          .filter((item) => {
            return yieldInterval.findIndex(interval => interval === Number(item.date)) > -1
          })
          .map((item) => (_isNumber(item.PR)
            ? numberToFixed(item.PR)
            : null))

        setEffData(result)
      } else if (rSelected === INTERVAL_BUTTON.YEAR) {
        const result = totalEffData
          .filter((item) => {
            const currentTime = moment(item.date, validDateFormat).format('M/YYYY')

            return yieldInterval.findIndex(interval => interval === currentTime) > -1
          })
          .map((item) => (_isNumber(item.PR)
            ? numberToFixed(item.PR)
            : null))

        setEffData(result)
      } else {
        setEffData(totalEffData
          .filter(item => filterDataByTime(moment(item?.date, validDateFormat)))
          .map((item) => filterByTime({
            currentTime: moment(item?.date, validDateFormat),
            data: _isNumber(item.PR)
              ? numberToFixed(item.PR)
              : null
          })))
      }
    } else {
      setEffData([])
    }

    if (totalIRRData.length >= 0 && rSelected === INTERVAL_BUTTON.DAY) {
      setIRRData(totalIRRData
        .filter(item => filterDataByTime(moment(item?.date, 'DD/MM/YYYY HH:mm:ss')))
        .map((item) => filterByTime({
          currentTime: moment(item?.date, 'DD/MM/YYYY HH:mm:ss'),
          data: _isNumber(item.IRR)
            ? numberToFixed(item.IRR)
            : null
        })))
    } else {
      setIRRData([])
    }
  }, [totalActivePowerData, totalEffData, totalIRRData])

  useEffect(() => {
    if (chartType) {
      if (rSelected === INTERVAL_BUTTON.DAY) {
        setLegends([
          intl.formatMessage({ id: 'AC INV' }),
          intl.formatMessage({ id: 'Irradiation' })
        ])
      } else {
        setLegends([
          intl.formatMessage({
            id: chartType === 'line'
              ? 'AC INV'
              : 'Yield'
          }),
          intl.formatMessage({ id: 'Project CF' })
        ])
      }
    }
  }, [chartType])

  useEffect(() => {
    const tempInterval = [],
      tempYieldData = []

    if (yieldChartData?.length > 0) {
      yieldChartData.forEach((item) => {
        tempInterval.push(
          rSelected === INTERVAL_BUTTON.TOTAL
            ? item?.interval
            : rSelected === INTERVAL_BUTTON.MONTH || rSelected === INTERVAL_BUTTON.WEEK
              ? moment(Number(item?.interval)).format(DISPLAY_DATE_FORMAT)
              : `${item?.interval}/${moment(selectedDate).format('YYYY')}`
        )
        tempYieldData.push(item?.value / 1000)
      })
    }

    setYieldInterval(tempInterval)
    setYieldData(tempYieldData)
  }, [yieldChartData])

  const textColor = skin === 'dark'
    ? '#b4b7bd'
    : '#6e6b7b'
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
      }
    ],
    xAxis: {
      type: 'category',
      data: chartType === 'line'
        ? timeData
        : yieldInterval
    },
    yAxis: [
      {
        type: 'value',
        name: `${intl.formatMessage({
          id: chartType === 'line'
            ? 'AC INV'
            : 'Yield'
        })} (${chartType === 'line'
          ? 'kW'
          : 'kWh'})`,
        position: 'left',
        min: 0,
        max: chartType === 'line' && selectedProject?.wattageAC && selectedProject?.wattageDC
          ? Math.ceil(selectedProject?.wattageAC
          * (selectedProject?.wattageDC / selectedProject?.wattageAC)
          / 100 / 1000) * 100
          : undefined,
        scale: true,
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
          show: false
        }
      },
      {
        type: 'value',
        name: rSelected === INTERVAL_BUTTON.DAY
          ? `${intl.formatMessage({ id: 'Irradiation' })} (W/m²)`
          : `${intl.formatMessage({ id: 'Project CF' })} (%)`,
        position: 'right',
        max: rSelected === INTERVAL_BUTTON.DAY
          ? Math.max(...irrData) > 1200 ? Math.ceil(Math.max(...irrData) / 100) * 100 : 1200
          : undefined,
        min: 0,
        scale: true,
        show: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: rSelected === INTERVAL_BUTTON.DAY
              ? irrColor
              : effColor
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
        name: intl.formatMessage({
          id: chartType === 'line'
            ? 'AC INV'
            : 'Yield'
        }),
        data: chartType === 'line'
          ? pvData
          : yieldData,
        type: chartType,
        smooth: false,
        showSymbol: false,
        itemStyle: {
          color: powerColor
        },
        lineStyle: {
          color: powerColor
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'rgba(128, 255, 165)'
            },
            {
              offset: 0.3,
              color: powerColor
            }
          ])
        },
        barWidth: 25,
        yAxisIndex: 0
      },
      {
        name: intl.formatMessage({ id: 'Irradiation' }),
        data: irrData,
        type: 'line',
        smooth: false,
        showSymbol: false,
        itemStyle: {
          color: irrColor
        },
        lineStyle: {
          color: irrColor
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: '#d0aaf6'
            },
            {
              offset: 0.3,
              color: '#860cee'
            }
          ])
        },
        yAxisIndex: 1
      },
      {
        name: intl.formatMessage({ id: 'Project CF' }),
        data: effData,
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

          if (param.value >= 0) {
            if (param.componentIndex === 1) {
              template =
                template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> W/m²<br/>`)
            } else if (param.componentIndex === params.length - 1) {
              template =
                template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${param.componentIndex
                === 2
                  ? '%'
                  : chartType === 'line'
                    ? 'kW'
                    : 'kWh'}`)
            } else {
              template =
                template.concat(`${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> ${param.componentIndex
                === 2
                  ? '%'
                  : chartType === 'line'
                    ? 'kW'
                    : 'kWh'}<br/>`)
            }
          }
        })

        return template
      }
    }
  }

  const renderSelectionMode = (key) => {
    switch (key) {
      case 'week':
        return 'week'

      case 'month':
        return 'month'

      case 'year':
      case 'total':
        return 'year'

      case 'day':
      default:
        return 'day'
    }
  }

  const renderFormatDatePicker = (key) => {
    switch (key) {
      case 'week':
        return `${moment(selectedDate).startOf('isoWeek').format('DD/MM/YYYY')}-${moment(selectedDate)
          .endOf('isoWeek')
          .format('DD/MM/YYYY')}`

      case 'month':
        return 'MM/yyyy'

      case 'year':
      case 'total':
        return 'yyyy'

      case 'day':
      default:
        return 'dd/MM/yyyy'
    }
  }

  const renderIntervalStep = (intervalType) => {
    switch (intervalType) {
      case 'week':
      case 'month':
        return {
          timeStep: 1,
          timeUnit: 'day'
        }

      case 'year':
        return {
          timeStep: 1,
          timeUnit: 'month'
        }
      case 'total':
        return {
          timeStep: 1,
          timeUnit: 'year'
        }

      case 'day':
      default:
        return {
          timeStep: 5,
          timeUnit: 'minute'
        }
    }
  }

  const renderSelectIntervalButtons = () => {
    const buttons = [
      {
        id: INTERVAL_BUTTON.DAY,
        label: 'Day',
        interval: INTERVAL_YIELD.DAILY,
        chartType: 'line',
        unitOfTime: 'd',
        timeStep: 5 * 60
      },
      {
        id: INTERVAL_BUTTON.WEEK,
        label: 'Week',
        interval: INTERVAL_YIELD.DAILY,
        chartType: 'bar',
        unitOfTime: 'isoWeek',
        timeStep: 24 * 60 * 60
      },
      {
        id: INTERVAL_BUTTON.MONTH,
        label: 'Month',
        interval: INTERVAL_YIELD.DAILY,
        chartType: 'bar',
        unitOfTime: 'month',
        timeStep: 24 * 60 * 60
      },
      {
        id: INTERVAL_BUTTON.YEAR,
        label: 'Year',
        interval: INTERVAL_YIELD.MONTHLY,
        chartType: 'bar',
        unitOfTime: 'year',
        timeStep: 30 * 24 * 60 * 60
      },
      {
        id: INTERVAL_BUTTON.TOTAL,
        label: 'Total',
        interval: INTERVAL_YIELD.YEARLY,
        chartType: 'bar',
        unitOfTime: 'year',
        timeStep: 365 * 24 * 60 * 60
      }
    ]

    return buttons.map((button, index) => {
      const interval = renderIntervalStep(button.id)
      return (
        <Button
          key={index}
          color='primary'
          outline
          onClick={() => {
            setSelectedDate(new Date())
            setRSelected(button.id)
            setChartType(button.chartType)
            handleChangeChartView({
              fromDate: button.id === INTERVAL_BUTTON.TOTAL
                ? moment('01/01/2021', 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
                : moment().startOf(button.unitOfTime).format('YYYY-MM-DD HH:mm:ss'),
              toDate: moment().endOf(button.unitOfTime).format('YYYY-MM-DD HH:mm:ss'),
              timeStep: button.id === INTERVAL_BUTTON.DAY
                ? button.timeStep
                : interval.timeStep,
              timeUnit: button.id === INTERVAL_BUTTON.DAY
                ? 'minute'
                : interval.timeUnit,
              selectedButton: button.id,
              interval: button.interval
            })
          }}
          active={rSelected === button.id}
          disabled={isCFLoading}
        >
          {isCFLoading && rSelected === button.id && <Spinner
            color='success'
            style={{ width: 15, height: 15 }}
          />}
          <FormattedMessage id={button.label}/>
        </Button>
      )
    })
  }

  const handlePickingDate = (date) => {
    const fromDate = rSelected === INTERVAL_BUTTON.TOTAL
      ? moment('01/01/2021', 'DD/MM/YYYY')
      : moment(date)
        .startOf(
          rSelected === INTERVAL_BUTTON.WEEK
            ? 'isoWeek'
            : rSelected === INTERVAL_BUTTON.MONTH
              ? 'month'
              : rSelected === INTERVAL_BUTTON.YEAR
                ? 'year'
                : 'd'
        )

    const toDate = rSelected === INTERVAL_BUTTON.TOTAL
      ? moment()
      : moment(date)
        .endOf(
          rSelected === INTERVAL_BUTTON.WEEK
            ? 'isoWeek'
            : rSelected === INTERVAL_BUTTON.MONTH
              ? 'month'
              : rSelected === INTERVAL_BUTTON.YEAR
                ? 'year'
                : 'd'
        )
    const interval = renderIntervalStep(rSelected)

    return {
      fromDate: fromDate.format('YYYY-MM-DD HH:mm:ss'),
      toDate: toDate.format('YYYY-MM-DD HH:mm:ss'),
      timeStep: interval.timeStep,
      timeUnit: interval.timeUnit,
      selectedButton: rSelected,
      interval: rSelected === INTERVAL_BUTTON.TOTAL
        ? INTERVAL_YIELD.YEARLY
        : rSelected === INTERVAL_BUTTON.YEAR
          ? INTERVAL_YIELD.MONTHLY
          : INTERVAL_YIELD.DAILY
    }
  }

  return (
    <Card className='power-card h-100 p-0 mb-0'>
      <CardHeader className='pb-0'>
        <DatePicker
          value={selectedDate}
          placeholder={intl.formatMessage({ id: `Pick a ${renderSelectionMode(rSelected)}` })}
          onChange={date => {
            setSelectedDate(date)
            handleChangeChartView(handlePickingDate(date))
          }}
          disabledDate={time => time.getTime() > Date.now()}
          format={renderFormatDatePicker(rSelected)}
          selectionMode={renderSelectionMode(rSelected)}
          isDisabled={isCFLoading || rSelected === INTERVAL_BUTTON.TOTAL}
          firstDayOfWeek={1}
        />
        <ButtonGroup className='underline-group'>
          {renderSelectIntervalButtons()}
        </ButtonGroup>
      </CardHeader>
      <ReactECharts
        className='react-echarts'
        style={{ height: '100%', minHeight: '200px' }}
        option={options}
      />
    </Card>
  )
}

PowerCard.propTypes = {
  selectedProject: PropTypes.object,
  totalActivePowerData: PropTypes.array,
  totalEffData: PropTypes.array,
  totalIRRData: PropTypes.array,
  intl: PropTypes.object.isRequired,
  handleChangeChartView: PropTypes.func.isRequired,
  rSelected: PropTypes.string,
  setRSelected: PropTypes.func,
  selectedDate: PropTypes.any,
  setSelectedDate: PropTypes.func,
  chartType: PropTypes.string,
  setChartType: PropTypes.func,
  isCFLoading: PropTypes.bool,
  yieldChartData: PropTypes.array
}

export default injectIntl(PowerCard)
