import { useEffect, useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import MeasuringPointParameter from './MeasuringPointParameter'
import InverterChart from './InverterChart'
import ActiveAlert from '@src/views/monitoring/devices/common/ActiveAlert'
import HistoryAlert from '@src/views/monitoring/devices/common/HistoryAlert'
import { useQuery } from '@hooks/useQuery'
import { useDispatch } from 'react-redux'
import { getPanelsByInverterIds } from '@src/views/monitoring/devices/inverter/store/actions'

const MonitoringInverter = () => {
  const rawUserData = localStorage.getItem('userData')
  const userData = rawUserData ? JSON.parse(rawUserData) : undefined
  const dispatch = useDispatch()
  const query = useQuery(),
    deviceId = query.get('deviceId'),
    activeTab = query.get('activeTab')
  const [active, setActive] = useState(1)

  const toggle = (tab) => {
    setActive(tab)
  }

  const tabs = [
    { title: 'General information', value: 1 },
    { title: 'Active alert', value: 2 },
    { title: 'Alert history', value: 3 },
    { title: 'Chart', value: 4 }
  ]

  useEffect(() => {
    if (deviceId) {
      dispatch(getPanelsByInverterIds(deviceId))
    }
  }, [deviceId])

  useEffect(() => {
    if (activeTab) {
      setActive(Number(activeTab))
    }
  }, [activeTab])

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <NavItem key={index}>
        <NavLink
          active={active === tab.value}
          onClick={() => {
            toggle(tab.value)
          }}
        >
          <FormattedMessage id={tab.title} />
        </NavLink>
      </NavItem>
    ))
  }

  return (
    <>
      <Nav pills>{renderTabs()}</Nav>
      <TabContent className='py-50' activeTab={active}>
        {active === 1 && (
          <TabPane tabId={1}>
            <MeasuringPointParameter />
          </TabPane>
        )}
        {
          active === 2 &&
          <TabPane tabId={2}>
            <ActiveAlert filterData={{ type: 'device', id: deviceId, userId: userData?.id }} isHideDeviceNameColumn />
          </TabPane>
        }
        {
          active === 3 &&
          <TabPane tabId={3}>
            <HistoryAlert filterData={{ type: 'device', id: deviceId, userId: userData?.id }} isHideDeviceNameColumn />
          </TabPane>
        }
        {active === 4 && (
          <TabPane tabId={4}>
            <InverterChart />
          </TabPane>
        )}
      </TabContent>
    </>
  )
}

MonitoringInverter.propTypes = {}

export default MonitoringInverter
