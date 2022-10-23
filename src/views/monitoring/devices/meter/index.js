import React, { useEffect } from 'react'
import MeterTable from './MeterTable'
import { useQuery } from '@hooks/useQuery'
import ButtonPagination from '@src/views/common/buttons/ButtonPagination'
import { DEVICE_TYPE } from '@constants/project'
import { ROUTER_URL } from '@constants/router'
import { useDispatch, useSelector } from 'react-redux'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import { Card } from 'reactstrap'

const MonitoringMeter = () => {
  const {
      customerProject: { selectedProject }
    } = useSelector((state) => state),
    dispatch = useDispatch(),
    query = useQuery(),
    projectId = query.get('projectId'),
    deviceId = query.get('deviceId')

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

  return (
    <Card className='meter-details p-0 mb-0'>
      <div className='group'>
        {
          selectedProject?.devices?.length > 0 &&
          <ButtonPagination
            devices={selectedProject.devices.filter(device => device.typeDevice === DEVICE_TYPE.METER)}
            projectId={projectId}
            deviceId={deviceId}
            pathName={ROUTER_URL.PROJECT_METER_DETAIL}
          />
        }
      </div>
      <MeterTable />
    </Card>
  )
}

MonitoringMeter.propTypes = {}

export default MonitoringMeter
