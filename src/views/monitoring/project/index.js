import { Col, Row } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'
import 'react-slidedown/lib/slidedown.css'
import { useDispatch } from 'react-redux'
import classnames from 'classnames'

import ProjectDetailSideBar from '@src/views/common/ProjectDetailSideBar'
import { ROUTER_URL } from '@constants/router'
import ProjectOverview from '@src/views/monitoring/project/ProjectOverview'
import ProjectInformation from '@src/views/monitoring/project/information'
import { useQuery } from '@hooks/useQuery'
import { getProjectById } from '@src/views/monitoring/projects/store/actions'
import ProjectNavbar from '@src/views/common/navbar/ProjectNavbar'
import InverterPanel from '@src/views/monitoring/devices/inverter/InverterPanel'
import SingleLine from '@src/views/monitoring/project/devices/single-line'
import Inverters from '@src/views/monitoring/project/devices/inverters'
import Meters from '@src/views/monitoring/project/devices/meters'
import MonitoringMeter from '@src/views/monitoring/devices/meter'
import AlertPage from '@src/views/alert'
import Panels from '@src/views/monitoring/project/devices/panels'
import ProjectSetting from '@src/views/monitoring/project/ProjectSetting'
import ProjectChart from '@src/views/monitoring/project/chart'
import { GET_PROJECT_MONITORING } from '@constants/actions'
import Inverters2 from './devices/inverters/index2'

const ProjectDetail = () => {
  // ** history
  const history = useHistory(),
  query = useQuery(),
  projectId = query.get('projectId')

  // ** Store Vars
  const dispatch = useDispatch()

  const [isShowSideBar, setIsShowSideBar] = useState(true)

  const renderPage = (pathname) => {
    switch (pathname) {
      case ROUTER_URL.PROJECT_SINGLE_LINE:
        return <SingleLine />

      case ROUTER_URL.PROJECT_INVERTER:
        return <Inverters />

      case ROUTER_URL.PROJECT_INVERTER_DETAIL:
        return <InverterPanel />

      case ROUTER_URL.PROJECT_METER:
        return <Meters />

      case ROUTER_URL.PROJECT_METER_DETAIL:
        return <MonitoringMeter />

      case ROUTER_URL.PROJECT_PANEL:
        return <Panels />

      case ROUTER_URL.PROJECT_ALARM:
        return <AlertPage />

      case ROUTER_URL.PROJECT_INFO_GENERAL:
      case ROUTER_URL.PROJECT_INFO_COMMERCE:
      case ROUTER_URL.PROJECT_INFO_IMAGES:
      case ROUTER_URL.PROJECT_INFO_MAP:
        return <ProjectInformation />

      case ROUTER_URL.PROJECT_CHART:
        return <ProjectChart />

      case ROUTER_URL.PROJECT_SETTING:
        return <ProjectSetting />

      case ROUTER_URL.PROJECT_OVERVIEW:
        return <ProjectOverview setIsShowSideBar={setIsShowSideBar} />

      case ROUTER_URL.CONTROL: 
        return <Inverters2 />
    }
  }

  useEffect(() => {
    if (projectId) {
      dispatch(
        getProjectById({
          id: projectId,
          fk: '*'
        })
      )
    }

    return () => {
      dispatch({
        type: GET_PROJECT_MONITORING,
        projectMonitoring: {}
      })
    }
  }, [])

  return (
    <>
      <ProjectNavbar projectId={projectId} />
      <Row
        className={classnames({
          ['bg-project']: history.location.pathname !== ROUTER_URL.PROJECT_OVERVIEW
        })}
      >
        {history.location.pathname !== ROUTER_URL.PROJECT_OVERVIEW &&
          history.location.pathname !== ROUTER_URL.PROJECT_INFO_COMMERCE &&
          history.location.pathname !== ROUTER_URL.PROJECT_SINGLE_LINE && (
            <Col md={history.location.pathname === ROUTER_URL.PROJECT_CHART ? 3 : 2}>
              <ProjectDetailSideBar />
            </Col>
          )}

        <Col
          md={
            history.location.pathname !== ROUTER_URL.PROJECT_OVERVIEW &&
            history.location.pathname !== ROUTER_URL.PROJECT_INFO_COMMERCE &&
            history.location.pathname !== ROUTER_URL.PROJECT_SINGLE_LINE &&
            isShowSideBar
              ? history.location.pathname === ROUTER_URL.PROJECT_CHART
                ? 9
                : 10
              : 12
          }
        >
          {renderPage(history.location.pathname)}
        </Col>
      </Row>
    </>
  )
}

ProjectDetail.propTypes = {}

export default ProjectDetail
