import { ROUTER_URL } from '@constants/router'
import { Link, useHistory } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { ReactComponent as MapIcon } from '@src/assets/images/svg/headerbar/icon-map.svg'
import { ReactComponent as InfoIcon } from '@src/assets/images/svg/headerbar/icon-info.svg'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { LightTooltip } from '@src/views/common/LightToolTip'

const NavbarDashboard = ({ intl }) => {
  const history = useHistory()
  const navItems = [
    {
      id: 'mapIcon',
      icon: <MapIcon />,
      path: ROUTER_URL.MAP,
      title: 'Map'
    },
    {
      id: 'infoIcon',
      icon: <InfoIcon />,
      path: ROUTER_URL.INFORMATION,
      title: 'Information'
    }
  ]

  const renderItems = (items) => {
    return (
      items.map((item, index) => (
        <LightTooltip title={intl.formatMessage({ id: item.title })} key={index}>
          <Link
            to={item.path}
            className={classnames('dashboard-nav-item', {
              ['active']: history.location.pathname === item.path
            })}
          >
            {item.icon}
          </Link>
        </LightTooltip>
      ))
    )
  }

  return (
    renderItems(navItems)
  )
}

NavbarDashboard.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(NavbarDashboard)
