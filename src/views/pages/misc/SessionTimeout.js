import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { handleLogout } from '@store/actions/auth'
import { useDispatch } from 'react-redux'
import { ROUTER_URL } from '@constants/router'

const SessionTimeout = ({ isOpen, toggle }) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    history = useHistory()

  const closePopup = () => {
    dispatch(handleLogout({ sessionTimeout: true, isTokenTimeOut: false }))
    toggle()
    history.push(ROUTER_URL.HOME)
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={closePopup}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <ModalHeader toggle={closePopup}><FormattedMessage id='Session timeout title' /></ModalHeader>
      <ModalBody className='d-flex justify-content-center text-center'>
        {<FormattedHTMLMessage id='Session timeout content' />}
      </ModalBody>
      <ModalFooter>
        <Button.Ripple color='primary' onClick={closePopup}>
          <FormattedMessage id='Session timeout button' />
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

SessionTimeout.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

export default SessionTimeout
