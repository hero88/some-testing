// ** React Imports
import React, {
  useEffect,
  useState
} from 'react'

// ** Third party components
import {
  Col,
  Row,
  Card
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import PropTypes from 'prop-types'
import _isNumber from 'lodash/isNumber'
import _isEmpty from 'lodash/isEmpty'

// ** Custom components
import ListCard from '@src/views/dashboard/cards/ListCard'
import PowerCard from '@src/views/dashboard/cards/PowerCard'
import {
  getProjectById,
  getProjectMonitoringById,
  getWeatherInfo
} from '@src/views/monitoring/projects/store/actions'
import {
  DEVICE_TYPE,
  TYPE_MODEL
} from '@constants/project'
import { numberWithCommas } from '@utils'
import moment from 'moment'
import axios from 'axios'
import {
  API_GET_EFF_FOR_CHART,
  API_GET_MONITORING_INVERTER,
  API_GET_YIELD_CHART
} from '@constants/api'
import { INTERVAL_BUTTON } from '@constants/common'
import PowerGauge from '@src/views/monitoring/project/PowerGauge'
import { useQuery } from '@hooks/useQuery'

let projectOverviewTimeoutId = 0
let projectOverviewIntervalId = 0

export const getPowerByTime = async ({ selectedProject, fromDate, toDate, timeStep }) => {
  if (selectedProject && selectedProject.devices?.length > 0) {
    const sungrowInverters = selectedProject.devices.filter(
      (item) => item.typeDevice === DEVICE_TYPE.INVERTER && item.typeModel === TYPE_MODEL.SUNGROW
    )
    const smaInverters = selectedProject.devices.filter(
      (item) => item.typeDevice === DEVICE_TYPE.INVERTER && item.typeModel === TYPE_MODEL.SMA
    )
    const sungrowParams = {
      projectId: selectedProject.id,
      fromDate,
      toDate,
      order: `createDate asc`,
      seconds: timeStep,
      rowsPerPage: 500,
      monitoringType: 'sungrowInverter',
      graphKeys: JSON.stringify(['totalActivePower', 'totalDcPower']),
      deviceIds: JSON.stringify(sungrowInverters?.map((item) => item?.id))
    }
    const smaParams = {
      projectId: selectedProject.id,
      fromDate,
      toDate,
      order: `createDate desc`,
      seconds: timeStep,
      rowsPerPage: 500,
      monitoringType: 'smaInverter',
      graphKeys: JSON.stringify(['sumActivePower', 'sumPowerDc']),
      deviceIds: JSON.stringify(smaInverters?.map((item) => item?.id))
    }

    let tempResults = []

    await Promise.all([
      sungrowInverters?.length > 0 &&
      axios
        .get(API_GET_MONITORING_INVERTER, { params: { ...sungrowParams }, isNotCount: true })
        .then((response) => {
          if (response?.data?.data) {
            tempResults = [...tempResults, ...response.data.data]
          }
        })
        .catch((err) => {
          console.debug('Get SUNGROW monitoring inverters error: ', err)
        }),
      smaInverters?.length > 0 &&
      axios
        .get(API_GET_MONITORING_INVERTER, { params: { ...smaParams }, isNotCount: true })
        .then((response) => {
          if (response?.data?.data) {
            tempResults = [...tempResults, ...response.data.data]
          }
        })
        .catch((err) => {
          console.debug('Get SMA monitoring inverters error: ', err)
        })
    ])

    return tempResults
  }
}

const ProjectOverview = ({ setIsShowSideBar }) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      customerProject: { selectedProject, projectMonitoring, weather }
    } = useSelector((state) => state),
    query = useQuery(),
    projectId = query.get('projectId')

  const [totalACPower, setTotalACPower] = useState(0),
    [totalActivePowerData, setTotalActivePowerData] = useState([]),
    [totalEffData, setTotalEffData] = useState([]),
    [totalIRRData, setTotalIRRData] = useState([]),
    [yieldChartData, setYieldChartData] = useState([]),
    [rSelected, setRSelected] = useState(INTERVAL_BUTTON.DAY),
    [selectedDate, setSelectedDate] = useState(new Date()),
    [chartType, setChartType] = useState('line'),
    [isCFLoading, setIsCFLoading] = useState(false)

  // Get yield data for chart
  const getYieldData = async (params) => {
    await axios.get(API_GET_YIELD_CHART, { params, isNotCount: true })
      .then(response => {
        if (response?.data?.data) {
          setYieldChartData(response.data.data)
        }
      })
      .catch(error => {
        console.error('[ProjectOverview][getYieldData] - Error: ', error.message)
        setYieldChartData([])
      })
  }

  const getEffForChart = async ({
    fromDate,
    toDate,
    timeStep,
    timeUnit,
    selectedButton,
    project,
    chartType,
    fields
  }) => {
    if (selectedButton && project?.devices && project.devices.length > 0) {
      const isSMA = project.devices.some(device => device.typeModel === TYPE_MODEL.SMA)
      await axios
        .get(API_GET_EFF_FOR_CHART, {
          params: {
            projectId: project.id,
            fromDate,
            toDate,
            seconds: timeStep,
            monitoringType: isSMA
              ? 'smaInverter'
              : 'sungrowInverter',
            order: 'createDate asc',
            rowsPerPage: -1,
            timeStep,
            timeUnit,
            chartType,
            fields
          },
          isNotCount: true
        })
        .then((response) => {
          if (chartType === 'IRR' || fields === 'IRR') {
            setTotalIRRData(response.data.data)
          } else {
            setTotalEffData(response.data.data)
          }
        })
        .catch((err) => {
          console.error('[getEffForChart] Error: ', err)
          if (chartType === 'IRR' || fields === 'IRR') {
            setTotalIRRData([])
          } else {
            setTotalEffData([])
          }
        })
    }
  }

  const handleClickItem = () => {
    console.log('Item clicked')
  }

  const handleChangeChartView = async ({ fromDate, toDate, timeStep, timeUnit, selectedButton, interval }) => {
    setIsCFLoading(true)
    setTotalActivePowerData([])
    setTotalIRRData([])
    setTotalEffData([])

    if (selectedButton === INTERVAL_BUTTON.DAY) {
      const [result] = await Promise.all([
        getPowerByTime({
          selectedProject,
          fromDate,
          toDate,
          timeStep: 5 * 60
        }),
        getEffForChart({
          fromDate,
          toDate,
          timeStep: 5,
          timeUnit: 'minute',
          selectedButton,
          project: selectedProject,
          chartType: 'COMMON',
          fields: 'IRR'
        })
      ]).finally(() => {
        setIsCFLoading(false)
      })

      setTotalActivePowerData(result)
    } else {
      await Promise.all([
        getYieldData({
          projectIds: selectedProject.id,
          order: 'createDate asc',
          interval,
          fromDate,
          toDate,
          year: moment(fromDate).format('YYYY'),
          fromYear: '2021',
          toYear: moment(toDate).format('YYYY')
        }),
        getEffForChart({
          fromDate,
          toDate,
          timeStep,
          timeUnit,
          selectedButton,
          project: selectedProject,
          chartType: 'COMMON',
          fields: 'PR'
        })
      ]).finally(() => {
        setIsCFLoading(false)
      })
    }
  }

  const envParams = [
    {
      title: <FormattedMessage id='Environment temperature'/>,
      value: _isNumber(weather?.current?.temp)
        ? numberWithCommas(weather?.current?.temp)
        : '-',
      unit: '°C',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='PV temperature'/>,
      value: _isNumber(projectMonitoring?.panelTemp)
        ? numberWithCommas(projectMonitoring?.panelTemp)
        : '-',
      unit: '°C',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Wind speed'/>,
      value: _isNumber(weather?.current?.wind_speed)
        ? numberWithCommas(weather?.current?.wind_speed)
        : '-',
      unit: 'm/s',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Irradiation'/>,
      value: _isNumber(projectMonitoring?.irr)
        ? numberWithCommas(projectMonitoring?.irr)
        : '-',
      unit: 'W/m²',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    }
  ]
  const todayYieldParams = [
    {
      title: <FormattedMessage id='Today yield'/>,
      value: _isNumber(projectMonitoring?.dailyYield)
        ? numberWithCommas(projectMonitoring?.dailyYield / 1000, 0)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Capacity factor'/>,
      value: (
        selectedProject?.wattageDC && _isNumber(projectMonitoring?.dailyYield)
          ? `${numberWithCommas((
            (
              projectMonitoring?.dailyYield / selectedProject?.wattageDC
            ) / 24 * 100
          ))}`
          : '-'
      ),
      unit: '%',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Irradiation yield'/>,
      value: _isNumber(projectMonitoring?.totalRadiationYield)
        ? numberWithCommas(projectMonitoring?.totalRadiationYield / 1000, 0)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    }
  ]
  const yesterdayYieldParams = [
    {
      title: <FormattedMessage id='Yesterday yield'/>,
      value: _isNumber(projectMonitoring?.yesterdayYield)
        ? numberWithCommas(projectMonitoring?.yesterdayYield / 1000, 0)
        : '-',
      unit: 'kWh',
      subValue: selectedProject?.wattageDC && _isNumber(projectMonitoring?.yesterdayYield)
        ? `${numberWithCommas((
          (
            projectMonitoring?.yesterdayYield / selectedProject?.wattageDC
          ) / 24 * 100
        ))}`
        : '-',
      subUnit: '%',
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Monthly yield'/>,
      value: _isNumber(projectMonitoring?.monthlyYield)
        ? numberWithCommas(projectMonitoring?.monthlyYield / 1000000)
        : '-',
      unit: 'MWh',
      subValue: selectedProject?.wattageDC > 0 && _isNumber(projectMonitoring?.monthlyYield)
        ? numberWithCommas(
          projectMonitoring?.monthlyYield / (
            selectedProject.wattageDC * (
              moment().diff(moment(projectMonitoring.monthStartDate, 'YYYY-MM-DD'), 'day', true)
            )
          ) / 24 * 100
        )
        : '-',
      subUnit: '%',
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Annual yield'/>,
      value: _isNumber(projectMonitoring?.yearlyYield)
        ? numberWithCommas(projectMonitoring?.yearlyYield / 1000000)
        : '-',
      unit: 'MWh',
      subValue: selectedProject?.wattageDC > 0 && _isNumber(projectMonitoring?.yearlyYield)
        ? numberWithCommas(
          projectMonitoring?.yearlyYield / (
            selectedProject.wattageDC * (
              moment().diff(moment(projectMonitoring.yearStartDate, 'YYYY-MM-DD'), 'day', true)
            )
          ) / 24 * 100
        )
        : '-',
      subUnit: '%',
      class: 'param-item'
    }
  ]
  const reductionYieldParams = [
    {
      title: <FormattedMessage id='Reduction yield'/>,
      value: _isNumber(projectMonitoring?.totalYieldDecreasedDeviceError)
        ? numberWithCommas(projectMonitoring?.totalYieldDecreasedDeviceError / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Reduction yield by performance'/>,
      value: _isNumber(projectMonitoring?.totalYieldDecreasedLowPerformance)
        ? numberWithCommas(projectMonitoring?.totalYieldDecreasedLowPerformance / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Reduction yield by device fault'/>,
      value: '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Reduction total'/>,
      value: _isNumber(projectMonitoring?.totalYieldDecreasedAll)
        ? numberWithCommas(projectMonitoring?.totalYieldDecreasedAll / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    }
  ]
  const totalYieldParams = [
    {
      title: <FormattedMessage id='Generation grid'/>,
      value: _isNumber(projectMonitoring?.totalYieldPushGrid)
        ? numberWithCommas(projectMonitoring?.totalYieldPushGrid / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Receive grid'/>,
      value: _isNumber(projectMonitoring?.totalYieldPullGrid)
        ? numberWithCommas(projectMonitoring?.totalYieldPullGrid / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Receive solar'/>,
      value: _isNumber(projectMonitoring?.totalYieldPullSolar)
        ? numberWithCommas(projectMonitoring?.totalYieldPullSolar / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    },
    {
      title: <FormattedMessage id='Load consuming'/>,
      value: _isNumber(projectMonitoring?.totalYieldLoadUsage)
        ? numberWithCommas(projectMonitoring?.totalYieldLoadUsage / 1000)
        : '-',
      unit: 'kWh',
      subValue: null,
      subUnit: null,
      class: 'param-item'
    }
  ]

  const renderItems = (items) => {
    return items.map((item, index) => {
      return (
        // eslint-disable-next-line react/jsx-key
        <div
          className={item.class}
          key={index}
        >
          <aside className='value'>
            <span className='text-gradient'>{item.value}</span>
            <span>{item.unit}</span>
          </aside>
          <span className='title'>{item.title}</span>
          {
            item.subValue > 0 &&
            <>
              <aside className='sub-value'>
                {item.subValue}
                <span className='sub-unit'>{item.subUnit}</span>
              </aside>
            </>
          }
        </div>
      )
    })
  }

  useEffect(() => {
    if (!_isEmpty(selectedProject)) {
      const getPowersForChart = async () => {
        if (selectedProject?.devices && selectedProject.devices.length > 0) {
          // Get chart data for IRR
          getEffForChart({
            fromDate: moment().startOf('d').format('YYYY-MM-DD HH:mm:ss'),
            toDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            timeStep: 5 * 60,
            selectedButton: INTERVAL_BUTTON.DAY,
            project: selectedProject,
            chartType: 'IRR'
          })

          // Get chart data for INV AC
          const result = await getPowerByTime({
            selectedProject,
            fromDate: moment().startOf('d').format('YYYY-MM-DD HH:mm:ss'),
            toDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            timeStep: 5 * 60,
            keys: ['totalActivePower']
          })

          setTotalActivePowerData(result)
          setTotalACPower(
            result.length > 0
              ? result?.[result.length - 1]?.totalActivePower
                ? result[result.length - 1].totalActivePower
                : result[result.length - 1].sumActivePower || 0
              : 0
          )

          setSelectedDate(new Date())
          setRSelected(INTERVAL_BUTTON.DAY)
          setChartType('line')
        }
      }

      // Call 1st time after selected project is changed
      getPowersForChart()
      dispatch(
        getWeatherInfo({
          latitude: selectedProject?.lat
            ? Number(selectedProject.lat)
            : 10.590516,
          longitude: selectedProject?.lng
            ? Number(selectedProject.lng)
            : 106.810065
        })
      )

      // Calculate delay time
      const currentTime = moment()
      const delayTime = Math.abs(((8 * 60 * 1000) - (currentTime.valueOf() % (5 * 60 * 1000))) % (5 * 60 * 1000))

      if (projectOverviewTimeoutId) {
        clearTimeout(projectOverviewTimeoutId)
      }

      projectOverviewTimeoutId = setTimeout(() => {
        Promise.all([
          dispatch(getProjectMonitoringById({ projectId })),
          dispatch(
            getProjectById({
              id: projectId,
              fk: '*'
            })
          ),
          getPowersForChart(),
          dispatch(
            getWeatherInfo({
              latitude: selectedProject?.lat
                ? Number(selectedProject.lat)
                : 10.590516,
              longitude: selectedProject?.lng
                ? Number(selectedProject.lng)
                : 106.810065
            })
          )
        ])

        // Clear interval to prevent duplicate interval
        if (projectOverviewIntervalId) {
          clearInterval(projectOverviewIntervalId)
        }

        // Interval 5 mins
        projectOverviewIntervalId = setInterval(() => {
          Promise.all([
            dispatch(getProjectMonitoringById({ projectId })),
            dispatch(
              getProjectById({
                id: projectId,
                fk: '*'
              })
            ),
            getPowersForChart(),
            dispatch(
              getWeatherInfo({
                latitude: selectedProject?.lat
                  ? Number(selectedProject.lat)
                  : 10.590516,
                longitude: selectedProject?.lng
                  ? Number(selectedProject.lng)
                  : 106.810065
              })
            )
          ])
        }, 5 * 60 * 1000)
      }, delayTime)
    }

    return () => {
      if (projectOverviewTimeoutId) {
        clearTimeout(projectOverviewTimeoutId)
      }

      if (projectOverviewIntervalId) {
        clearInterval(projectOverviewIntervalId)
      }
    }
  }, [selectedProject])

  // ** Get data on mount
  useEffect(() => {
    setIsShowSideBar(true)
    Promise.all([dispatch(getProjectMonitoringById({ projectId }))])
  }, [])

  return (
    <div className='project-overview'>
      <Card className='p-2'>
        <Row>
          <Col
            lg={1}
            md={4}
            sm={12}
            className='sidebar-project pl-1 pr-1'
          >
            <span className='project-name'>{selectedProject?.name}</span>
            <aside className='level1'>
              <span>{selectedProject?.code}</span>
              <span>{selectedProject?.electricityCode}</span>
              <span>{selectedProject?.electricityName}</span>
            </aside>
            <aside className='level2'>
              <span>{_isNumber(selectedProject?.wattageDC)
                ? numberWithCommas(selectedProject.wattageDC / 1000)
                : '-'} kWp</span>
              <span><FormattedMessage id='DC power'/></span>
            </aside>
            <aside className='level2'>
              <span>{_isNumber(selectedProject?.wattageAC)
                ? numberWithCommas(selectedProject.wattageAC / 1000)
                : '-'} kW</span>
              <span><FormattedMessage id='AC power'/></span>
            </aside>
            <aside className='level2'>
              <span className='percent'>
                {
                  selectedProject?.wattageDC > 0 && _isNumber(selectedProject?.wattageAC)
                    ? numberWithCommas((
                      selectedProject?.wattageAC / selectedProject?.wattageDC
                    ) * 100)
                    : '-'
                }%
              </span>
              <span><FormattedMessage id='AC/DC ratio'/></span>
            </aside>
          </Col>
          <Col
            lg={3}
            md={8}
            sm={12}
            className='d-flex flex-column align-items-center justify-content-center'
          >
            <PowerGauge
              percentageValue={projectMonitoring?.instantPerformance || projectMonitoring?.dailyPerformance}
              currentValue={totalACPower / 1000}
              maxValue={selectedProject?.wattageAC / 1000 || 0}
              lastUpdate={projectMonitoring?.lastUpdate}
            />
          </Col>
          <Col
            lg={1}
            md={4}
          >
            <Card className='params-column'>{renderItems(envParams)}</Card>
          </Col>
          <Col
            lg={1}
            md={4}
          >
            <Card className='params-column'>{renderItems(todayYieldParams)}</Card>
          </Col>
          <Col
            lg={1}
            md={4}
          >
            <Card className='params-column'>{renderItems(yesterdayYieldParams)}</Card>
          </Col>
          <Col
            lg={1}
            md={6}
          >
            <Card className='params-column'>{renderItems(reductionYieldParams)}</Card>
          </Col>
          <Col
            lg={1}
            md={6}
          >
            <Card className='params-column'>{renderItems(totalYieldParams)}</Card>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col
          xl={5}
          md={12}
          sm={12}
        >
          <Row className='devices-status-container'>
            <Col xl={12}>
              {/*========== METER STATUS ==========*/}
              <ListCard
                title='Meter'
                deviceType={DEVICE_TYPE.METER}
                items={selectedProject?.devices?.filter((item) => item?.typeDevice === DEVICE_TYPE.METER) || []}
                handleClickItem={handleClickItem}
                projectId={selectedProject?.id}
              />
              {/*========== END METER STATUS ==========*/}
            </Col>
            <Col xl={12}>
              {/*========== INVERTER STATUS ==========*/}
              <ListCard
                title='Inverter'
                deviceType={DEVICE_TYPE.INVERTER}
                items={selectedProject?.devices?.filter((item) => item?.typeDevice === DEVICE_TYPE.INVERTER) || []}
                handleClickItem={handleClickItem}
                projectId={selectedProject?.id}
              />
              {/*========== END INVERTER STATUS ==========*/}
            </Col>
          </Row>
        </Col>
        <Col
          xl={7}
          md={12}
          sm={12}
        >
          <Row className='h-100'>
            <Col>
              {/*========== START POWER CHART ==========*/}
              <PowerCard
                selectedProject={selectedProject}
                totalActivePowerData={totalActivePowerData}
                totalEffData={totalEffData}
                totalIRRData={totalIRRData}
                yieldChartData={yieldChartData}
                handleChangeChartView={handleChangeChartView}
                rSelected={rSelected}
                setRSelected={setRSelected}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                chartType={chartType}
                setChartType={setChartType}
                isCFLoading={isCFLoading}
              />
              {/*========== END POWER CHART ==========*/}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

ProjectOverview.propTypes = {
  setIsShowSideBar: PropTypes.func
}

export default ProjectOverview
