// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PropTypes from 'prop-types'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/actions/layout'

// ** Styles
import 'animate.css/animate.css'
import PreventLeavePageModal from '@src/views/common/modal/PreventLeavePageModal'
import { isUserLoggedIn } from '@src/utility/Utils'
import { getPermissionsbyUserId } from '@src/redux/actions/auth'
import { SET_IS_FETCHED_PERMISSION } from '@src/utility/constants'

const LayoutWrapper = (props) => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props
  const isFetchedPermision = useSelector((state) => state.auth?.isFetchedPermision)

  // ** Store Vars
  const dispatch = useDispatch()
  const {
    navbar: navbarStore,
    layout: { contentWidth }
  } = useSelector((state) => state)

  useEffect(() => {
    if (isUserLoggedIn() && !isFetchedPermision) {
      dispatch(
        getPermissionsbyUserId({
          callback: () => {
            dispatch({
              type: SET_IS_FETCHED_PERMISSION,
              payload: true
            })
          }
        })
      )
    }
  }, [isUserLoggedIn()])

  //** Vars
  const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth('full'))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden))
      }
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden))
      }
    }

    return () => {
      cleanUp()
    }
  }, [])

  return (
    <div
      className={classnames('app-content content', {
        [wrapperClass]: wrapperClass,
        'show-overlay': navbarStore.query.length
      })}
    >
      <PreventLeavePageModal />
      <div className="content-overlay" />
      {/*<div className='header-navbar-shadow'/>*/}
      <div
        className={classnames({
          'content-wrapper': !appLayout,
          'content-area-wrapper': appLayout,
          'container p-0': contentWidth === 'boxed',
          [`animate__animated animate__${transition}`]: transition !== 'none' && transition.length
        })}
      >
        <Tag
          /*eslint-disable */
          {...(layout === 'HorizontalLayout' && !appLayout
            ? { className: classnames({ 'content-body': !appLayout }) }
            : {})}
          /*eslint-enable */
        >
          {isFetchedPermision && children}
        </Tag>
      </div>
    </div>
  )
}

LayoutWrapper.propTypes = {
  layout: PropTypes.string,
  children: PropTypes.node,
  appLayout: PropTypes.bool,
  wrapperClass: PropTypes.string,
  transition: PropTypes.string,
  routeMeta: PropTypes.object
}

export default LayoutWrapper
