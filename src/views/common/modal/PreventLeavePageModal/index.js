import { SET_FORM_DIRTY } from '@src/utility/constants'
import { bool } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import { Prompt, useHistory } from 'react-router-dom'
import { Col, Modal, ModalBody, ModalHeader, Row, Button } from 'reactstrap'
import './styles.scss'

export default function PreventLeavePageModal() {
  const [modalVisible, updateModalVisible] = useState(false)
  const [lastLocation, updateLastLocation] = useState()
  const [confirmedNavigation, updateConfirmedNavigation] = useState(false)

  const {
    form: { isFormGlobalDirty }
  } = useSelector((state) => state)
  const history = useHistory()
  const dispatch = useDispatch()

  const showModal = (location) => {
    updateModalVisible(true)
    updateLastLocation(location)
  }

  const closeModal = (cb) => () => {
    updateModalVisible(false)
    if (cb) {
      cb()
    }
  }

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation) {
      showModal(nextLocation)
      return false
    }
    return true
  }
  const handleConfirmNavigationClick = () => {
    dispatch({
      type: SET_FORM_DIRTY,
      payload: false
    })
    closeModal(() => {
      if (lastLocation) {
        updateConfirmedNavigation(true)
      }
    })()
  }

  const navigate = (path) => {
    history.push(path)
  }

  useEffect(() => {
    if (confirmedNavigation) {
      navigate(lastLocation.pathname)
      updateConfirmedNavigation(false)
    }
  }, [confirmedNavigation])
  return (
    <>
      <Prompt when={isFormGlobalDirty} message={handleBlockedNavigation} />
      <Modal isOpen={modalVisible} className="modal-dialog-centered" backdrop="static">
        <ModalHeader>
          <FormattedMessage id="Cancel confirmation" />
        </ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-center align-items-center py-2">
            <span className="confirm-msg">
              <FormattedMessage id="Are you sure to cancel?" />
            </span>
          </div>
        </ModalBody>
        <Row>
          <Col className="d-flex justify-content-center align-items-center mb-2">
            <Button type="submit" color="primary" className="mr-1 px-3" onClick={handleConfirmNavigationClick}>
              <FormattedMessage id="Yes" />
            </Button>{' '}
            <Button color="secondary" onClick={closeModal()}>
              <FormattedMessage id="No, Thanks" />
            </Button>{' '}
          </Col>
        </Row>
      </Modal>
    </>
  )
}

PreventLeavePageModal.propTypes = {
  when: bool
}
