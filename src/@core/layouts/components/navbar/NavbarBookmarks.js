// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import * as Icon from 'react-feather'
import {
  NavItem,
  NavLink
} from 'reactstrap'
import PropTypes from 'prop-types'

const NavbarBookmarks = props => {
  // ** Props
  const { setMenuVisibility } = props

  return (
    <Fragment>
      <ul className='navbar-nav d-xl-none'>
        <NavItem className='mobile-menu mr-auto'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
            <Icon.Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
    </Fragment>
  )
}

NavbarBookmarks.propTypes = {
  setMenuVisibility: PropTypes.func
}

export default NavbarBookmarks
