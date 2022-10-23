import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { useEffect, useState } from 'react'
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import InputPasswordToggle from '@components/input-password-toggle'

const SwaggerPage = () => {
  const [formModal, setFormModal] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    setFormModal(true)
  }, [])

  return (
    <>
      <Modal
        isOpen={formModal}
        className='modal-dialog-centered'
        backdrop='static'
      >
        <ModalHeader><FormattedMessage id='Login to view Swagger UI'/></ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='login-password'>
              <FormattedMessage id='Password' />&nbsp;
              <span className='text-danger'>*</span>
            </Label>
            <InputPasswordToggle
              id="login-password"
              name="login-password"
              autoComplete="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-group-merge${classnames({ 'is-invalid': password !== process.env.REACT_APP_SWAGGER_TOKEN })}`}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={() => {
              if (password === process.env.REACT_APP_SWAGGER_TOKEN) {
                setFormModal(false)
              }
            }}
          >
            <FormattedMessage id='Sign in' />
          </Button>{' '}
        </ModalFooter>
      </Modal>
      {
        !formModal &&
        <SwaggerUI url={process.env.REACT_APP_SWAGGER_URL} />
      }
    </>
  )
}

SwaggerPage.propTypes = {
  intl: PropTypes.object.isRequired
}

export default SwaggerPage
