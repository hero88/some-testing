/// ** React Imports
import {
  useEffect,
  useState
} from 'react'

// ** Third Party Components
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import PropTypes from 'prop-types'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import { AlertTriangle } from 'react-feather'
import axios from 'axios'
import {
  Slide,
  toast
} from 'react-toastify'
import * as yup from 'yup'
import {
  Controller,
  useForm
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'

// ** Custom Components
import {
  addCustomer,
  editCustomer
} from '@src/views/settings/customers/store/actions'
import {
  selectThemeColors,
  showToast
} from '@utils'
import {
  CUSTOMER_CODE,
  VN_PHONE_REGEX
} from '@constants/regex'
import Avatar from '@components/avatar'
import { API_POST_MEDIA } from '@constants/api'
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.svg'
import {
  DEFAULT_AVATAR,
  PLACEHOLDER
} from '@constants/common'
import { editUser } from '@src/views/settings/users/store/actions'
import { USER_ROLE } from '@constants/user'
import _unionBy from 'lodash/unionBy'

const CustomerDetail = ({
  isShowCustomerDetail,
  setIsShowCustomerDetail,
  customerDetailTitle,
  isEditCustomer,
  isViewCustomer,
  intl
}) => {
  // ** Store Vars
  const dispatch = useDispatch(),
    {
      customer: { params: customerParams, selectedCustomer },
      user: { allData: userData }
    } = useSelector(state => state)

  const [userOptions, setUserOptions] = useState([]),
    [avatar, setAvatar] = useState(
      isEditCustomer
        ? selectedCustomer.avatar
        : DEFAULT_AVATAR)

  const onChange = async (e) => {
    const files = e.target.files

    if (files[0].size >= 1000000) {
      return toast.error(
        <FormText>
          <Avatar
            className='mr-1'
            color='light-danger'
            icon={<AlertTriangle size={14}/>}
          />
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
        showToast(
          'error',
          `${err.response
            ? err.response.data.message
            : err.message}`
        )
      })
    }
  }

  useEffect(() => {
    if (userData?.length > 0) {
      // Remove ADMIN PORTER users
      const filteredUsers = userData.filter(user => {
        return user?.group?.type !== USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE
          && user?.group?.type !== USER_ROLE.ADMIN_PORTAL_USER.VALUE
      })
      setUserOptions(filteredUsers.map((user) => (
        {
          label: user.fullName,
          value: user.id
        }
      )))
    }
  }, [userData])

  const SignupSchema = yup.object().shape({
    fullName: yup.string()
      .required(intl.formatMessage({ id: 'Customer name is required' }))
      .min(3, intl.formatMessage({ id: 'Customer name is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Customer name is invalid - max' }, { max: 256 })),
    email: yup.string()
      .email(intl.formatMessage({ id: 'Email is invalid' })),
    address: yup.string()
      .required(intl.formatMessage({ id: 'Address is required' }))
      .min(3, intl.formatMessage({ id: 'Address is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Address is invalid - max' }, { max: 256 })),
    phone: yup.string()
      .matches(
        VN_PHONE_REGEX,
        intl.formatMessage({ id: 'Phone number is invalid' })
      ),
    code: yup
      .string()
      .required(intl.formatMessage({ id: 'Customer code is required' }))
      .min(3, intl.formatMessage({ id: 'Customer code is invalid - min' }, { min: 3 }))
      .max(256, intl.formatMessage({ id: 'Customer code is invalid - max' }, { max: 256 }))
      .matches(CUSTOMER_CODE, intl.formatMessage({ id: 'Must be uppercase' }))
  })

  const initCustomer = {
    fullName: '',
    address: '',
    code: '',
    email: '',
    phone: ''
  }

  const { control, register, errors, clearErrors, handleSubmit, reset, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues: initCustomer
  })

  const onSubmit = async (data) => {
    data.avatar =
      avatar !== DEFAULT_AVATAR
        ? avatar
        : undefined

    if (data.users && data.users.length) {
      data.users = data.users.map(item => item.value)
    }

    if (isEditCustomer) {
      // Union projects
      const unionProjects = _unionBy(
        selectedCustomer.projects,
        selectedCustomer.partnerProjects,
        selectedCustomer.electricityCustomerProjects,
        selectedCustomer.otherCustomerProjects,
        'id'
      )
      // Filter remove users
      const removedUsers = selectedCustomer.users.filter(user => !data.users.includes(user.id))

      await Promise.all([
        dispatch(
          editCustomer({ id: selectedCustomer.id, ...data }, customerParams)
        ),
        ...(data.users.map(userId => {
          const selectedUser = userData.find(user => user.id === userId)
          const user = {
            id: userId,
            customers: [selectedCustomer.id],
            projects: [],
            fullName: selectedUser.fullName
          }

          if (selectedUser?.group?.type === USER_ROLE.SITE_PORTAL_ADMIN.VALUE) {
            user.projects = unionProjects.map(project => project.id)
          }

          //TODO Dont need to check this condition, because users were filtered at userEffect
          return selectedUser?.group?.type !== USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE
          && selectedUser?.group?.type !== USER_ROLE.ADMIN_PORTAL_USER.VALUE
            ? dispatch(editUser(user, null, null, true))
            : null
        })),
        ...(removedUsers.map(rmUser => {
          const selectedUser = userData.find(user => user.id === rmUser.id)
          const user = {
            id: rmUser.id,
            customers: [],
            projects: [],
            fullName: selectedUser.fullName
          }

          return selectedUser?.group?.type !== USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE
          && selectedUser?.group?.type !== USER_ROLE.ADMIN_PORTAL_USER.VALUE
            ? dispatch(editUser(user, null, null, true))
            : null
        }))
      ])
    } else {
      dispatch(
        addCustomer({
          ...data
        }, customerParams)
      )
    }

    setIsShowCustomerDetail(false)
    reset(initCustomer)
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
    setIsShowCustomerDetail(false)
  }

  useEffect(async () => {
    if (isEditCustomer || isViewCustomer) {
      const tempSelectedProjects = []
      const tempSelectedUsers = []

      if (selectedCustomer?.users?.length > 0) {
        selectedCustomer.users.forEach((user) => {
          tempSelectedUsers.push({
            label: user.fullName,
            value: user.id
          })
        })
      }

      setAvatar(selectedCustomer.avatar
        ? selectedCustomer.avatar
        : DEFAULT_AVATAR)
      reset({
        ...selectedCustomer,
        avatar: null,
        fullName: selectedCustomer.fullName
          ? selectedCustomer.fullName
          : '',
        code: selectedCustomer.code
          ? selectedCustomer.code
          : '',
        email: selectedCustomer.email
          ? selectedCustomer.email
          : '',
        address: selectedCustomer.address
          ? selectedCustomer.address
          : '',
        phone: selectedCustomer.phone
          ? selectedCustomer.phone
          : '',
        users: tempSelectedUsers,
        projects: tempSelectedProjects
      })
    } else {
      setAvatar(DEFAULT_AVATAR)
      reset(initCustomer)
    }
  }, [selectedCustomer, isShowCustomerDetail])

  return (
    <Modal
      isOpen={isShowCustomerDetail}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={handleCancel}>
          <FormattedMessage id={customerDetailTitle}/>
        </ModalHeader>
        <ModalBody>
          <Media className='add-user'>
            <div className='position-relative'>
              <img
                src={avatar}
                alt='avatar'
                height='100'
                width='100'
                onError={() => {
                  setAvatar(defaultAvatar)
                }}
              />
              {
                !isViewCustomer &&
                <Button.Ripple
                  tag={Label}
                  className='edit-profile'
                  color='primary'
                >
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
              }

            </div>
            {
              !isViewCustomer &&
              <>
                <Button.Ripple
                  color='secondary'
                  className='reset-avatar'
                  outline
                >
                  <FormattedMessage id='Reset'/>
                </Button.Ripple>
                <span>
                  <FormattedMessage
                    id='Avatar upload limit'
                    values={{ size: 1 }}
                  />
                </span>
              </>
            }
          </Media>
          <FormGroup>
            <Label for='fullName'>
              <FormattedMessage id='Company name'/>
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='fullName'
              name='fullName'
              innerRef={register({ required: true })}
              invalid={!!errors.fullName}
              valid={getValues('fullName') !== '' && getValues('fullName') !== undefined && !errors.fullName}
              placeholder={PLACEHOLDER.COMPANY_NAME}
              readOnly={isViewCustomer}
            />
            {errors && errors.fullName && <FormFeedback>{errors.fullName.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for='address'><FormattedMessage id='Address'/><span className='text-danger'>&nbsp;*</span></Label>
            <Input
              id='address'
              name='address'
              innerRef={register({ required: true })}
              invalid={!!errors.address}
              valid={getValues('address') !== '' && getValues('address') !== undefined && !errors.address}
              placeholder={PLACEHOLDER.ADDRESS}
              readOnly={isViewCustomer}
            />
            {errors && errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for='code'>
              <FormattedMessage id='Customer code'/>
              <span className='text-danger'>&nbsp;*</span>
            </Label>
            <Input
              id='code'
              name='code'
              innerRef={register({ required: true })}
              invalid={!!errors.code}
              valid={getValues('code') !== '' && getValues('code') !== undefined && !errors.code}
              placeholder={PLACEHOLDER.PROJECT_CODE}
              readOnly={isViewCustomer}
            />
            {errors && errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for='email'><FormattedMessage id='Email'/></Label>
            <Input
              id='email'
              name='email'
              innerRef={register({ required: true })}
              invalid={!!errors.email}
              valid={getValues('email') !== '' && getValues('email') !== undefined && !errors.email}
              placeholder={PLACEHOLDER.EMAIL}
              readOnly={isViewCustomer}
            />
            {errors && errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for='phone'><FormattedMessage id='Phone'/></Label>
            <Input
              id='phone'
              name='phone'
              innerRef={register({ required: true })}
              invalid={!!errors.phone}
              valid={getValues('phone') !== '' && getValues('phone') !== undefined && !errors.phone}
              placeholder={PLACEHOLDER.PHONE}
              readOnly={isViewCustomer}
            />
            {errors && errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
          </FormGroup>
          {
            (isEditCustomer || isViewCustomer) &&
            <FormGroup>
              <Label for='users'><FormattedMessage id='Assigned users'/></Label>
              <Controller
                as={Select}
                control={control}
                isClearable
                isMulti
                theme={selectThemeColors}
                defaultValue={selectedCustomer && selectedCustomer.users
                  ? selectedCustomer.users
                  : null}
                name='users'
                id='users'
                options={userOptions}
                className='react-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select users' })}
                isDisabled={isViewCustomer}
              />
            </FormGroup>
          }
          {/*{*/}
          {/*  (isEditCustomer || isViewCustomer) &&*/}
          {/*  <FormGroup>*/}
          {/*    <Label for='projects'><FormattedMessage id='Assigned projects' /></Label> */}
          {/*    <SelectWithCheckbox*/}
          {/*      options={projectOptions}*/}
          {/*      value={selectedProjects}*/}
          {/*      setSelectedProjects={setSelectedProjects}*/}
          {/*    />*/}
          {/*  </FormGroup>*/}
          {/*}*/}
        </ModalBody>
        {
          !isViewCustomer &&
          <ModalFooter>
            <Button
              color='primary'
              type='submit'
            >
              <FormattedMessage
                id={isEditCustomer
                  ? 'Update'
                  : 'Add'}
              />
            </Button>
            <Button
              color='secondary'
              onClick={handleCancel}
            >
              <FormattedMessage id='Cancel'/>
            </Button>
          </ModalFooter>
        }
      </Form>
    </Modal>
  )
}

CustomerDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowCustomerDetail: PropTypes.bool.isRequired,
  setIsShowCustomerDetail: PropTypes.func.isRequired,
  customerDetailTitle: PropTypes.string.isRequired,
  isEditCustomer: PropTypes.bool.isRequired,
  isViewCustomer: PropTypes.bool.isRequired
}

export default injectIntl(CustomerDetail)
