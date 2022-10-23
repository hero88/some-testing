import { useState, useContext, Fragment } from 'react'
import classnames from 'classnames'
import Avatar from '@components/avatar'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import { Coffee } from 'react-feather'
import { CardTitle, Form, Input, FormGroup, Label, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import { GoogleLogin } from 'react-google-login'

import '@styles/base/pages/page-auth.scss'
import { LOGIN_TYPE } from '@constants/user'
import { getUserAbility, getUserRoleLabel } from '@src/auth/utils'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import Spinner from '@components/spinner/Loading-spinner'
import FooterComponent from '@layouts/components/footer'
import { useSkin } from '@hooks/useSkin'
import { IntlContext } from '@src/utility/context/Internationalization'
import { PLACEHOLDER } from '@constants/common' // Uncomment if your require content fallback

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>
          <FormattedMessage id='Welcome message' values={{ name }} />
        </h6>
      </div>
    </div>
    <div className='toastify-body'>
      <FormattedHTMLMessage id='Logged in successfully message' values={{ role }} />
    </div>
  </Fragment>
)

ToastContent.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
}

const Login = ({ intl }) => {
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const {
    auth: { sessionTimeout },
    layout
  } = useSelector((state) => state)
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { register, errors, handleSubmit } = useForm()

  // eslint-disable-next-line no-unused-vars
  const [skin, setSkin] = useSkin()
  // ** Context
  const intlContext = useContext(IntlContext)

  const login = async (loginData) => {
    useJwt
      .login(loginData)
      .then(async (res) => {
        if (!res.data.status) {
          throw new Error(res.data.message)
        }

        const data = {
          accessToken: res?.data?.data?.accessToken,
          refreshToken: res?.data?.data?.refreshToken,
          user: res?.data?.data?.user
        }

        await dispatch(handleLogin(data))

        ability.update(getUserAbility(data.user?.group?.type))

        // Update theme and language
        await setSkin(data.user?.setting?.theme?.toLowerCase())
        await intlContext.switchLanguage(data.user?.setting?.defaultLanguage?.toLowerCase())

        if (sessionTimeout && history.length) {
          history.goBack()
        } else {
          history.push(getHomeRouteForLoggedInUser(data.user?.group?.type))
        }

        toast.success(
          <ToastContent
            name={loginData.email || loginData.username || 'John Doe'}
            role={intl.formatMessage({ id: getUserRoleLabel(data.user?.group?.type) })}
          />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
      })
      .catch((err) => {
        console.error('[Login][login] - Get error: ', err)
        toast.error(`${err.response ? err.response.data.message : err.message}`, {
          transition: Slide,
          hideProgressBar: false,
          autoClose: 3000
        })
      })
  }

  const onSubmit = () => {
    if (isObjEmpty(errors)) {
      login({
        username: email,
        password,
        typeLogin: LOGIN_TYPE.NORMAL
      })
    }
  }

  const responseGoogle = (response) => {
    if (response && response.profileObj) {
      login({
        username: response.profileObj.email,
        password: response.tokenId,
        typeLogin: LOGIN_TYPE.GOOGLE
      })
    }
  }

  return (
    <div className='login-page'>
      <div className='auth-wrapper auth-v1'>
        <div className='auth-inner card'>
          <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
            <img src={require('@src/assets/images/logo/logo.svg').default} alt='REE logo' />
          </Link>
          <CardTitle tag='h2' className='font-weight-bold text-center text-capitalize'>
            Energy solutions for green life
          </CardTitle>
          <Form className='auth-login-form' onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label className='form-label' for='login-email'>
                <FormattedMessage id='Email' />
              </Label>
              <Input
                autoFocus
                type='text'
                value={email}
                id='login-email'
                name='login-email'
                autoComplete='new-password'
                placeholder={PLACEHOLDER.USERNAME}
                onChange={(e) => setEmail(e.target.value)}
                className={classnames({ 'is-invalid': errors['login-email'] })}
                innerRef={register({ required: true, validate: (value) => value !== '' })}
              />
            </FormGroup>
            <FormGroup>
              <div className='d-flex justify-content-between'>
                <Label className='form-label' for='login-password'>
                  <FormattedMessage id='Password' />
                </Label>
              </div>
              <InputPasswordToggle
                value={password}
                id='login-password'
                name='login-password'
                autoComplete='true'
                onChange={(e) => setPassword(e.target.value)}
                className={`input-group-merge${classnames({ 'is-invalid': errors['login-password'] })}`}
                innerRef={register({ required: true, validate: (value) => value !== '' })}
              />
            </FormGroup>
            <FormGroup className='forgot-password'>
              <Link to='/forgot-password'>
                <FormattedMessage id='Forgot password?' />
              </Link>
            </FormGroup>
            <Button.Ripple type='submit' color='primary' block disabled={layout.requestCount > 0}>
              {intl.formatMessage({ id: 'Sign in' }).toUpperCase()}
            </Button.Ripple>
          </Form>
          <div className='divider my-2'>
            <div className='divider-text text-capitalize'>
              <FormattedMessage id='or' />
            </div>
          </div>
          <div className='auth-footer-btn d-flex justify-content-center'>
            <GoogleLogin
              className='w-100 d-flex justify-content-center btn-google-login'
              clientId={process.env.REACT_APP_GCP_OAUTH2_CLIENT_ID}
              buttonText={intl.formatMessage({ id: 'Sign in with Google' }).toUpperCase()}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>

        <footer
          className={classnames(`footer footer-light footer-static`)}
        >
          <FooterComponent />
        </footer>
      </div>
      {layout.requestCount > 0 && <Spinner />}
    </div>
  )
}

Login.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(Login)
