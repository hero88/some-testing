import { Card, CardBody, CardText, Col, Nav, NavItem, NavLink } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { Fragment, useEffect, useContext } from 'react'
import YieldReportTable from '@src/views/report/projects/YieldReportTable'
import OperationalReportTable from './OperationalReport'
import { ReactComponent as OperationReportIcon } from '@src/assets/images/svg/report/ic-operation-report.svg'
import { ReactComponent as OperationReportDarkIcon } from '@src/assets/images/svg/report/ic-operation-report-dark.svg'
import { ReactComponent as YieldReportIcon } from '@src/assets/images/svg/report/ic-yield-report.svg'
import { ReactComponent as YieldReportDarkIcon } from '@src/assets/images/svg/report/ic-yield-report-dark.svg'
import { ReactComponent as GeneralReportIcon } from '@src/assets/images/svg/report/ic-general-report.svg'
import { ReactComponent as GeneralReportDarkIcon } from '@src/assets/images/svg/report/ic-general-report-dark.svg'
import { ReactComponent as UserActivitiesReportIcon } from '@src/assets/images/svg/report/ic-activities-report.svg'
import { ReactComponent as UserActivitiesReportDarkIcon } from '@src/assets/images/svg/report/ic-activities-report-dark.svg'
import ActivitiesTableReport from '@src/views/report/projects/ActivitiesTableReport'
import { REPORT_TYPE, STATE as STATUS, STATE } from '@constants/common'
import {
  getAllProjects,
  getElectricity,
  getIndustrialAreas,
  getInvestors
} from '@src/views/monitoring/projects/store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { getAllCustomers } from '@src/views/settings/customers/store/actions'
import GeneralReport from '@src/views/report/projects/GeneralReport'
import { ROUTER_URL } from '@constants/router'
import { useHistory } from 'react-router-dom'

// Render report
export const renderReports = ({ reports, toggleTable }) => {
  return reports.map((report, index) => (
    <Col key={index} md={6} className='text-center'>
      <Card className='cursor-pointer' onClick={() => toggleTable(report.label)}>
        <CardBody>
          <img src={report.icon} alt={`${report.label} icon`} style={{ width: '150px', height: '150px' }} />
          <CardText className='mt-1'>
            <FormattedMessage id={report.label} />
          </CardText>
        </CardBody>
      </Card>
    </Col>
  ))
}

const ProjectsReport = () => {
  const history = useHistory()
  const dispatch = useDispatch(),
    {
      auth: { userData },
      layout: { skin }
    } = useSelector((store) => store)

  // ** Ability Context
  const ability = useContext(AbilityContext)

  useEffect(async () => {
    await Promise.all([
      dispatch(getAllProjects({
        state: [STATE.ACTIVE].toString(),
        order: 'name asc',
        userId: userData?.user?.id,
        rowsPerPage: -1
      })),
      dispatch(
        getElectricity({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      ),
      dispatch(
        getInvestors({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      ),
      dispatch(
        getIndustrialAreas({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      ),
      dispatch(
        getAllCustomers({
          state: [STATUS.ACTIVE].toString(),
          order: 'name asc',
          rowsPerPage: -1
        })
      )
    ])
  }, [])

  // Reports
  const reports = [
    {
      label: REPORT_TYPE.OPERATION,
      icon: skin === 'dark' ? <OperationReportDarkIcon /> : <OperationReportIcon />,
      component: <OperationalReportTable title='Project operational report' />,
      pathname: ROUTER_URL.REPORT_PROJECTS_OPERATION
    },
    {
      label: REPORT_TYPE.YIELD,
      icon: skin === 'dark' ? <YieldReportDarkIcon /> : <YieldReportIcon />,
      component: <YieldReportTable title='Yield report' />,
      pathname: ROUTER_URL.REPORT_PROJECTS_YIELD
    },
    {
      label: REPORT_TYPE.GENERAL,
      icon: skin === 'dark' ? <GeneralReportDarkIcon /> : <GeneralReportIcon />,
      component: <GeneralReport title='General report' />,
      pathname: ROUTER_URL.REPORT_PROJECTS_STATISTIC
    },
    {
      label: REPORT_TYPE.USER_ACTIVITIES,
      icon: skin === 'dark' ? <UserActivitiesReportDarkIcon /> : <UserActivitiesReportIcon />,
      component: <ActivitiesTableReport title='User activities report' />,
      pathname: ROUTER_URL.REPORT_PROJECTS_USER_ACTIVITIES
    }
  ]

  // Render nav items
  const renderNavItems = () => {
    return reports.map((item, index) => {
      return (
          item.label !== REPORT_TYPE.USER_ACTIVITIES
          || ability.can('manage', USER_ABILITY.CAN_VIEW_USER_ACTIVITIES_REPORT)
        ) &&
        (
          <Fragment key={index}>
            {
              <NavItem
                active={
                  item.label !== REPORT_TYPE.GENERAL
                    ? history.location.pathname === item.pathname
                    : (
                      history.location.pathname === item.pathname
                      || history.location.pathname === ROUTER_URL.REPORT_PROJECTS_STATISTIC
                      || history.location.pathname === ROUTER_URL.REPORT_PROJECTS_DEVICES
                    )
                }
              >
                <NavLink
                  onClick={() => {
                    history.push({
                      pathname: item.pathname
                    })
                  }}
                >
                  <span>{item.icon}</span>
                  <span><FormattedMessage id={item.label} /></span>
                </NavLink>
              </NavItem>
            }
          </Fragment>
        )
    })
  }

  // Render page component
  const renderPage = () => {
    switch (history.location.pathname) {
      case ROUTER_URL.REPORT_PROJECTS_YIELD:
        return <YieldReportTable title='Yield report' />

      case ROUTER_URL.REPORT_PROJECTS_GENERAL:
      case ROUTER_URL.REPORT_PROJECTS_STATISTIC:
      case ROUTER_URL.REPORT_PROJECTS_DEVICES:
        return <GeneralReport />

      case ROUTER_URL.REPORT_PROJECTS_USER_ACTIVITIES:
        return <ActivitiesTableReport title='User activities report' />

      case ROUTER_URL.REPORT_PROJECTS_OPERATION:
      default:
        return <OperationalReportTable title='Project operational report' />
    }
  }

  return (
    <div className='report-project'>
      <Nav pills>{renderNavItems()}</Nav>
      {renderPage()}
    </div>
  )
}

ProjectsReport.propTypes = {}

export default ProjectsReport
