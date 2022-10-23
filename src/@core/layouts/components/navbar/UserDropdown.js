// ** React Imports
import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getAccountInfo, handleLogout } from '@store/actions/auth'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { Power } from 'react-feather'
import { FormattedMessage, injectIntl } from 'react-intl'
import classnames from 'classnames'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import PropTypes from 'prop-types'
import axios from 'axios'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.svg'
import { API_GET_USER_INFO } from '@constants/api'
import { ROUTER_URL } from '@constants/router'
import { ReactComponent as SettingIcon } from '@src/assets/images/svg/headerbar/icon-setting.svg'

const MySweetAlert = withReactContent(SweetAlert)

const UserDropdown = ({ intl }) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const { layout: { skin }, auth: { userData } } = useSelector(state => state)

  // ** History
  const history = useHistory()

  //** ComponentDidMount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))

    axios.get(API_GET_USER_INFO, {
      params: {
        id: userData ? userData.id : null,
        fk: '["customers", "projects", "group"]'
      }
    })
      .then(response => {
        dispatch(getAccountInfo(response?.data?.data))
      })
  }, [])

  //** Vars
  const userAvatar = userData?.user?.avatar && userData.user.avatar !== '' ? userData.user.avatar : defaultAvatar

  const renderLogoutPopup = (event) => {
    event.preventDefault()

    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Logout title' }),
      html: intl.formatMessage({ id: 'Logout message' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Logout Yes button' }),
      cancelButtonText: intl.formatMessage({ id: 'Logout Cancel button' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark'
        }),
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1'
      },
      buttonsStyling: false
    }).then(function(result) {
      if (result.value) {
        dispatch(handleLogout())
        history.push(ROUTER_URL.LOGIN)
      }
    })
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>
            <span className='welcome'>
              <FormattedMessage id='Welcome' />,
            </span>
            &nbsp;
            {userData?.user?.fullName || 'Anonymous'}
          </span>
          <span className='user-status'>
            {
              userData?.user?.group?.name
              ? <FormattedMessage id={userData.user.group.name} />
              : ''
            }
          </span>
        </div>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to={ROUTER_URL.ACCOUNT_SETTING}>
          <span className='mr-75'><SettingIcon /></span>
          <span className='align-middle'><FormattedMessage id='My profile' /></span>
        </DropdownItem>
        <DropdownItem tag={Link} to={ROUTER_URL.LOGIN} onClick={renderLogoutPopup}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'><FormattedMessage id='Logout' /></span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

UserDropdown.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(UserDropdown)
