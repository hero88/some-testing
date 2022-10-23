import { useState } from 'react'
import { isUserLoggedIn } from '@utils'
import { Link, Redirect } from 'react-router-dom'
import {
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Card,
  CardBody
} from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import axios from 'axios'
import { API_RESET_PASSWORD } from '@constants/api'
import { Slide, toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ROUTER_URL } from '@constants/router'
import { ReactComponent as LeftArrow } from '@src/assets/images/svg/reset-password/left-arrow.svg'
import { ReactComponent as RightArrow } from '@src/assets/images/svg/reset-password/right-arrow.svg'
import { ReactComponent as Close } from '@src/assets/images/svg/reset-password/close.svg'
import { ReactComponent as SuccessIcon } from '@src/assets/images/svg/reset-password/sucess-icon.svg'

const ForgotPassword = ({ intl }) => {
  const SignupSchema = yup.object().shape({
    email: yup
      .string()
      .required(intl.formatMessage({ id: 'Email is required' }))
      .email(intl.formatMessage({ id: 'Email is invalid' }))
  })
  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(SignupSchema),
    mode: 'onChange'
  })

  const [isResetPasswordSuccessfully, setIsResetPasswordSuccessfully] = useState(false)

  const sendResetLink = async (formData) => {
    await axios
      .post(API_RESET_PASSWORD, formData)
      .then((response) => {
        if (response.data.status && response.data.message) {
          setIsResetPasswordSuccessfully(true)
        } else {
          throw new Error(response.data.message)
        }
      })
      .catch((err) => {
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

  if (!isUserLoggedIn()) {
    return (
      <div className='forgot-password-page'>
        <div className='auth-wrapper auth-v1'>
          <div className={classnames('auth-inner', { ['auth-inner--success']: isResetPasswordSuccessfully })}>
            <Card className={classnames({ ['card--success']: isResetPasswordSuccessfully })}>
              {
                isResetPasswordSuccessfully
                ? <CardBody>
                  <div
                    className='close-btn'
                    onClick={() => setIsResetPasswordSuccessfully(false)}
                  >
                    <Close />
                  </div>
                  <div className='success-icon'>
                    <SuccessIcon />
                  </div>
                  <div className='text-center'>
                    <FormattedHTMLMessage id='Reset password successfully content' />
                  </div>
                  <p className='continue-with-email'>
                    <Link to={ROUTER_URL.LOGIN}>
                      <span className='align-middle'>
                        <FormattedMessage id='Back to login' />
                      </span>
                      &nbsp;
                      <RightArrow />
                    </Link>
                  </p>
                </CardBody>
                : <CardBody>
                  <CardTitle tag='h2' className='font-weight-bold text-center'>
                    <FormattedMessage id='Forgot password?' />
                  </CardTitle>
                  <CardText className='text-center'>
                    <FormattedHTMLMessage id='Forgot password content' />
                  </CardText>
                  <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit(sendResetLink)}>
                    <FormGroup>
                      <Label className='form-label' for='login-email'>
                        <FormattedMessage id='Email' />
                      </Label>
                      <Input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='john@example.com'
                        autoFocus
                        innerRef={register({ required: true })}
                        invalid={!!errors.email}
                      />
                      {errors && errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                    </FormGroup>
                    <Button.Ripple color='primary' block type='submit'>
                      {intl.formatMessage({ id: 'Send reset link' }).toUpperCase()}
                    </Button.Ripple>
                  </Form>
                  <p className='text-center mt-2'>
                    <Link to={ROUTER_URL.LOGIN}>
                      <LeftArrow />
                      &nbsp;
                      <span className='align-middle'>
                        <FormattedMessage id='Back to login' />
                      </span>
                    </Link>
                  </p>
                </CardBody>
              }
            </Card>
          </div>
        </div>
      </div>
    )
  } else {
    return <Redirect to='/' />
  }
}

ForgotPassword.propTypes = {
  intl: PropTypes.object.isRequired
}
export default injectIntl(ForgotPassword)
