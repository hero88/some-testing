// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown'
import UserDropdown from './UserDropdown'
import NotificationDropdown from './NotificationDropdown'
import moon from '@src/assets/images/svg/headerbar/icon-moon.svg'
import sun from '@src/assets/images/svg/headerbar/icon-sun.svg'

// ** Third Party Components
// import { Sun, Moon } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import React from 'react'
import NavbarDashboard from '@layouts/components/navbar/NavbarDashboard'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props
  const history = useHistory()

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      // return <Sun className='ficon' onClick={() => setSkin('light')} />
      return <img src={sun} alt='sun' onClick={() => setSkin('light')} />
    } else {
      // return <Moon className='ficon' onClick={() => setSkin('dark')} />
      return <img src={moon} alt='moon' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <ul className='nav navbar-nav align-items-center ml-auto'>
      {
        (
          history.location.pathname === ROUTER_URL.HOME
          || history.location.pathname === ROUTER_URL.MAP
          || history.location.pathname === ROUTER_URL.ACCOUNT_SETTING
        )
        && <NavbarDashboard />
      }
      <NavItem>
        <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink>
      </NavItem>
      <NotificationDropdown />
      <IntlDropdown />
      <UserDropdown />
    </ul>
  )
}

NavbarUser.propTypes = {
  skin: PropTypes.string,
  setSkin: PropTypes.func
}

export default NavbarUser
