// ** Import React
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'

// ** Custom component
import { editUser } from '@src/views/settings/users/store/actions'
import InputPasswordToggle from '@components/input-password-toggle'
import { PASSWORD_REGEX } from '@constants/regex'

const ChangePassword = ({
  intl,
  isShowChangePassword,
  setIsShowChangePassword
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      user: { params, selectedUser }
    } = useSelector(store => store)

  const SignupSchema = yup.object().shape({
    password: yup.string()
      .required(intl.formatMessage({ id: 'Password is required' }))
      .min(8, intl.formatMessage({ id: 'Password is invalid - min' }, { min: 8 }))
      .max(256, intl.formatMessage({ id: 'Password is invalid - max' }, { max: 256 }))
      .matches(
        PASSWORD_REGEX,
        intl.formatMessage({ id: 'Password is not match' })
      ),
    confirmPassword: yup.string()
      .required(intl.formatMessage({ id: 'Password is required' }))
      .oneOf([yup.ref(`password`), null], intl.formatMessage({ id: 'Password must match' }))
  })

  const { register, errors, clearErrors, handleSubmit, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data) => {
    dispatch(editUser({ id: selectedUser.id, ...data }, params))
    setIsShowChangePassword(false)
    reset({})
  }

  const handleCancel = () => {
    clearErrors()
    reset({}, {
      keepErrors: true,
      keepDirty: true,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false
    })
    setIsShowChangePassword(false)
  }

  useEffect(async () => {
    reset({})
  }, [selectedUser, isShowChangePassword])

  return (
    <Modal
      isOpen={isShowChangePassword}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={handleCancel}>
          <FormattedMessage id={'Change password'}/>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <InputPasswordToggle
              label={
                <Label for='password'>
                  <FormattedMessage id='Password'/>
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
              }
              htmlFor='password'
              name='password'
              autoComplete='new-password'
              innerRef={register({ required: true })}
              invalid={!!errors.password}
              className={classnames('input-group-merge', {
                'is-invalid': errors['password']
              })}
            />
            {errors && errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <InputPasswordToggle
              label={
                <Label for='username'>
                  <FormattedMessage id='Confirm password'/>
                  <span className='text-danger'>&nbsp;*</span>
                </Label>
              }
              htmlFor='confirmPassword'
              name='confirmPassword'
              autoComplete='new-password'
              innerRef={register({ required: true })}
              invalid={!!errors.confirmPassword}
              className={classnames('input-group-merge', {
                'is-invalid': errors['confirmPassword']
              })}
            />
            {errors && errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' type='submit'>
            <FormattedMessage id={'Update'}/>
          </Button>
          <Button color='secondary' onClick={handleCancel}>
            <FormattedMessage id='Cancel'/>
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

ChangePassword.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowChangePassword: PropTypes.bool.isRequired,
  setIsShowChangePassword: PropTypes.func.isRequired
}

export default injectIntl(ChangePassword)
