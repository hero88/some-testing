// ** Import react
import { useEffect, useState } from 'react'

// ** Import Third party components
import { CardText, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

// ** Customer components
import MonitoringInverter from '@src/views/monitoring/devices/inverter'
import MonitoringMeter from '@src/views/monitoring/devices/meter'
import InverterPanel from '@src/views/monitoring/devices/inverter/InverterPanel'
import { useQuery } from '@hooks/useQuery'
import { DEVICE_TYPE } from '@constants/project'
import { getMeterById } from '@src/views/monitoring/project/devices/meters/store/actions'
import { getInverterById } from '@src/views/monitoring/project/devices/inverters/store/actions'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'

const MonitoringDevices = () => {
  const {
      inverter: { selectedInverter },
      meter: { selectedMeter }
    } = useSelector((state) => state),
    dispatch = useDispatch(),
    query = useQuery(),
    deviceId = query.get('deviceId'),
    typeDevice = query.get('typeDevice'),
    projectId = query.get('projectId')
  const [active, setActive] = useState(null)

  useEffect(() => {
    setActive(Number(typeDevice))

    if (Number(typeDevice) === DEVICE_TYPE.METER) {
      dispatch(getMeterById({ id: deviceId, fk: JSON.stringify(['project']) }))
    } else if (Number(typeDevice) === DEVICE_TYPE.INVERTER) {
      dispatch(getInverterById({ id: deviceId, fk: JSON.stringify(['project']) }))
    }
  }, [deviceId])

  useEffect(() => {
    if (projectId) {
      dispatch(
        getProjectById({
          id: projectId,
          fk: JSON.stringify(['users', 'devices', 'contacts', 'customer'])
        })
      )
    }
  }, [projectId])

  const toggle = (tab) => {
    setActive(tab)
  }

  return (
    <>
      <Nav pills>
        {active === DEVICE_TYPE.INVERTER && (
          <NavItem>
            <NavLink
              active={active === DEVICE_TYPE.INVERTER}
              onClick={() => {
                toggle(DEVICE_TYPE.INVERTER)
              }}
            >
              <FormattedMessage id='Inverters' />
            </NavLink>
          </NavItem>
        )}
        {active === DEVICE_TYPE.METER && (
          <NavItem>
            <NavLink
              active={active === DEVICE_TYPE.METER}
              onClick={() => {
                toggle(DEVICE_TYPE.METER)
              }}
            >
              <FormattedMessage id='Meters' />
            </NavLink>
          </NavItem>
        )}
      </Nav>
      <TabContent className='py-50' activeTab={active}>
        {active === DEVICE_TYPE.INVERTER && (
          <TabPane tabId={DEVICE_TYPE.INVERTER}>
            <h2 className='text-center'>{selectedInverter?.name}</h2>
            <div className='d-flex justify-content-center'>
              <CardText className='mr-1'>
                <FormattedMessage id='Project name' />: [
                {typeof selectedInverter?.project?.code === 'string'
                 ? selectedInverter?.project?.code?.substring(0, 4)
                 : '--'}
                ]{selectedInverter?.project?.name}
              </CardText>
              <CardText className='mr-1'>
                <FormattedMessage id='Device S/N' />: {selectedInverter?.serialNumber || '--'}
              </CardText>
              <CardText className='mr-1'>
                <FormattedMessage id='Model' />: {selectedInverter?.model || '--'}
              </CardText>
            </div>
            <InverterPanel />
            <MonitoringInverter />
          </TabPane>
        )}

        {active === DEVICE_TYPE.METER && (
          <TabPane tabId={DEVICE_TYPE.METER}>
            <h2 className='text-center'>{selectedMeter?.name || ''}</h2>
            <div className='d-flex justify-content-center'>
              <CardText className='mr-1'>
                <FormattedMessage id='Project name' />: [
                {typeof selectedMeter?.project?.code === 'string' ? selectedMeter.project.code.substring(0, 4) : ''}]
                {selectedMeter?.project?.name}
              </CardText>
              <CardText className='mr-1'>
                <FormattedMessage id='Device S/N' />: {selectedMeter?.serialNumber || ''}
              </CardText>
              <CardText className='mr-1'>
                <FormattedMessage id='Model' />: {selectedMeter?.model || ''}
              </CardText>
            </div>
            <MonitoringMeter />
          </TabPane>
        )}
      </TabContent>
    </>
  )
}

MonitoringDevices.propTypes = {}

export default MonitoringDevices
