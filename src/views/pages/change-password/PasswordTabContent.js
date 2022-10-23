import * as yup from 'yup'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, FormGroup, Row, Col, Button, FormFeedback } from 'reactstrap'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import InputPasswordToggle from '@components/input-password-toggle'
import { API_CHANGE_PASSWORD } from '@constants/api'
import { PASSWORD_REGEX } from '@constants/regex'
import React from 'react'

const MySweetAlert = withReactContent(SweetAlert)

const PasswordTabContent = ({ intl }) => {
  const { auth: { userData }, layout: { requestCount, skin } } = useSelector(state => state)
  const SignupSchema = yup.object().shape({
    oldPassword: yup.string()
      .required(intl.formatMessage({ id: 'Password is required' }))
      .min(8, intl.formatMessage({ id: 'Password is invalid - min' }, { min: 8 }))
      .max(256, intl.formatMessage({ id: 'Password is invalid - max' }, { max: 256 }))
      .matches(
        PASSWORD_REGEX,
        intl.formatMessage({ id: 'Password is not match' })
      ),
    newPassword: yup.string()
      .required(intl.formatMessage({ id: 'Password is required' }))
      .min(8, intl.formatMessage({ id: 'Password is invalid - min' }, { min: 8 }))
      .max(256, intl.formatMessage({ id: 'Password is invalid - max' }, { max: 256 }))
      .matches(
        PASSWORD_REGEX,
        intl.formatMessage({ id: 'Password is not match' })
      ),
    confirmNewPassword: yup.string()
      .required(intl.formatMessage({ id: 'Password is required' }))
      .oneOf([yup.ref(`newPassword`), null], intl.formatMessage({ id: 'Password must match' }))
  })

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(SignupSchema),
    mode: 'onChange'
  })

  const onSubmit = (formData) => {
    axios.put(API_CHANGE_PASSWORD, {
      id: userData.id,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword
    }).then((response) => {
      if (response.data.status && response.data.message) {
        toast.success(
          response.data.message,
          { transition: Slide, hideProgressBar: false, autoClose: 3000 }
        )
      } else {
        throw new Error(response.data.message)
      }
    }).catch(err => {
      toast.error(
        `${
          err.response && err.response.data
          ? err.response.data?.errors && err.response.data?.errors[0]
            ? err.response.data?.errors[0]?.message
            : err.response.data?.message
          : err.message
        }`,
        { transition: Slide, hideProgressBar: false, autoClose: 3000 }
      )
    })
  }

  const showConfirmPopup = (accountData) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Change password title' }),
      html: intl.formatMessage({ id: 'Change password message' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'Yes' }),
      cancelButtonText: intl.formatMessage({ id: 'Cancel' }),
      customClass: {
        popup: classnames({
          'sweet-alert-popup--dark': skin === 'dark'
        }),
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        onSubmit(accountData)
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit(showConfirmPopup)} className='card full-height'>
      <div className='setting-header'>
        Thay đổi mật khẩu
      </div>

      <Row className='p-3'>
        <Col md='12'>
          <FormGroup>
            <InputPasswordToggle
              label={intl.formatMessage({ id: 'Old Password' })}
              htmlFor='oldPassword'
              name='oldPassword'
              innerRef={register({ required: true })}
              invalid={!!errors.oldPassword}
              className={classnames('input-group-merge', {
                'is-invalid': errors['oldPassword']
              })}
            />
            {errors && errors.oldPassword && <FormFeedback>{errors.oldPassword.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <InputPasswordToggle
              label={intl.formatMessage({ id: 'New Password' })}
              htmlFor='newPassword'
              name='newPassword'
              innerRef={register({ required: true })}
              invalid={!!errors.newPassword}
              className={classnames('input-group-merge', {
                'is-invalid': errors['newPassword']
              })}
            />
            {errors && errors.newPassword && <FormFeedback>{errors.newPassword.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <InputPasswordToggle
              label={intl.formatMessage({ id: 'Retype New Password' })}
              htmlFor='confirmNewPassword'
              name='confirmNewPassword'
              innerRef={register({ required: true })}
              invalid={!!errors.confirmNewPassword}
              className={classnames('input-group-merge', {
                'is-invalid': errors['confirmNewPassword']
              })}
            />
            {errors && errors.confirmNewPassword && <FormFeedback>{errors.confirmNewPassword.message}</FormFeedback>}
          </FormGroup>
        </Col>
        <Col className='mt-2 d-flex justify-content-center' md='12'>
          <Button.Ripple type='submit' className='mr-1' color='primary' disabled={requestCount > 0}>
            <FormattedMessage id='Save changes'/>
          </Button.Ripple>
          <Button.Ripple color='secondary' outline>
            <FormattedMessage id='Cancel'/>
          </Button.Ripple>
        </Col>
      </Row>
    </Form>
  )
}

PasswordTabContent.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(PasswordTabContent)
