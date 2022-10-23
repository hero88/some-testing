import { ROUTER_URL } from '@constants/router'
import { Link, useHistory } from 'react-router-dom'
import { Nav, NavItem } from 'reactstrap'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const ProjectNavbar = ({ projectId }) => {
  const history = useHistory()
  const navItems = [
    {
      pathname: ROUTER_URL.PROJECT_OVERVIEW,
      search: `?projectId=${projectId}`,
      title: 'Overview',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_OVERVIEW
    },
    {
      pathname: ROUTER_URL.PROJECT_SINGLE_LINE,
      search: `?projectId=${projectId}`,
      title: 'Single line',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_SINGLE_LINE
    },
    {
      pathname: ROUTER_URL.PROJECT_INVERTER,
      search: `?projectId=${projectId}`,
      title: 'Inverter',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_INVERTER
        || history.location.pathname === ROUTER_URL.PROJECT_INVERTER_DETAIL
        || history.location.pathname === ROUTER_URL.PROJECT_PANEL
    },
    {
      pathname: ROUTER_URL.PROJECT_METER,
      search: `?projectId=${projectId}`,
      title: 'Meter',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_METER
        || history.location.pathname === ROUTER_URL.PROJECT_METER_DETAIL
    },
    {
      pathname: ROUTER_URL.PROJECT_ALARM,
      search: `?projectId=${projectId}&alertType=activeAlert`,
      title: 'Alarm',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_ALARM
    },
    {
      pathname: ROUTER_URL.PROJECT_CONTROL,
      search: `?projectId=${projectId}`,
      title: 'Control',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_CONTROL
    },
    {
      pathname: ROUTER_URL.PROJECT_INFO_GENERAL,
      search: `?projectId=${projectId}`,
      title: 'Information',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_INFO_GENERAL
        || history.location.pathname === ROUTER_URL.PROJECT_INFO_COMMERCE
        || history.location.pathname === ROUTER_URL.PROJECT_INFO_IMAGES
        || history.location.pathname === ROUTER_URL.PROJECT_INFO_MAP
    },
    {
      pathname: ROUTER_URL.PROJECT_CHART,
      search: `?projectId=${projectId}`,
      title: 'Chart',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_CHART
    },
    {
      pathname: ROUTER_URL.PROJECT_SETTING,
      search: `?projectId=${projectId}`,
      title: 'Setting',
      isActive: history.location.pathname === ROUTER_URL.PROJECT_SETTING
    }
  ]

  const renderItems = (items) => {
    return items.map((item, index) => {
      return <NavItem
        key={index}
        className={classnames('cursor-pointer', {
          ['active']: item.isActive
        })}
        onClick={() => {
          history.push({
            pathname: item.pathname,
            search: item.search
          })
        }}
      >
        <Link
          to={{
            pathname: item.pathname,
            search: item.search
          }}
        >
          <FormattedMessage id={item.title} />
        </Link>
      </NavItem>
    })
  }

  return (
    <Nav className='project-navbar'>
      {renderItems(navItems)}
    </Nav>
  )
}

ProjectNavbar.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default ProjectNavbar
