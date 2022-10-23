// ** Third party components
import {
  Row,
  Col,
  Card,
  Label,
  Spinner
} from 'reactstrap'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import React, {
  useEffect,
  useState
} from 'react'
import _sumBy from 'lodash/sumBy'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import { getAllProjects } from '@src/views/monitoring/projects/store/actions'
import { STATE } from '@constants/common'
import {
  numberToFixed,
  numberWithCommas,
  renderDynamicUnit
} from '@utils'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { getProvinceLabel } from '@constants/province'
import SevenDayYieldChart from '@src/views/dashboard/cards/SevenDayYieldChart'
import axios from 'axios'
import { API_GET_EFF_FOR_CHART } from '@constants/api'
import moment from 'moment'
import ActivePowerAndIRRChart from '@src/views/dashboard/cards/ActivePowerAndIRRChart'

const Dashboard = ({ intl }) => {
  const dispatch = useDispatch()
  const {
      auth: { generalSetting },
      customerProject: { allData: projects }
    } = useSelector((state) => state),
    [todayActivePower, setTodayActivePower] = useState(0),
    [todayDCPower, setTodayDCPower] = useState(0),
    [totalYield7DaysByProvince, setTotalYield7DaysByProvince] = useState([]),
    [todayYield, setTodayYield] = useState(0),
    [yesterdayYield, setYesterdayYield] = useState(0),
    [monthlyYield, setMonthlyYield] = useState(0),
    [monthlyCF, setMonthlyCF] = useState(0),
    [yearlyYield, setYearlyYield] = useState(0),
    [yearlyCF, setYearlyCF] = useState(0),
    [averageProjectCF, setAverageProjectCF] = useState(0),
    [chartData, setChartData] = useState({
      time: [],
      activePowers: [],
      irr: []
    }),
    [isLoadingPowerIRRChart, setIsLoadingPowerIRRChart] = useState(false),
    [isLoadingInfo, setIsLoadingInfo] = useState(true),
    [selectedProjectIds, setSelectedProjectIds] = useState([])

  const getDataForChart = async ({ projectIds, chartType }) => {
    if (projectIds.length > 0) {
      return await axios
        .get(API_GET_EFF_FOR_CHART, {
          params: {
            projectIds: projectIds.toString(),
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            seconds: 300,
            chartType,
            order: 'createDate asc',
            rowsPerPage: -1
          },
          isNotCount: true
        })
        .then((response) => {
          return (
            response.data.data
          )
        })
        .catch((err) => {
          console.error('[getEffForChart] Error: ', err)
          return []
        })
    }

    return []
  }

  // Calculate data for power and irr chart
  const calculateDataForIRRChart = async (tempProjectIds) => {
    try {
      if (tempProjectIds.length) {
        setIsLoadingPowerIRRChart(true)
        const [irrData, activePowerData] = await Promise.all([
          getDataForChart({ projectIds: tempProjectIds, chartType: 'IRR' }),
          getDataForChart({ projectIds: tempProjectIds, chartType: 'AP' })
        ])

        const tempTimeData = [],
          tempActivePowerData = [],
          tempIrrData = []

        activePowerData?.forEach((ap) => {
          const tempTime = moment(ap.date, 'DD/MM/YYYY HH:mm:ss')

          if (
            (
              (
                tempTime.hours() < 6 || tempTime.hours() > 17
              ) && tempTime.minutes() === 0
            ) || (
              tempTime.hours() >= 6 && tempTime.hours() <= 17
            )
          ) {
            if (moment().subtract(3, 'minutes').diff(tempTime, 'seconds', true) >= 0) {
              tempActivePowerData.push(ap.ActivePower / 1000000 || 0)
              tempIrrData.push(irrData.find(irr => irr.date === ap.date)?.IRR || 0)
            }
            tempTimeData.push(tempTime.format('HH:mm'))
          }
        })

        setChartData({
          time: tempTimeData,
          activePowers: tempActivePowerData,
          irr: tempIrrData
        })
        setIsLoadingPowerIRRChart(false)
      } else {
        setChartData({
          time: [],
          activePowers: [],
          irr: []
        })
      }
    } catch (e) {
      console.error('[Dashboard][calculateDataForIRRChart] - Error: ', e.message)
    }
  }

  useEffect(async () => {
    setIsLoadingInfo(true)

    try {
      if (projects && projects.length) {
        let tempTodayActivePower = 0,
          tempTodayDCPower = 0,
          tempTodayYield = 0,
          tempYesterdayYield = 0,
          tempMonthlyYield = 0,
          tempYearlyYield = 0,
          tempTotalMonthlyCF = 0,
          tempTotalYearlyCF = 0
        const tempProjectIds = []

        const tempProvinces = {}
        // Calculate 7 days yield by locations
        const tempTimeLabels = [
          'last6DaysYield',
          'last5DaysYield',
          'last4DaysYield',
          'last3DaysYield',
          'last2DaysYield',
          'yesterdayYield',
          'todayYield'
        ]

        projects.forEach((project) => {
          // Push project id
          tempProjectIds.push(project.id)

          // Calculate CF
          tempTotalMonthlyCF += project.monthlyCF
          tempTotalYearlyCF += project.yearlyCF

          // Calculate total Yield in 7 days
          if (project?.provinceCode && project.provinceCode !== '0') {
            if (!tempProvinces[project.provinceCode]) {
              tempProvinces[project.provinceCode] = {
                name: intl.formatMessage({ id: getProvinceLabel(project.provinceCode) }),
                data: [0, 0, 0, 0, 0, 0, 0],
                projectIds: [project.id]
              }
            }

            tempTimeLabels.forEach((key, index) => {
              tempProvinces[project.provinceCode].data[index] += numberToFixed(project[key] / 1000000)
              tempProvinces[project.provinceCode].data[index] = numberToFixed(
                tempProvinces[project.provinceCode].data[index]
              )
            })

            if (!tempProvinces[project.provinceCode].projectIds.includes(project.id)) {
              tempProvinces[project.provinceCode].projectIds.push(project.id)
            }
          }

          if (project.devices && project.devices.length) {
            tempTodayActivePower += project.wattageAC
            tempTodayDCPower += project.wattageDC
            tempTodayYield += project.todayYield
            tempYesterdayYield += project.yesterdayYield
            tempMonthlyYield += project?.monthlyYield
            tempYearlyYield += project?.yearlyYield
          }
        })

        setTotalYield7DaysByProvince(Object.keys(tempProvinces).map((provinceCode) => tempProvinces[provinceCode]))
        setTodayActivePower(tempTodayActivePower)
        setTodayDCPower(tempTodayDCPower)
        setTodayYield(tempTodayYield)
        setYesterdayYield(tempYesterdayYield)
        setMonthlyYield(tempMonthlyYield)
        setYearlyYield(tempYearlyYield)
        setMonthlyCF(tempTotalMonthlyCF / projects.length)
        setYearlyCF(tempTotalYearlyCF / projects.length)
        setSelectedProjectIds(tempProjectIds)

        const totalWattageDC = _sumBy(projects, project => project.wattageDC)
        setAverageProjectCF(totalWattageDC
          ? tempTodayYield / totalWattageDC / 24
          : 0)

        // End loading projects information
        setIsLoadingInfo(false)

      }
    } catch (e) {
      console.error('[Dashboard][index.js] - Error: ', e.message)
    } finally {
      setIsLoadingInfo(false)
    }
  }, [projects])

  const renderRevenues = () => {
    const treeResult = renderDynamicUnit({
      value: generalSetting?.treesSavedRate * (yearlyYield / 1000),
      milUnit: intl.formatMessage({ id: 'million' }),
      thousandUnit: intl.formatMessage({ id: 'thousand' }),
      originUnit: null
    })
    const co2Result = renderDynamicUnit({
      value: generalSetting?.co2ReductionRate * (yearlyYield / 1000),
      milUnit: intl.formatMessage({ id: 'kiloton' }),
      thousandUnit: intl.formatMessage({ id: 'ton' }),
      originUnit: 'kg'
    })
    const items = [
      {
        value: numberWithCommas(monthlyYield / 1000000),
        unit: 'MWh',
        subValue: numberWithCommas(monthlyCF * 100),
        subUnit: '%',
        title: intl.formatMessage({ id: 'Monthly yield' })
      },
      {
        value: numberWithCommas(yearlyYield / 1000000),
        unit: 'MWh',
        subValue: numberWithCommas(yearlyCF * 100),
        subUnit: '%',
        title: intl.formatMessage({ id: 'Annual yield' })
      },
      {
        value: numberWithCommas(treeResult.value),
        unit: treeResult.unit,
        subValue: null,
        subUnit: null,
        title: intl.formatMessage({ id: 'Trees' })
      },
      {
        value: numberWithCommas(co2Result.value),
        unit: co2Result.unit,
        subValue: null,
        subUnit: null,
        title: intl.formatMessage({ id: 'CO2 reduction' })
      }
    ]

    return items.map((item, index) => {
      return (
        <Col
          md={3}
          key={index}
        >
          <Card className='card-revenue'>
            <aside className='value '>
              <span className='text-gradient'>{item.value}</span>
              {
                isLoadingInfo
                  ? <Spinner
                    color='success'
                    style={{ width: 15, height: 15 }}
                  />
                  : item.unit &&
                  <Label>
                    &nbsp;
                    {item.unit}
                  </Label>
              }
            </aside>
            {
              isLoadingInfo
                ? <Spinner
                  color='success'
                  style={{ width: 15, height: 15 }}
                />
                : <aside className='sub-value'>
                  {item.subValue}
                  {
                    item.subUnit &&
                    <Label>
                      &nbsp;
                      {item.subUnit}
                    </Label>
                  }
                </aside>
            }
            <aside className='title'>{item.title}</aside>
          </Card>
        </Col>
      )
    })
  }

  const countIndustrialArea = ({ projects, key }) => {
    const tempResult = []

    projects.forEach(project => {
      if (project[key] && !tempResult.includes(project[key])) {
        tempResult.push(project[key])
      }
    })

    return tempResult
  }

  const renderInfos = () => {
    const items = [
      {
        value: projects.length > 0
          ? countIndustrialArea({ projects, key: 'industrialAreaId' }).length
          : 0,
        unit: null,
        title: intl.formatMessage({ id: 'Industrial area' })
      },
      {
        value: projects.length,
        unit: null,
        title: intl.formatMessage({ id: 'Project' })
      },
      {
        value: numberWithCommas(todayDCPower / 1000000),
        unit: 'MWp',
        title: 'DC'
      },
      {
        value: numberWithCommas(todayActivePower / 1000000),
        unit: 'MW',
        title: 'AC'
      }
    ]

    return items.map((item, index) => {
      return (
        <Col
          md={3}
          key={index}
        >
          <Card className='card-info'>
            <aside className='value'>
              <span className='text-gradient'>{item.value >= 0
                ? item.value
                : '-'}</span>
              {
                item.unit &&
                <Label>
                  &nbsp;
                  {item.unit}
                </Label>
              }
            </aside>
            <span className='title'>{item.title}</span>
          </Card>
        </Col>
      )
    })
  }

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        dispatch(
          getAllProjects({
            state: [STATE.ACTIVE].toString(),
            rowsPerPage: -1,
            fk: '*',
            dashboard: true
          })
        )
      ])
    }

    fetchData()

    // Calculate delay time
    const currentTime = moment()
    const delayTime = Math.abs(((8 * 60 * 1000) - (currentTime.valueOf() % (5 * 60 * 1000))) % (5 * 60 * 1000))
    let intervalId = 0
    let timeoutId = 0

    timeoutId = setTimeout(() => {
      fetchData()
      intervalId = setInterval(fetchData, (process.env.REACT_APP_INTERVAL_MINUTES || 5) * 60 * 1000)
    }, delayTime)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedProjectIds.length) {
      calculateDataForIRRChart(selectedProjectIds)
    }
  }, [selectedProjectIds])

  return (
    <div
      className=''
      id='dashboard-analytics'
    >
      <Row className='d-flex'>
        <Col
          lg={4}
          md={12}
        >
          <Card className='capacity-factor'>
            <Row>
              <Col
                xs={5}
                className='left'
              >
                <aside className='circle'>
                  <span>{numberWithCommas(averageProjectCF * 100)}</span>
                  <span>%</span>
                </aside>
                <span className='text-capacity'>{intl.formatMessage({ id: 'Capacity factor' })}</span>
              </Col>
              <Col
                xs={7}
                className='right'
              >
                <aside className='today'>
                  <span className='text-gradient'>{numberWithCommas(todayYield / 1000000)}</span>
                  <span>MWh</span>
                </aside>
                <span className='text-today'>{intl.formatMessage({ id: 'Today yield' })}</span>
                <aside className='yesterday'>
                  <span>{intl.formatMessage({ id: 'Yesterday' })}&nbsp;</span>
                  <span>{numberWithCommas(yesterdayYield / 1000000)} <span>MWh</span></span>
                </aside>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col
          lg={8}
          md={12}
        >
          <Row>
            {renderRevenues()}
          </Row>
          <Row>
            {renderInfos()}
          </Row>
        </Col>
      </Row>

      {/* map */}
      <Row className='match-height'>
        <Col
          xl='7'
          md='7'
          xs='12'
        >
          <ActivePowerAndIRRChart
            timeData={chartData.time}
            activePowerData={chartData.activePowers}
            irrData={chartData.irr}
            isLoading={isLoadingPowerIRRChart}
          />
        </Col>
        <Col
          xl='5'
          md='5'
          xs='12'
        >
          <SevenDayYieldChart
            totalYield7DaysByProvince={totalYield7DaysByProvince}
            setSelectedProjectIds={setSelectedProjectIds}
          />
        </Col>
      </Row>
    </div>
  )
}

Dashboard.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(Dashboard)
