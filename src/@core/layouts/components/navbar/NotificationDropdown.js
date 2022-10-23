// ** React Imports
import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import notification from '@src/assets/images/svg/headerbar/icon-noti.svg'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button, Badge, Media, DropdownMenu, DropdownItem, DropdownToggle, Dropdown } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { ROUTER_URL } from '@constants/router'
import { useDispatch, useSelector } from 'react-redux'
import {
  renderAlertMessage,
  renderTypeIcon
} from '@src/views/alert/AlertTable'
import { markAsRead, markAsReadMessageById } from '@src/views/alert/store/action'
import moment from 'moment'
import _uniqBy from 'lodash/uniqBy'
import { DISPLAY_DATE_TIME_FORMAT } from '@constants/common'

const NotificationDropdown = () => {
  const history = useHistory()
  const {
      alert: { active }
    } = useSelector((state) => state),
    dispatch = useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false),
    [notifications, setNotifications] = useState([])

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  useEffect(() => {
    if (active?.firebaseMessages?.length >= 0) {
      const tempNotifications = []
      active.firebaseMessages.forEach((item) => {
        tempNotifications.push({
          avatarIcon: renderTypeIcon(item),
          color: 'light-warning',
          title: (
            <Media tag='p' heading>
              {renderAlertMessage({ type: item?.alertType, alertData: item })}
            </Media>
          ),
          subtitle: (
            <>
              <div>
                <FormattedMessage id='Project name' />: {item?.project?.name}
              </div>
              <div>
                <FormattedMessage id='Last sent date' />:{' '}
                {moment(Number(item?.lastSentDateTS)).format(DISPLAY_DATE_TIME_FORMAT)}
              </div>
              {item?.alertMessage?.type === 'RESEND' && (
                <Badge color='info' className='badge-glow mr-1'>
                  <FormattedMessage id='Resend' />
                </Badge>
              )}
            </>
          ),
          alert: item
        })
      })

      setNotifications(tempNotifications)
    }
  }, [active?.firebaseMessages])

  // ** Function to render Notifications
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notifications.map((item, index) => {
          return (
            <a
              key={index}
              className='d-flex'
              href='/'
              onClick={(e) => {
                e.preventDefault()
                dispatch(markAsReadMessageById({ id: item.id }))
                history.push({
                  pathname: ROUTER_URL.PROJECT_ALARM,
                  search: `projectId=${item?.alert?.project?.id}&alertType=activeAlert`
                })
                setDropdownOpen(false)
              }}
            >
              <Media
                className={classnames('d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                {!item.switch ? (
                  <Fragment>
                    <Media left>
                      <Avatar
                        {...(item.img
                             ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                             : item.avatarContent
                               ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                               : item.avatarIcon
                                 ? {
                                icon: item.avatarIcon,
                                color: item.color
                              }
                                 : null)}
                      />
                    </Media>
                    <Media body>
                      {item.title}
                      <small className='notification-text'>{item.subtitle}</small>
                    </Media>
                  </Fragment>
                ) : (
                   <Fragment>
                     {item.title}
                     {item.switch}
                   </Fragment>
                 )}
              </Media>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }

  // ** Mark all messages
  const markAllMessage = async () => {
    if (active?.firebaseMessages?.length > 0) {
      const messageIds = _uniqBy(active.firebaseMessages, 'id').map((item) => item.id)

      await dispatch(markAsRead({ data: { asReadIds: messageIds } }))
    }
  }

  return (
    <Dropdown tag='li' className='dropdown-notification nav-item mr-25' isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={(e) => e.preventDefault()}>
        <img src={notification} alt='notification'/>
        {active?.firebaseMessages?.length > 0 && (
          <Badge pill color='danger' className='badge-up'>
            {active.firebaseMessages.length}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex justify-content-between' tag='div' header>
            <Button.Ripple
              color='primary'
              onClick={() => {
                setDropdownOpen(false)
                history.push({
                  pathname: ROUTER_URL.ALERT,
                  search: 'alertType=activeAlert'
                })
              }}
            >
              <FormattedMessage id='See all' />
            </Button.Ripple>
            {active?.firebaseMessages?.length > 0 && (
              <Badge className='d-flex' tag='div' color='light-primary' pill>
                <span className='align-self-center'>
                  {active.firebaseMessages.length} <FormattedMessage id='New' />
                </span>
              </Badge>
            )}
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className='dropdown-menu-footer'>
          <Button.Ripple
            color='primary'
            block
            onClick={async () => {
              await markAllMessage()
              setNotifications([])
              setDropdownOpen(false)
            }}
          >
            <FormattedMessage id='Mark all as read' />
          </Button.Ripple>
        </li>
      </DropdownMenu>
    </Dropdown>
  )
}

export default NotificationDropdown
