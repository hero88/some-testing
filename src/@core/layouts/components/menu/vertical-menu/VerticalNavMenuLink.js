/* eslint no-unused-vars: 0 */  // --> OFF
// ** React Imports
import { useEffect, useRef } from 'react'
import { matchPath, NavLink, useLocation } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Badge, UncontrolledTooltip } from 'reactstrap'

// ** Vertical Menu Array Of Items
import navigation from '@src/navigation/vertical'

// ** Utils
import { getAllParents, search } from '@layouts/utils'
import { useSelector } from 'react-redux'

const VerticalNavMenuLink = ({
  item,
  groupActive,
  setGroupActive,
  activeItem,
  setActiveItem,
  groupOpen,
  setGroupOpen,
  toggleActiveGroup,
  parentItem,
  routerProps,
  currentActiveItem
}) => {
  const menuItemRef = useRef(null)

  // ** Store
  const { project: { pendingProject: { total: pendingProjectTotal } }} = useSelector(state => state)

  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** URL Vars
  const location = useLocation()
  const currentURL = location.pathname

  // ** To match path
  const match = matchPath(currentURL, {
    path: `${item.navLink}/:param`,
    exact: true,
    strict: false
  })

  // ** Search for current item parents
  const searchParents = (navigation, currentURL) => {
    const parents = search(navigation, currentURL, routerProps) // Search for parent object
    const allParents = getAllParents(parents, 'id') // Parents Object to Parents Array
    return allParents
  }

  // ** URL Vars
  const resetActiveGroup = navLink => {
    const parents = search(navigation, navLink, match)
    toggleActiveGroup(item.id, parents)
  }

  // ** Reset Active & Open Group Arrays
  const resetActiveAndOpenGroups = () => {
    setGroupActive([])
    setGroupOpen([])
  }

  // ** Checks url & updates active item
  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
      const arr = searchParents(navigation, currentURL)
      setGroupActive([...arr])
    }
  }, [location])

  return (
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
             ? {
            href: item.navLink || '/'
          }
             : {
            to: item.navLink || '/',
            isActive: (match, location) => {
              if (!match) {
                return false
              }

              if (match.url && match.url !== '' && match.url === item.navLink) {
                currentActiveItem = item.navLink
              }
            }
          })}
        /*eslint-enable */
        onClick={e => {
          if (!item.navLink.length) {
            e.preventDefault()
          }
          parentItem ? resetActiveGroup(item.navLink) : resetActiveAndOpenGroups()
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate' id={item.id} ref={menuItemRef} style={{ lineHeight: '19px' }}>
          <FormattedMessage id={item.title}/>
        </span>
        {
          menuItemRef.current &&
          (menuItemRef.current.offsetWidth < menuItemRef.current.scrollWidth) &&
          <UncontrolledTooltip placement='right' target={item.id}>
            <FormattedMessage id={item.title}/>
          </UncontrolledTooltip>
        }

        {item.badge && item.badgeText ? (
          <Badge className='ml-auto mr-1' color={item.badge} pill>
            {
              item.id === 'projectRequest'
              ? pendingProjectTotal > 0 ? pendingProjectTotal : ''
              : item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

VerticalNavMenuLink.propTypes = {
  item: PropTypes.object,
  groupActive: PropTypes.array,
  setGroupActive: PropTypes.func,
  activeItem: PropTypes.string,
  setActiveItem: PropTypes.func,
  groupOpen: PropTypes.array,
  setGroupOpen: PropTypes.func,
  toggleActiveGroup: PropTypes.func,
  parentItem: PropTypes.object,
  routerProps: PropTypes.object,
  currentActiveItem: PropTypes.string
}

export default VerticalNavMenuLink
