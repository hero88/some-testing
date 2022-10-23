// ** Import react
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Import third party components
import { useForm } from 'react-hook-form'
import { Button, Media, Label, Row, Col, Input, FormGroup, Form, FormFeedback, FormText } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { showToast } from '@utils'
import { Slide, toast } from 'react-toastify'
import { AlertTriangle } from 'react-feather'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'
import classnames from 'classnames'

// ** Import custom components
import Avatar from '@components/avatar'
import { updateAccountInfo } from '@store/actions/auth'
import axios from 'axios'
import { API_POST_MEDIA } from '@constants/api'
import { VN_PHONE_REGEX } from '@constants/regex'
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.svg'
import { DEFAULT_AVATAR } from '@constants/common'

const MySweetAlert = withReactContent(SweetAlert)

const GeneralTabs = ({ intl }) => {
  const dispatch = useDispatch(),
    { auth: { userData }, layout: { skin, requestCount } } = useSelector(state => state),
    [avatar, setAvatar] = useState(DEFAULT_AVATAR)

  const SignupSchema = yup.object().shape({
    fullName: yup.string()
      .required(intl.formatMessage({ id: 'Full name is required' }))
      .min(3, intl.formatMessage({ id: 'Full name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Full name is invalid - max' }, { max: 256 })),
    phone: yup.string()
      .matches(
        VN_PHONE_REGEX,
        intl.formatMessage({ id: 'Phone number is invalid' })
      )
  })

  const { register, reset, errors, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      fullName: userData?.user?.fullName,
      phone: userData?.user?.phone
    }
  })

  useEffect(() => {
    if (userData?.user?.avatar && userData.user.avatar !== '') {
      setAvatar(userData.user.avatar)
    }
    reset({
      fullName: userData?.user?.fullName,
      phone: userData?.user?.phone
    })
  }, [userData])

  const onChange = async (e) => {
    const files = e.target.files

    if (files[0].size >= 1000000) {
      return toast.error(
        <FormText>
          <Avatar className='mr-1' color='light-danger' icon={<AlertTriangle size={14}/>}/>
          <FormattedMessage id="Image's size is too large"/>
        </FormText>
        ,
        { transition: Slide, autoClose: 5000 }
      )
    } else {
      const formData = new FormData()
      formData.append('file', files[0])

      await axios.post(API_POST_MEDIA, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(response => {
        if (response.data && response.data.status && response.data.data && response.data.data[0]) {
          setAvatar(response.data.data[0].url)
        } else {
          throw new Error(response.data.message)
        }
      }).catch(err => {
        showToast('error', `${err.response ? err.response.data.message : err.message}`)
      })
    }
  }

  const resetAvatar = () => {
    setValue('avatar', null)
    setAvatar(userData?.user?.avatar)
  }

  const resetForm = () => {
    resetAvatar()
    reset({
      fullName: userData?.user?.fullName,
      phones: userData?.user?.phones?.length ? userData?.user?.phones[0].value : userData?.user?.phones
    })
  }

  const onSubmit = (accountData) => {
    accountData.avatar = avatar !== DEFAULT_AVATAR ? avatar : undefined
    accountData.id = userData?.user?.id

    dispatch(updateAccountInfo(accountData))
  }

  const showConfirmPopup = (accountData) => {
    return MySweetAlert.fire({
      title: intl.formatMessage({ id: 'Change account info title' }),
      html: intl.formatMessage({ id: 'Change account info message' }),
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
    }).then(function(result) {
      if (result.value) {
        onSubmit(accountData)
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit(showConfirmPopup)} className='card full-height'>
      <div className='setting-header'>
        Thông tin tài khoản
      </div>
      <div className='p-3'>
        <Media className='add-user'>
          <div className='position-relative'>
            <img
              src={avatar}
              alt='avatar'
              height='150'
              width='150'
              onError={() => {
                setAvatar(defaultAvatar)
              }}
            />
            <Button.Ripple tag={Label} className='edit-profile' color='primary'>
              {/*<FormattedMessage id='Upload'/>*/}
              <Input
                id='avatar'
                name='avatar'
                type='file'
                onChange={onChange}
                hidden
                accept='image/*'
                innerRef={register()}
              />
            </Button.Ripple>
          </div>
          <Button.Ripple color='secondary' className='reset-avatar' outline onClick={resetAvatar}>
            <FormattedMessage id='Reset'/>
          </Button.Ripple>
          <span>
              <FormattedMessage id='Avatar upload limit' values={{ size: 1 }}/>
            </span>
        </Media>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for='fullName'><FormattedMessage id='Full name'/></Label>
              <Input
                id='fullName'
                name='fullName'
                innerRef={register({ required: true })}
                invalid={!!errors.fullName}
                placeholder={intl.formatMessage({ id: 'Full name' })}
              />
              {
                errors && errors.fullName &&
                <FormFeedback>{errors.fullName.message}</FormFeedback>
              }
            </FormGroup>
            <FormGroup>
              <Label for='phone'><FormattedMessage id='Phone'/></Label>
              <Input
                type='phone'
                name='phone'
                id='phone'
                innerRef={register()}
                invalid={!!errors.phone}
                placeholder='0909999999'
              />
              {errors && errors.phone && <FormFeedback>{errors.phone.message}:</FormFeedback>}
            </FormGroup>
            <Label><FormattedMessage id='Company'/>:</Label>
            {
              userData?.user?.customers?.length > 0 &&
              userData.user.customers.map((item, index) => <div key={index}>{item.fullName}</div>)
            }
          </Col>
          <Col md={12} className='d-flex justify-content-center mt-2'>
            <Button.Ripple type='submit' className='mr-1' color='primary' disabled={requestCount > 0}>
              <FormattedMessage id='Save changes'/>
            </Button.Ripple>
            <Button.Ripple color='secondary' outline onClick={resetForm}>
              <FormattedMessage id='Cancel'/>
            </Button.Ripple>
          </Col>
        </Row>
      </div>
    </Form>
  )
}

GeneralTabs.propTypes = {
  intl: PropTypes.object.isRequired,
  data: PropTypes.array
}

export default injectIntl(GeneralTabs)
