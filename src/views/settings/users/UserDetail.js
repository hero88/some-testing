// ** Import React
import {
  useContext,
  useEffect,
  useState
} from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'

// ** Third Party Components
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import {
  Button,
  CustomInput,
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
import * as yup from 'yup'
import {
  useForm,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import classnames from 'classnames'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import { AlertTriangle } from 'react-feather'
import axios from 'axios'
import {
  Slide,
  toast
} from 'react-toastify'

// ** Custom component
import {
  selectThemeColors,
  showToast
} from '@utils'
import {
  addUser,
  editUser
} from '@src/views/settings/users/store/actions'
import InputPasswordToggle from '@components/input-password-toggle'
import {
  PASSWORD_REGEX,
  VN_PHONE_REGEX
} from '@constants/regex'
import Avatar from '@components/avatar'
import { API_POST_MEDIA } from '@constants/api'
import {
  DEFAULT_AVATAR,
  PLACEHOLDER
} from '@constants/common'
import {
  USER_ABILITY,
  USER_ROLE
} from '@constants/user'
import { AbilityContext } from '@src/utility/context/Can'
import SelectWithCheckbox from '@src/views/common/SelectWithCheckBox'
import _unionBy from 'lodash/unionBy'

const UserDetail = ({
  intl,
  isEditUser,
  isShowUserDetail,
  setIsShowUserDetail,
  userDetailTitle
}) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      auth: { userData, group },
      user: { params, selectedUser },
      project: { allData: projectData },
      customer: { allData: customerData }
    } = useSelector(store => store)

  const [projectOptions, setProjectOptions] = useState([]),
    [selectedCustomer, setSelectedCustomer] = useState([]),
    [selectedProjects, setSelectedProjects] = useState([]),
    [customerOptions, setCustomerOptions] = useState([]),
    [avatar, setAvatar] = useState(isEditUser
      ? selectedUser.avatar
      : DEFAULT_AVATAR),
    [roleOptions, setRoleOptions] = useState([])

  useEffect(() => {
    if (group && group.length) {
      setRoleOptions(group.map(item => (
        {
          label: item.name,
          value: item.id
        }
      )).splice(0, 4))
    }
  }, [group])

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
    if (projectData?.length) {
      setProjectOptions(projectData.map((project) => (
        {
          label: project.code,
          value: project.id
        }
      )))
    }
  }, [projectData])

  useEffect(() => {
    if (customerData?.length) {
      setCustomerOptions(customerData.map((customer) => (
        {
          label: customer.fullName,
          value: customer.id
        }
      )))
    }
  }, [customerData])

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .required(intl.formatMessage({ id: 'Username is required' }))
      .email(intl.formatMessage({ id: 'Username is invalid' })),
    password: yup.string()
      .when('confirmPassword', {
        is: () => {
          // Don't validate password in editing mode if password isn't input
          // eslint-disable-next-line no-use-before-define
          return !isEditUser || (
            // eslint-disable-next-line no-use-before-define
            getValues('password') && getValues('password').length > 0
          )
        },
        then: yup.string()
          .required(intl.formatMessage({ id: 'Password is required' }))
          .min(8, intl.formatMessage({ id: 'Password is invalid - min' }, { min: 8 }))
          .max(256, intl.formatMessage({ id: 'Password is invalid - max' }, { max: 256 }))
          .matches(
            PASSWORD_REGEX,
            intl.formatMessage({ id: 'Password is not match' })
          ),
        otherwise: yup.string()
      }),
    confirmPassword: yup.string()
      .when('password', {
        is: value => !isEditUser || (
          value && value.length > 0
        ),
        then: yup.string()
          .required(intl.formatMessage({ id: 'Password is required' }))
          .oneOf([yup.ref(`password`), null], intl.formatMessage({ id: 'Password must match' })),
        otherwise: yup.string()
          .oneOf([yup.ref(`password`), null], intl.formatMessage({ id: 'Password must match' }))
      }),
    fullName: yup.string()
      .required(intl.formatMessage({ id: 'Full name is required' }))
      .min(4, intl.formatMessage({ id: 'Full name is invalid - min' }, { min: 4 }))
      .max(256, intl.formatMessage({ id: 'Full name is invalid - max' }, { max: 256 })),
    phone: yup.string()
      .matches(
        VN_PHONE_REGEX,
        intl.formatMessage({ id: 'Phone number is invalid' })
      ),
    customer: yup.object()
      .when('role', {
        is: value => {
          return value.label === USER_ROLE.SITE_PORTAL_ADMIN.LABEL || value.label === USER_ROLE.SITE_PORTAL_USER.LABEL
        },
        then: yup.object()
          .required(intl.formatMessage({ id: 'Customer is required' }))
          .typeError(intl.formatMessage({ id: 'Customer is required' }))
          .oneOf(customerOptions, intl.formatMessage({ id: 'Customer is invalid' })),
        otherwise: yup.object().nullable(true)
      })
  }, ['password', 'confirmPassword', 'role'])

  const {
    register,
    errors,
    clearErrors,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = async (data) => {
    const cleanData = pickBy(data, identity)

    cleanData.avatar =
      avatar !== DEFAULT_AVATAR
        ? avatar
        : undefined
    cleanData.groupId =
      cleanData.role
        ? cleanData.role.value
        : undefined
    cleanData.role = undefined

    if (cleanData.customer) {
      cleanData.customers = [cleanData.customer.value]
    } else {
      cleanData.customers = []
    }

    delete cleanData.customer

    cleanData.projects = selectedProjects.filter(project => project.value !== '*').map(project => project.value)

    if (isEditUser) {
      dispatch(editUser(
        {
          id: selectedUser.id,
          ...cleanData
        },
        params,
        userData?.user?.id
      ))
    } else {
      dispatch(addUser(cleanData, params))
    }

    setIsShowUserDetail(false)
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
    setIsShowUserDetail(false)
  }

  useEffect(async () => {
    setAvatar(
      isEditUser && selectedUser?.avatar && selectedUser.avatar !== ''
        ? selectedUser.avatar
        : DEFAULT_AVATAR
    )

    if (isEditUser) {
      let tempSelectedCustomer = null
      const tempSelectedProjects = []

      if (selectedUser?.customers?.length > 0) {
        tempSelectedCustomer = customerOptions.find(customer => customer.value === selectedUser.customers?.[0]?.id)
      }

      if (selectedUser?.projects?.length > 0) {
        selectedUser.projects.forEach((project) => {
          tempSelectedProjects.push({
            label: project.code,
            value: project.id
          })
        })

        if ((tempSelectedProjects.length > 1) && (tempSelectedProjects.length === projectOptions.length)) {
          tempSelectedProjects.unshift({
            label: 'Select all',
            value: '*'
          })
        }
      }

      setSelectedCustomer(tempSelectedCustomer)
      setSelectedProjects(tempSelectedProjects)

      reset({
        ...selectedUser,
        avatar: null,
        phone: selectedUser.phone
          ? selectedUser.phone
          : null,
        projects: tempSelectedProjects,
        customer: tempSelectedCustomer,
        role: { label: selectedUser?.group.name, value: selectedUser?.group.id }
      })

    } else {
      reset({
        role: roleOptions[0]
      })
      setSelectedCustomer(null)
      setSelectedProjects([])
    }

  }, [selectedUser, isShowUserDetail])

  const getRole = (userRole) => {
    return roleOptions.filter(role => role.value === userRole)[0]
  }

  const resetAvatar = () => {
    setAvatar(isEditUser && selectedUser?.avatar
      ? selectedUser.avatar
      : DEFAULT_AVATAR)
    setValue('avatar', null)
  }

  /**
   * + User thuộc admin portal (admin và user) mặc định là nhân viên REE, để trống field "Công ty" không cho điền
   * + Admin portal - admin: tự động chọn xem được tất cả dự án, không cần tick list dự án
   * + Admin portal - user: tick chọn các  dự án được xem
   * + Site portal - admin: Khi chọn quyền này, bắt buộc chọn field "Công ty". Khi đó mặc định cho phép xem tất cả dự
   * án thuộc công ty (khách hàng) đó
   * + Site portal - user: Khi chọn quyền này, bắt buộc chọn field "Công ty". Khi đó cho phép tick chọn 1 trong số các
   * dự án thuộc công ty (khách hàng) đó mà user đó được xem
   * **/
  useEffect(() => {
    const customerOption = watch('customer')
    const roleOption = watch('role')

    // User thuộc admin portal (admin và user) mặc định là nhân viên REE,
    // để trống field "Công ty" không cho điền
    if (roleOption?.label === USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL
      || roleOption?.label === USER_ROLE.ADMIN_PORTAL_USER.LABEL) {
      setValue('customer', null)
    }

    if (roleOption?.label === USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL
      || roleOption?.label === USER_ROLE.ADMIN_PORTAL_USER.LABEL
    ) {
      if (projectData?.length) {
        const filteredProjectOptions = projectData.map((project) => (
          {
            label: project.code,
            value: project.id
          }
        ))

        setProjectOptions(filteredProjectOptions)

        if (roleOption?.label === USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL) {
          setSelectedProjects(() => {
            const filteredSelectedProjects = [...filteredProjectOptions]

            // Checking if selected options has the same length with customer projects
            if ((filteredSelectedProjects.length > 1)
              && (filteredProjectOptions.length === filteredSelectedProjects.length)
              && filteredSelectedProjects.findIndex(op => op.value === '*') === -1
            ) {
              filteredSelectedProjects.unshift({
                label: 'Select all',
                value: '*'
              })
            }

            return filteredSelectedProjects
          })
        } else {
          setSelectedProjects([])
        }
      }
    } else if (customerOption) {
      const tempFilter = customerData.find(customer => customer.id === customerOption.value)
      const unionProjects = _unionBy(
        tempFilter.projects,
        tempFilter.partnerProjects,
        tempFilter.electricityCustomerProjects,
        tempFilter.otherCustomerProjects,
        'id'
      )

      if (unionProjects?.length > 0) {
        const filteredProjectOptions = unionProjects.map(project => (
          {
            label: project.code,
            value: project.id
          }
        ))
        setProjectOptions(filteredProjectOptions)

        setSelectedProjects((currentState) => {
          let filteredSelectedProjects = currentState?.filter(option => filteredProjectOptions.findIndex(op => option.value
            === op.value) > -1)

          if (roleOption?.label === USER_ROLE.SITE_PORTAL_ADMIN.LABEL) {
            filteredSelectedProjects = [...filteredProjectOptions]
          }

          // Checking if selected options has the same length with customer projects
          if ((filteredSelectedProjects.length > 1)
            && (filteredProjectOptions.length === filteredSelectedProjects.length)
            && filteredSelectedProjects.findIndex(op => op.value === '*') === -1
          ) {
            filteredSelectedProjects.unshift({
              label: 'Select all',
              value: '*'
            })
          }

          return filteredSelectedProjects
        })
      } else {
        setProjectOptions([])
        setSelectedProjects([])
      }
    }
  }, [watch('customer'), watch('role'), isShowUserDetail])

  return (
    <Modal
      isOpen={isShowUserDetail}
      className='modal-dialog-centered'
      backdrop='static'
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={handleCancel}>
          <FormattedMessage id={userDetailTitle}/>
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
                  setAvatar(DEFAULT_AVATAR)
                }}
              />
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
            </div>
            <Button.Ripple
              color='secondary'
              className='reset-avatar'
              outline
              onClick={resetAvatar}
            >
              <FormattedMessage id='Reset'/>
            </Button.Ripple>
            <span>
              <FormattedMessage
                id='Avatar upload limit'
                values={{ size: 1 }}
              />
            </span>
          </Media>
          <FormGroup>
            <Label for='username'><FormattedMessage id='Username'/><span className='text-danger'>&nbsp;*</span></Label>
            <Input
              id='username'
              name='username'
              readOnly={isEditUser}
              autoComplete='on'
              innerRef={register({ required: true })}
              invalid={!!errors.username}
              valid={getValues('username') !== '' && getValues('username') !== undefined && !errors.username}
              placeholder={PLACEHOLDER.USERNAME}
            />
            {errors && errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
          </FormGroup>
          {
            !isEditUser &&
            <>
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
                  innerRef={register({ required: !isEditUser })}
                  invalid={!!errors.password}
                  valid={getValues('password') !== '' && getValues('password') !== undefined && !errors.password}
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
                  innerRef={register({ required: !isEditUser })}
                  invalid={!!errors.confirmPassword}
                  valid={getValues('confirmPassword')
                  !== ''
                  && getValues('confirmPassword')
                  !== undefined
                  && !errors.confirmPassword}
                  className={classnames('input-group-merge', {
                    'is-invalid': errors['confirmPassword']
                  })}
                />
                {errors && errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
              </FormGroup>
            </>
          }
          <FormGroup>
            <Label for='fullName'><FormattedMessage id='Full name'/><span className='text-danger'>&nbsp;*</span></Label>
            <Input
              id='fullName'
              name='fullName'
              innerRef={register({ required: true })}
              invalid={!!errors.fullName}
              valid={getValues('fullName') !== '' && getValues('fullName') !== undefined && !errors.fullName}
              placeholder={PLACEHOLDER.FULL_NAME}
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
              placeholder={PLACEHOLDER.PHONE}
            />
            {errors && errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
          </FormGroup>
          {
            (
              ability.can('edit', USER_ABILITY.EDIT_ADMIN_PORTAL_ADMIN) ||
              (
                ability.can('edit', USER_ABILITY.EDIT_ANOTHER_USER)
                && selectedUser?.group?.type !== USER_ROLE.ADMIN_PORTAL_ADMIN.VALUE
              )
            ) &&
            <FormGroup>
              <Label for='role'><FormattedMessage id='Role'/></Label>
              <Controller
                as={Select}
                control={control}
                isClearable={false}
                theme={selectThemeColors}
                defaultValue={selectedUser && selectedUser.group
                  ? getRole(selectedUser.group.id)
                  : roleOptions[0]}
                name='role'
                id='role'
                options={roleOptions}
                className='react-select'
                classNamePrefix='select'
                formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
              />
            </FormGroup>
          }
          {
            watch('role')?.label !== USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL
            && watch('role')?.label !== USER_ROLE.ADMIN_PORTAL_USER.LABEL
            && <FormGroup>
              <Label for='customer'><FormattedMessage id='Company'/></Label>
              <Controller
                as={Select}
                control={control}
                isClearable={true}
                theme={selectThemeColors}
                defaultValue={selectedCustomer}
                name='customer'
                id='customer'
                options={customerOptions}
                className='react-select'
                classNamePrefix='select'
                placeholder={intl.formatMessage({ id: 'Select a company' })}
                isDisabled={
                  watch('role')?.label === USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL
                  || watch('role')?.label === USER_ROLE.ADMIN_PORTAL_USER.LABEL
                }
              />
              {errors && errors.customer && <div className='text-danger font-small-3'>{errors.customer.message}</div>}
            </FormGroup>
          }
          {
            watch('role')?.label !== USER_ROLE.ADMIN_PORTAL_ADMIN.LABEL &&
            <FormGroup>
              <Label for='projects'><FormattedMessage id='Projects'/></Label>
              <SelectWithCheckbox
                options={projectOptions}
                value={selectedProjects}
                setSelectedProjects={setSelectedProjects}
              />
            </FormGroup>
          }

          {
            !isEditUser &&
            <FormGroup>
              <CustomInput
                type='checkbox'
                className='custom-control-Primary'
                id='isSendEmail'
                name='isSendEmail'
                innerRef={register()}
                label={intl.formatMessage({ id: 'Send email after creating new account successfully' })}
                defaultChecked
                inline
              />
            </FormGroup>
          }
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            type='submit'
          >
            <FormattedMessage
              id={isEditUser
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
      </Form>
    </Modal>
  )
}

UserDetail.propTypes = {
  intl: PropTypes.object.isRequired,
  isShowUserDetail: PropTypes.bool.isRequired,
  setIsShowUserDetail: PropTypes.func.isRequired,
  userDetailTitle: PropTypes.string.isRequired,
  isEditUser: PropTypes.bool.isRequired
}

export default injectIntl(UserDetail)
