// ** React Imports
import React, { useContext, useEffect, useState } from 'react'

// ** Third Party Components
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin } from 'react-feather'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'
import withReactContent from 'sweetalert2-react-content'
import SweetAlert from 'sweetalert2'

// ** Custom Components
import { addProject, createProjectAutomatically, editProject } from './store/actions'
import { selectThemeColors } from '@utils'
import { PROJECT_BUSINESS_MODEL_OPTIONS, PROJECT_STATUS } from '@constants/project'
import { getProvinceOptions } from '@constants/province'
import { PROJECT_CODE, VN_PHONE_REGEX } from '@constants/regex'
import GetLocationModal from '@src/views/settings/projects/GetLocationModal'
import { useHistory } from 'react-router-dom'
import { ROUTER_URL } from '@constants/router'
import { PLACEHOLDER } from '@constants/common'
import { USER_ABILITY } from '@constants/user'
import classnames from 'classnames'
import { AbilityContext } from '@src/utility/context/Can'

const MySweetAlert = withReactContent(SweetAlert)

const ProjectDetail = ({
  isShowProjectDetail,
  setIsShowProjectDetail,
  projectDetailTitle,
  isEditProject,
  isAutoCreateProject,
  selectedProjectsSite,
  setSelectedProjectsSite,
  intl
}) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      auth: { userData },
      customerProject: { industrialAreas, investors },
      project: { params, selectedProject, autoCreateProject },
      customer: { allData: customerData },
      layout: { skin }
    } = useSelector((state) => state),
    history = useHistory(),
    [openLocationMap, setOpenLocationMap] = useState({ isOpen: false, isECoordinate: false }),
    [projectLocation, setProjectLocation] = useState(null),
    [customerOptions, setCustomerOptions] = useState([]),
    [industrialAreaOptions, setIndustrialAreaOptions] = useState([]),
    [investorOptions, setInvestorOptions] = useState([]),
    [provinceOptions, setProvinceOptions] = useState([]),
    [isAddingDevice, setIsAddingDevice] = useState(false)

  const statusOptions = [
    { value: PROJECT_STATUS.ACTIVE, label: 'Active' },
    { value: PROJECT_STATUS.INACTIVE, label: 'Inactive' },
    { value: PROJECT_STATUS.WARNING, label: 'Warning' },
    { value: PROJECT_STATUS.DANGER, label: 'Danger' }
  ]

  useEffect(() => {
    if (customerData?.length) {
      setCustomerOptions(
        customerData.map((customer) => ({
          label: customer.fullName,
          value: customer.id,
          code: customer.code
        }))
      )
    }
  }, [customerData])

  useEffect(() => {
    if (industrialAreas?.length) {
      setIndustrialAreaOptions(
        industrialAreas.map((area) => ({
          label: area.name,
          value: area.id
        }))
      )
    }
  }, [industrialAreas])

  // Set investor options
  useEffect(() => {
    if (investors?.length) {
      setInvestorOptions(
        investors.map((investor) => ({
          label: investor.name,
          value: investor.id
        }))
      )
    }
  }, [investors])

  useEffect(() => {
    if (isAddingDevice && selectedProject?.isAddDevice) {
      setIsAddingDevice(false)
      history.push({
        pathname: ROUTER_URL.PROJECT_DEVICES,
        search: `?customerId=${selectedProject.customer.id}&projectId=${selectedProject.id}&isAddDevice=true`
      })
    }
  }, [selectedProject])

  const SignupSchema = yup.object().shape(
    {
      name: yup
        .string()
        .required(intl.formatMessage({ id: 'Project name is required' }))
        .min(3, intl.formatMessage({ id: 'Project name is invalid - min' }, { min: 3 }))
        .max(256, intl.formatMessage({ id: 'Project name is invalid - max' }, { max: 256 })),
      code: yup
        .string()
        .required(intl.formatMessage({ id: 'Project code is required' }))
        .min(4, intl.formatMessage({ id: 'Project code is invalid - min' }, { min: 4 }))
        .max(256, intl.formatMessage({ id: 'Project code is invalid - max' }, { max: 256 }))
        .matches(PROJECT_CODE, intl.formatMessage({ id: 'Must be uppercase' })),
      address: yup
        .string()
        .required(intl.formatMessage({ id: 'Address is required' }))
        .min(3, intl.formatMessage({ id: 'Address is invalid - min' }, { min: 3 }))
        .max(256, intl.formatMessage({ id: 'Address is invalid - max' }, { max: 256 })),
      phone: yup.string().matches(VN_PHONE_REGEX, intl.formatMessage({ id: 'Phone number is invalid' })),
      startDate: yup.mixed()
        .required(intl.formatMessage({ id: 'Start date is required' }))
        .typeError(intl.formatMessage({ id: 'Start date is invalid' })),
      investor: yup.object()
        .required(intl.formatMessage({ id: 'Investor is required' }))
        .typeError(intl.formatMessage({ id: 'Investor is invalid' }))
        .oneOf(investorOptions, intl.formatMessage({ id: 'Investor is invalid' })),
      partner: yup.object()
        .required(intl.formatMessage({ id: 'Partner is required' }))
        .typeError(intl.formatMessage({ id: 'Partner is invalid' }))
        .oneOf(customerOptions, intl.formatMessage({ id: 'Partner is invalid' })),
      province: yup.object()
        .required(intl.formatMessage({ id: 'Province is required' }))
        .typeError(intl.formatMessage({ id: 'Province is invalid' }))
        .oneOf(provinceOptions, intl.formatMessage({ id: 'Province is invalid' })),
      industrialArea: yup.object()
        .required(intl.formatMessage({ id: 'Industrial area is required' }))
        .typeError(intl.formatMessage({ id: 'Industrial area is invalid' }))
        .oneOf(industrialAreaOptions, intl.formatMessage({ id: 'Industrial area is invalid' })),
      type: yup.object()
        .required(intl.formatMessage({ id: 'Business model is required' }))
        .typeError(intl.formatMessage({ id: 'Business model is invalid' }))
        .oneOf(PROJECT_BUSINESS_MODEL_OPTIONS, intl.formatMessage({ id: 'Business model is invalid' }))
    },
    ['investor']
  )

  const { control, register, errors, handleSubmit, reset, setValue, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  /**
   * Update contacts when chaning customer
   * @param {string} customerType
   * @param {[]} contacts
   * @param {bool} isUpdate
   * @param {object} selectedCustomer
   * @returns {*[]}
   */
  const updateContacts = ({ customerType, contacts, isUpdate, selectedCustomer }) => {
    const tempContacts = []

    if (contacts?.length > 0) {
      if (isUpdate) {
        contacts?.forEach(({ type, customerId, customerName, fullName, position, phone, email }) => {
          tempContacts.push({
            type,
            customerId: type === customerType && customerName !== selectedCustomer.label
              ? selectedCustomer.value
              : customerId,
            customerName: type === customerType && customerName !== selectedCustomer.label
              ? selectedCustomer.label
              : customerName,
            fullName,
            position,
            phone,
            email
          })
        })
      } else {
        tempContacts.push(...(contacts.filter(contact => contact.type !== customerType)))
      }
    }

    return tempContacts
  }

  const onSubmit = async (data, isAddDevice = false) => {
    const cleanData = pickBy(data, identity)
    setIsAddingDevice(isAddDevice)
    let tempContacts = selectedProject?.contacts?.length > 0 ? [...selectedProject?.contacts] : []

    if (projectLocation) {
      cleanData.lat = projectLocation.lat
      cleanData.lng = projectLocation.lng
    }

    if (cleanData.customer) {
      cleanData.customerId = cleanData.customer.value
      tempContacts = updateContacts({
        contacts: tempContacts,
        customerType: 'CUSTOMER',
        isUpdate: true,
        selectedCustomer: cleanData.customer
      })
    } else {
      cleanData.customerId = 0
      tempContacts = updateContacts({
        contacts: tempContacts,
        customerType: 'CUSTOMER',
        isUpdate: false,
        selectedCustomer: cleanData.customer
      })
    }

    if (cleanData.partner) {
      cleanData.partnerId = cleanData.partner.value
      tempContacts = updateContacts({
        contacts: tempContacts,
        customerType: 'PARTNER',
        isUpdate: true,
        selectedCustomer: cleanData.partner
      })
    } else {
      cleanData.partnerId = 0
      tempContacts = updateContacts({
        contacts: tempContacts,
        customerType: 'PARTNER',
        isUpdate: false,
        selectedCustomer: cleanData.partner
      })
    }

    if (cleanData.otherCustomer) {
      cleanData.otherCustomerId = cleanData.otherCustomer.value
      tempContacts = updateContacts({
        contacts: tempContacts,
        customerType: 'OTHER',
        isUpdate: true,
        selectedCustomer: cleanData.otherCustomer
      })
    } else {
      cleanData.otherCustomerId = 0
      tempContacts = updateContacts({
        contacts: tempContacts,
        customerType: 'OTHER',
        isUpdate: false,
        selectedCustomer: cleanData.otherCustomer
      })
    }

    if (cleanData.electricityCustomer) {
      cleanData.electricityCustomerId = cleanData.electricityCustomer.value
    } else {
      cleanData.electricityCustomerId = 0
    }

    if (cleanData.province) {
      cleanData.provinceName = cleanData.province.label
      cleanData.provinceCode = cleanData.province.value
    } else {
      cleanData.provinceName = ''
      cleanData.provinceCode = 0
    }

    if (cleanData.industrialArea) {
      cleanData.industrialAreaId = cleanData.industrialArea.value
      cleanData.industrialAreaName = cleanData.industrialArea.label
    } else {
      cleanData.industrialAreaId = 0
      cleanData.industrialAreaName = ''
    }

    if (cleanData.investor) {
      cleanData.investorId = cleanData.investor.value
      cleanData.investorName = cleanData.investor.label
    } else {
      cleanData.investorId = 0
      cleanData.investorName = ''
    }

    cleanData.contacts = [...tempContacts]
    cleanData.status = cleanData?.status?.value
    cleanData.type = cleanData?.type?.value
    cleanData.substationPower = cleanData?.substationPower ? Number(cleanData?.substationPower) * 1000 : 0
    cleanData.startDate = cleanData?.startDate ? moment(cleanData.startDate[0]).valueOf() : 0
    delete cleanData.province
    delete cleanData.coordinate
    delete cleanData.customer
    delete cleanData.industrialArea
    delete cleanData.investor
    delete cleanData.partner
    delete cleanData.otherCustomer
    delete cleanData.electricityCustomer

    if (isEditProject) {
      await dispatch(
        editProject(
          {
            ...cleanData,
            id: selectedProject?.id,
            userId: userData?.id
          },
          params,
          isAddDevice
        )
      )
    } else if (isAutoCreateProject) {
      cleanData.contacts = []
      await dispatch(
        createProjectAutomatically(
          {
            dtuIds: selectedProjectsSite.map((item) => item.dtuId),
            project: {
              ...cleanData,
              userId: userData?.id,
              status: cleanData?.status?.value
            }
          },
          { ...autoCreateProject?.params }
        )
      )
      setSelectedProjectsSite([])
    } else {
      cleanData.contacts = []
      await dispatch(
        addProject({ ...cleanData, userId: userData?.id, status: cleanData?.status?.value }, params, isAddDevice)
      )
    }

    if (!isEditProject && ability.cannot('manage', USER_ABILITY.NO_NEED_CONFIRM)) {
      await MySweetAlert.fire({
        icon: 'success',
        title: intl.formatMessage({ id: 'Activate project confirm successfully title' }),
        text: intl.formatMessage({ id: 'Activate project confirm successfully message' }),
        customClass: {
          popup: classnames({
            'sweet-alert-popup--dark': skin === 'dark'
          }),
          confirmButton: 'btn btn-success'
        }
      })
    }

    setIsShowProjectDetail(false)
    reset({})
  }

  const handleCancel = () => {
    reset({})
    setIsShowProjectDetail(false)
  }

  useEffect(() => {
    if (projectLocation && projectLocation.lat && projectLocation.lng) {
      setValue('coordinate', `${projectLocation.lat}, ${projectLocation.lng}`)
    } else {
      setValue('coordinate', '')
    }
  }, [projectLocation])

  useEffect(async () => {
    if (isEditProject) {
      if (selectedProject?.lat && selectedProject?.lng) {
        setProjectLocation({
          lat: Number(selectedProject?.lat),
          lng: Number(selectedProject?.lng)
        })
      }

      reset({
        ...selectedProject,
        name: selectedProject?.name ? selectedProject.name : '',
        investor: selectedProject?.investor?.id
          ? investorOptions.find(option => option.value === selectedProject.investor.id)
          : null,
        address: selectedProject?.address ? selectedProject.address : '',
        phone: selectedProject?.phone ? selectedProject.phone : '',
        coordinate:
          selectedProject?.lat && selectedProject.lng
            ? `${selectedProject?.lat}, ${selectedProject?.lng}`
            : projectLocation,
        status: selectedProject?.status
          ? statusOptions.find((option) => option.value === selectedProject.status)
          : null,
        type: selectedProject?.type
          ? PROJECT_BUSINESS_MODEL_OPTIONS.find((option) => option.value === selectedProject.type)
          : null,
        province:
          selectedProject?.provinceCode && selectedProject?.provinceName
            ? provinceOptions.find(option => option.value === selectedProject.provinceCode)
            : null,
        customer: selectedProject?.customer?.id
          ? customerOptions.find(option => option.value === selectedProject.customer.id)
          : null,
        partner: selectedProject?.partner?.id
          ? customerOptions.find(option => option.value === selectedProject.partner.id)
          : null,
        otherCustomer: selectedProject?.otherCustomer?.id
          ? customerOptions.find(option => option.value === selectedProject.otherCustomer.id)
          : null,
        electricityCustomer: selectedProject?.electricityCustomer?.id
          ? customerOptions.find(option => option.value === selectedProject.electricityCustomer.id)
          : null,
        startDate: selectedProject?.startDate ? [new Date(Number(selectedProject?.startDate))] : [new Date()],
        industrialArea: selectedProject?.industrial?.id
          ? industrialAreaOptions.find(option => option.value === selectedProject.industrial.id)
          : null,
        substationPower: selectedProject?.substationPower / 1000
      })
    } else {
      reset({
        name: '',
        investor: null,
        address: '',
        phone: '',
        coordinate: null,
        status: null,
        type: null,
        province: null,
        customer: null,
        partner: null,
        otherCustomer: null,
        electricityCustomer: null,
        startDate: [new Date()],
        industrialArea: null,
        substationPower: 0
      })
    }
  }, [selectedProject, isShowProjectDetail])

  useEffect(() => {
    setProvinceOptions(getProvinceOptions())
  }, [])

  return (
    <>
      <Modal isOpen={isShowProjectDetail} className='modal-dialog-centered modal-project-detail' backdrop='static'>
        <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <ModalHeader toggle={handleCancel}>
            <FormattedMessage id={projectDetailTitle}/>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for='name'>
                    <FormattedMessage id='Project name'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    innerRef={register({ required: true })}
                    invalid={!!errors.name}
                    placeholder={PLACEHOLDER.PROJECT_NAME}
                  />
                  {errors && errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='code'>
                    <FormattedMessage id='Project code'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <InputGroup>
                    <Input
                      id='code'
                      name='code'
                      defaultValue=''
                      innerRef={register({ required: true })}
                      invalid={!!errors.code}
                      placeholder={PLACEHOLDER.PROJECT_CODE}
                    />
                    <InputGroupAddon addonType='append'>
                      {
                        `# ${watch('province')?.value
                          ? watch('province')?.value
                          : ''}${watch('partner')?.code
                          ? `-${watch('partner')?.code}`
                          : ''}${watch('electricityCode')
                          ? `-${watch('electricityCode')}`
                          : ''}`
                      }
                    </InputGroupAddon>
                    {errors && errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='address'>
                    <FormattedMessage id='Address'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Input
                    id='address'
                    name='address'
                    innerRef={register({ required: true })}
                    invalid={!!errors.address}
                    placeholder={PLACEHOLDER.ADDRESS}
                  />
                  {errors && errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='startDate'>
                    <FormattedMessage id='Date of commission'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Controller
                    as={Flatpickr}
                    control={control}
                    defaultValue={selectedProject?.startDate ? new Date(selectedProject?.startDate) : new Date()}
                    id='startDate'
                    name='startDate'
                    className='form-control'
                    options={{
                      dateFormat: 'd/m/Y'
                    }}
                  />
                  {errors && errors.startDate && <FormFeedback>{errors.startDate.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='investor'>
                    <FormattedMessage id='Investor'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable
                    theme={selectThemeColors}
                    defaultValue={
                      selectedProject?.investor?.id
                        ? investors.find(option => option.value === selectedProject.investor.id)
                        : null
                    }
                    id='investor'
                    name='investor'
                    options={investorOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select investor' })}
                  />
                  {errors && errors.investor && <div
                    className='text-danger font-small-3'
                  >{errors.investor.message}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='partner'>
                    <FormattedMessage id='Partner'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={
                      selectedProject?.partner?.id
                        ? customerOptions.find(option => option.value === selectedProject.partner.id)
                        : null
                    }
                    name='partner'
                    id='partner'
                    options={customerOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a customer' })}
                  />
                  {errors && errors.partner && <div
                    className='text-danger font-small-3'
                  >{errors.partner.message}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='customer'>
                    <FormattedMessage id='Customer'/>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={
                      selectedProject?.customer?.id
                        ? customerOptions.find(option => option.value === selectedProject.customer.id)
                        : null
                    }
                    name='customer'
                    id='customer'
                    options={customerOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a customer' })}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for='otherCustomer'>
                    <FormattedMessage id='Other customer'/>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={
                      selectedProject?.otherCustomer?.id
                        ? customerOptions.find(option => option.value === selectedProject.otherCustomer.id)
                        : null
                    }
                    name='otherCustomer'
                    id='otherCustomer'
                    options={customerOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a customer' })}
                  />
                  {errors && errors.otherCustomer && <div
                    className='text-danger font-small-3'
                  >{errors.otherCustomer.message}</div>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='type'>
                    <FormattedMessage id='Business model'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={selectedProject?.type ? selectedProject.type : null}
                    name='type'
                    id='type'
                    options={PROJECT_BUSINESS_MODEL_OPTIONS}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select business model' })}
                    formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                  />
                  {errors && errors.type && <div className='text-danger font-small-3'>{errors.type.message}</div>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='province'>
                    <FormattedMessage id='Province'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={
                      selectedProject?.provinceCode && selectedProject?.provinceName
                        ? provinceOptions?.find(option => option.value === selectedProject.provinceCode)
                        : null
                    }
                    name='province'
                    id='province'
                    options={provinceOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a province' })}
                    formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                  />
                  {errors && errors.province && <div
                    className='text-danger font-small-3'
                  >{errors.province.message}</div>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='industrialArea'>
                    <FormattedMessage id='Industrial area'/>
                    <span className='text-danger'>&nbsp;*</span>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={
                      selectedProject?.industrial?.id
                        ? industrialAreaOptions?.find(option => option.value === selectedProject.industrial.id)
                        : null
                    }
                    name='industrialArea'
                    id='industrialArea'
                    options={industrialAreaOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a industrial area' })}
                  />
                  {errors && errors.industrialArea && <div
                    className='text-danger font-small-3'
                  >{errors.industrialArea.message}</div>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='eName'>
                    <FormattedMessage id='Electricity customer'/>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable
                    theme={selectThemeColors}
                    id='electricityCustomer'
                    name='electricityCustomer'
                    defaultValue={null}
                    options={customerOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a customer' })}
                    isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='phone'>
                    <FormattedMessage id='Phone'/>
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    innerRef={register({ required: true })}
                    invalid={!!errors.phone}
                    placeholder={PLACEHOLDER.PHONE}
                  />
                  {errors && errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='coordinate'>
                    <FormattedMessage id='Coordinate'/>
                  </Label>
                  <InputGroup>
                    <Input
                      id='coordinate'
                      name='coordinate'
                      readOnly
                      innerRef={register({ required: true })}
                      invalid={!!errors.coordinate}
                      placeholder={intl.formatMessage({ id: 'Coordinate' })}
                    />
                    <InputGroupAddon addonType='append'>
                      <Button.Ripple
                        className='btn-icon'
                        outline
                        onClick={() => setOpenLocationMap({ isOpen: true, isECoordinate: false })}
                      >
                        <MapPin size={16}/>
                      </Button.Ripple>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors && errors.coordinate && <FormFeedback>{errors.coordinate.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='substationBrand'>
                    <FormattedMessage id='Transformer manufacturer'/>
                  </Label>
                  <Input
                    id='substationBrand'
                    name='substationBrand'
                    innerRef={register({ required: true })}
                    invalid={!!errors.substationBrand}
                    placeholder={PLACEHOLDER.TRANSFORMER_MANUFACTURER}
                  />
                  {errors && errors.substationBrand && <FormFeedback>{errors.substationBrand.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='substationPower'>
                    <FormattedMessage id='Transformer capacity'/> (KVA)
                  </Label>
                  <Input
                    className='h-100'
                    type='number'
                    id='substationPower'
                    name='substationPower'
                    innerRef={register({ required: true })}
                    invalid={!!errors.substationPower}
                    placeholder={PLACEHOLDER.TRANSFORMER_CAPACITY}
                  />
                  {errors && errors.substationPower && <FormFeedback>{errors.substationPower.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for='status'>
                    <FormattedMessage id='Status'/>
                  </Label>
                  <Controller
                    as={Select}
                    control={control}
                    isClearable={true}
                    theme={selectThemeColors}
                    defaultValue={selectedProject?.status ? selectedProject.status : null}
                    name='status'
                    id='status'
                    options={statusOptions}
                    className='react-select'
                    classNamePrefix='select'
                    placeholder={intl.formatMessage({ id: 'Select a status' })}
                    formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>
              <FormattedMessage id={isEditProject ? 'Update' : 'Add'}/>
            </Button>
            {!isAutoCreateProject && !isEditProject && ability.cannot('need confirm', USER_ABILITY.NEED_TO_CONFIRM) && (
              <Button className='d-none' color='primary' onClick={handleSubmit((data) => onSubmit(data, true))}>
                <FormattedMessage id={isEditProject ? 'Add new device' : 'Add project and device'}/>
              </Button>
            )}
            <Button color='secondary' onClick={handleCancel}>
              <FormattedMessage id='Cancel'/>
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      {openLocationMap && (
        <GetLocationModal
          isOpen={openLocationMap.isOpen}
          setIsOpen={setOpenLocationMap}
          projectLocation={projectLocation}
          setProjectLocation={setProjectLocation}
        />
      )}
    </>
  )
}

ProjectDetail.propTypes = {
  isShowProjectDetail: PropTypes.bool.isRequired,
  setIsShowProjectDetail: PropTypes.func.isRequired,
  projectDetailTitle: PropTypes.string.isRequired,
  isEditProject: PropTypes.bool.isRequired,
  isAutoCreateProject: PropTypes.bool.isRequired,
  selectedProjectsSite: PropTypes.array,
  setSelectedProjectsSite: PropTypes.func,
  intl: PropTypes.object.isRequired
}

export default injectIntl(ProjectDetail)
