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
import _orderBy from 'lodash/orderBy'

import { getMonitoringInverters } from '@src/views/monitoring/devices/inverter/store/actions'
import { useQuery } from '@hooks/useQuery'
import { TYPE_MODEL } from '@constants/project'
import { numberToFixed, numberWithCommas } from '@utils'

const StringChart = ({ intl, selectedParams }) => {
  const dispatch = useDispatch(),
    {
      layout: { skin },
      inverter: { selectedInverter },
      monitoringInverter: store
    } = useSelector((state) => state),
    query = useQuery(),
    deviceId = query.get('deviceId')
  const [picker, setPicker] = useState([new Date(), new Date()]),
    [isDisplayTable, setIsDisplayTable] = useState(false),
    [timeLabels, setTimeLabel] = useState([]),
    [legends, setLegends] = useState([]),
    [series, setSeries] = useState([]),
    [sortedMonitoringData, setSortedMonitoringData] = useState(store?.data || []),
    [samplingTime, setSamplingTime] = useState(5)

  const fetchMonitoringData = (params) => {
    dispatch(
      getMonitoringInverters({
        ...store.params,
        rowsPerPage: 500,
        fromDate: moment(picker[0]).startOf('d').valueOf(),
        toDate: moment(picker[1]).endOf('d').valueOf(),
        monitoringType: selectedInverter?.typeModel === TYPE_MODEL.SMA ? 'smaInverter' : 'sungrowInverter',
        seconds: samplingTime,
        order: 'createDate asc',
        graphKeys: selectedParams?.length > 0 ? JSON.stringify(selectedParams.map(item => item.key)) : undefined,
        ...params,
        deviceId
      })
    )
  }

  useEffect(async () => {
    if (selectedInverter) {
      fetchMonitoringData()
    }
  }, [])

  useEffect(() => {
    if (store?.data) {
      const sortedData = _orderBy(store.data, ['createDate'], ['asc'])
      setSortedMonitoringData(sortedData)
    }
  }, [store])

  // ** Component did mount
  useEffect(() => {
    const tempTimeLabels = [],
      tempLegends = [],
      tempSeries = []

    sortedMonitoringData.forEach((item) => {
      tempTimeLabels.push(moment(Number(item.date)).format('DD/MM/YYYY THH:mm:ss'))
    })

    selectedParams.forEach((param) => {
      const tempData = []
      let tempName = ''
      tempLegends.push(intl.formatMessage({ id: param.key || 'None' }))

      sortedMonitoringData.forEach((item) => {
        if (item[param.key] >= 0) {
          tempName = intl.formatMessage({ id: param.key || 'None' })
        }

        param.key.toLowerCase().includes('power') || param.key.toLowerCase().includes('yield')
        ? tempData.push(item[param.key] ? numberToFixed(item[param.key] / 1000) : 0)
        : tempData.push(item[param.key] ? numberToFixed(item[param.key]) : 0)
      })

      tempSeries.push({
        name: tempName,
        data: tempData,
        type: 'line',
        smooth: true,
        showSymbol: false,
        yAxisIndex: param.key.toLowerCase().includes('current') ? 1 : 0
      })
    })

    setTimeLabel(tempTimeLabels)
    setLegends(tempLegends)
    setSeries(tempSeries)
  }, [sortedMonitoringData])

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

  const filterByDate = async () => {
    if (picker && picker.length === 2) {
      fetchMonitoringData()
    }
  }

  const onChangeSelectTime = (event) => {
    setSamplingTime(event.value)
    fetchMonitoringData({ seconds: event.value * 60 })
  }

  const options = {
    grid: {
      top: '60px',
      bottom: '80px',
      left: '130px',
      right: '130px',
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
        name: `${intl.formatMessage({ id: 'Voltage' })}: V`,
        show: true,
        position: 'left',
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
        show: true,
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

          if (param.seriesIndex === 0) {
            template = template.concat(
              `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> V<br/>`
            )
          }

          if (param.seriesIndex === 1 && param.seriesIndex <= 3) {
            template = template.concat(
              `${param.marker} ${param.seriesName}: <strong>${numberWithCommas(param.value)}</strong> A<br/>`
            )
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

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between'>
        <div className='d-flex justify-content-start'>
          <Button.Ripple className='btn-icon ml-1' color='flat-primary'>
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
            className='form-control w-50'
          />
          <CreatableSelect
            name='samplingTime'
            options={timeOptions}
            defaultValue={timeOptions[0]}
            className='react-select project-select'
            classNamePrefix='select'
            onChange={onChangeSelectTime}
          />
          <Button.Ripple className='btn-icon ml-1' color='primary' outline onClick={filterByDate}>
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
          className='btn-icon d-none'
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

StringChart.propTypes = {
  intl: PropTypes.object.isRequired,
  selectedParams: PropTypes.array.isRequired
}

export default injectIntl(StringChart)
