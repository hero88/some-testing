// ** React Imports
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import expand from '@src/assets/images/svg/sidebar/icon-expand.svg'
import collapse from '@src/assets/images/svg/sidebar/icon-collapse.svg'

// ** Third Party Components
import { X } from 'react-feather'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// ** Config
import themeConfig from '@configs/themeConfig'

const VerticalMenuHeader = props => {
  // ** Props
  const { menuCollapsed, setMenuCollapsed, menuVisibility, setMenuVisibility, setGroupOpen, menuHover } = props

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <img src={expand} alt='expand'
             data-tour='toggle-icon'
             className='toggle-icon d-none d-xl-block'
             onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <img src={collapse} alt='expand'
             data-tour='toggle-icon'
             className='toggle-icon d-none d-xl-block'
             onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div
      className={classnames(
        'navbar-header',
        { 'navbar-header--custom': !menuCollapsed || menuHover || (menuVisibility && window.innerWidth < 1200) }
      )}>
      <ul className={classnames(
        'nav navbar-nav flex-row'
      )}>
        <li className={classnames(
          'nav-item flex-row mr-auto'
        )}>
          <NavLink to='/' className={classnames('navbar-brand d-flex')}>
            <span className='brand-logo'>
              <img src={themeConfig.app.appLogoImage} alt='logo'/>
            </span>
            {themeConfig.app.appName && <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>}
          </NavLink>
        </li>
        <li className={classnames('nav-item nav-toggle')}>
          <div className='nav-link modern-nav-toggle cursor-pointer'>
            <Toggler/>
            <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20}/>
          </div>
        </li>
      </ul>
    </div>
  )
}

VerticalMenuHeader.propTypes = {
  menuCollapsed: PropTypes.bool,
  setMenuCollapsed: PropTypes.func,
  setMenuVisibility: PropTypes.func,
  setGroupOpen: PropTypes.func,
  menuHover: PropTypes.bool,
  menuVisibility: PropTypes.bool
}

export default VerticalMenuHeader
