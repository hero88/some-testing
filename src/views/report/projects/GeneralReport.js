import { ROUTER_URL } from '@constants/router'
import { Nav, NavItem } from 'reactstrap'
import classnames from 'classnames'
import { Link, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import GeneralReportTable2 from '@src/views/report/projects/GeneralReportTable2'
import GeneralReportTable from '@src/views/report/projects/GeneralReportTable'

const GeneralReport = () => {
  const history = useHistory()
  const navItems = [
    {
      pathname: ROUTER_URL.REPORT_PROJECTS_STATISTIC,
      search: '',
      title: 'Statistic report',
      isActive: history.location.pathname === ROUTER_URL.REPORT_PROJECTS_STATISTIC
    },
    {
      pathname: ROUTER_URL.REPORT_PROJECTS_DEVICES,
      search: '',
      title: 'Devices report',
      isActive: history.location.pathname === ROUTER_URL.REPORT_PROJECTS_DEVICES
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

  const renderPage = () => {
    switch (history.location.pathname) {
      case ROUTER_URL.REPORT_PROJECTS_DEVICES:
        return <GeneralReportTable2 />

      case ROUTER_URL.REPORT_PROJECTS_STATISTIC:
      default:
        return <GeneralReportTable />
    }
  }

  return (
    <>
      <Nav className='project-navbar report'>
        {renderItems(navItems)}
      </Nav>

      {renderPage()}
    </>
  )
}

GeneralReport.propTypes = {}

export default GeneralReport
