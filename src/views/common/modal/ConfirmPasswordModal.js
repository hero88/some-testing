import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import PropTypes from 'prop-types'
import InputPasswordToggle from '@components/input-password-toggle'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const ConfirmPasswordModal = ({ intl, isOpen, setIsOpen, handleConfirm, title }) => {
  const SignupSchema = yup.object().shape({
    password: yup.string()
      .required(intl.formatMessage({ id: 'Password is required' }))
      .min(6, intl.formatMessage({ id: 'Password is invalid - min' }, { min: 6 }))
      .max(256, intl.formatMessage({ id: 'Password is invalid - max' }, { max: 256 }))
  }, ['password'])

  const {
    register,
    errors,
    handleSubmit
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = (values) => {
    handleConfirm(values.password)
  }

  return (

    <Modal
      isOpen={isOpen}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='password'>
              <FormattedMessage id='Password'/>&nbsp;
              <span className='text-danger'>*</span>
            </Label>
            <InputPasswordToggle
              id='password'
              name='password'
              autoComplete='new-password'
              htmlFor='password'
              innerRef={register({ required: true, validate: (value) => value !== '' })}
              invalid={!!errors.password}
            />
            {
              errors && errors.password
              && <div
                className='text-danger font-small-3'
              >
                {errors.password.message}
              </div>
            }
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            type='submit'
          >
            <FormattedMessage id='Confirm'/>
          </Button>{' '}
          <Button
            color='secondary'
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            <FormattedMessage id='Cancel'/>
          </Button>
        </ModalFooter>
      </Form>
    </Modal>

  )
}

ConfirmPasswordModal.propTypes = {
  intl: PropTypes.object,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired
}

export default injectIntl(ConfirmPasswordModal)
