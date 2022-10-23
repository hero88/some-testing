import {} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _orderBy from 'lodash/orderBy'

// ** Import custom components
import { numberWithCommas } from '@utils'
import { ROUTER_URL } from '@constants/router'
import ChartFilter from '@src/views/monitoring/project/chart/ChartFilter'
import { DEVICE_TYPE } from '@constants/project'

const ProjectDetailSideBar = () => {
  const history = useHistory()
  // ** Store & dispatch
  const {
    customerProject: { selectedProject }
  } = useSelector((state) => state)

  const currentACPower = selectedProject?.wattageAC || 0
  const currentDCPower = selectedProject?.wattageDC || 0
  const powerPercentage = currentDCPower > 0
    ? numberWithCommas(currentACPower / currentDCPower * 100)
    : 0
  const inverters = selectedProject?.devices?.length > 0
    ? selectedProject.devices.filter(device => device.typeDevice === DEVICE_TYPE.INVERTER)
    : []
  const meters = selectedProject?.devices?.length > 0
    ? selectedProject.devices.filter(device => device.typeDevice === DEVICE_TYPE.METER)
    : []

  return (
    <div className='sidebar-project'>
      <span className='project-name'>{selectedProject?.name}</span>
      <aside className='level1'>
        <span>{selectedProject?.code}</span>
        <span>{selectedProject?.electricityCode}</span>
        <span>{selectedProject?.electricityName}</span>
      </aside>
      <aside className='level2'>
        <span>
          {numberWithCommas(currentDCPower / 1000)} kWp
        </span>
        <span>
          <FormattedMessage id='Project DC power' />
        </span>
      </aside>
      <aside className='level2'>
        <span>
          {numberWithCommas(currentACPower / 1000)} kW
        </span>
        <span>
          <FormattedMessage id='Project AC power' />
        </span>
      </aside>
      <aside className='level2'>
        <span className='percent'>
          {powerPercentage}&nbsp;%
        </span>
        <span>
          <FormattedMessage id='AC/DC ratio' />
        </span>
      </aside>
      {
        history.location.pathname === ROUTER_URL.PROJECT_CHART &&
        <ChartFilter
          project={selectedProject}
          inverters={_orderBy(inverters, ['name'])}
          meters={meters}
        />
      }
    </div>
  )
}

ProjectDetailSideBar.propTypes = {}

export default ProjectDetailSideBar
