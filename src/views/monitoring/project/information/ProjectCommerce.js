// ** Third party components
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'
import { X } from 'react-feather'
import {
  FormattedMessage,
  injectIntl
} from 'react-intl'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  useContext,
  useEffect,
  useState
} from 'react'
import {
  Controller,
  useForm
} from 'react-hook-form'
import Select from 'react-select'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import PropTypes from 'prop-types'
import { v4 as uuidV4 } from 'uuid'

// ** Custom components
import { PROJECT_BUSINESS_MODEL_OPTIONS } from '@constants/project'
import {
  PLACEHOLDER,
  STATE as STATUS
} from '@constants/common'
import {
  selectThemeColors,
  numberWithCommas
} from '@utils'
import { VN_PHONE_REGEX } from '@constants/regex'
import {
  editProject,
  getElectricity
} from '@src/views/monitoring/projects/store/actions'
import { AbilityContext } from '@src/utility/context/Can'
import { USER_ABILITY } from '@constants/user'
import { getAllCustomers } from '@src/views/settings/customers/store/actions'
import { ReactComponent as IconPlus } from '@src/assets/images/svg/table/ic-plus-btn.svg'

const ProjectCommerce = ({ intl }) => {
  // ** Ability Context
  const ability = useContext(AbilityContext)

  // ** Store Vars
  const dispatch = useDispatch(),
    {
      customer: { allData: customerData },
      customerProject: { selectedProject }
    } = useSelector((state) => state),

    [contacts, setContacts] = useState([]),
    [customerOptions, setCustomerOptions] = useState([]),
    [contractsList, setContractsList] = useState([]),
    [selectedPartner, setSelectedPartner] = useState(null),
    [selectedCustomer, setSelectedCustomer] = useState(null),
    [selectedEVN, setSelectedEVN] = useState(null),
    [selectedOther, setSelectedOther] = useState(null),

    [selectedPartnerContract, setSelectedPartnerContract] = useState(null),
    [selectedCustomerContract, setSelectedCustomerContract] = useState(null),
    [selectedEVNContract, setSelectedEVNContract] = useState(null),
    [selectedOtherContract, setSelectedOtherContract] = useState(null)

  // Calculation
  const currentDCPower = selectedProject?.wattageDC
  const currentACPower = selectedProject?.wattageAC
  const powerPercentage = currentDCPower > 0
    ? numberWithCommas(currentACPower / currentDCPower * 100)
    : 0

  // ** Init schema
  const [initSchema, setInitSchema] = useState(null)

  useEffect(() => {
    const validatePartner = ({ schemas, type, value }) => {
      if (schemas.length > 0) {
        const result = schemas.filter(key => key?.includes(type))
        return (result?.length > 0 && value !== null) || result?.length < 1
      }
      return false
    }

    // Set initSchema
    setInitSchema({
      partnerType: yup.string(),
      partnerContractLink: yup.string(),
      partnerContract: yup.string().when('partnerContractLink', {
        is: (partnerContractLink) => partnerContractLink.length > 0,
        then: yup.string().required(intl.formatMessage({ id: 'Partner contract is invalid' })),
        otherwise: yup.string()
      }),
      customerContractLink: yup.string(),
      customerContract: yup.string().when('customerContractLink', {
        is: (customerContractLink) => customerContractLink.length > 0,
        then: yup.string().required(intl.formatMessage({ id: 'Customer contract is invalid' })),
        otherwise: yup.string()
      }),
      evnContractLink: yup.string(),
      evnContract: yup.string().when('evnContractLink', {
        is: (evnContractLink) => evnContractLink.length > 0,
        then: yup.string().required(intl.formatMessage({ id: 'EVN contract is invalid' })),
        otherwise: yup.string()
      }),
      otherContractLink: yup.string(),
      otherContract: yup.string().when('otherContractLink', {
        is: (otherContractLink) => otherContractLink.length > 0,
        then: yup.string().required(intl.formatMessage({ id: 'Other contract is invalid' })),
        otherwise: yup.string()
      }),
      partnerField: yup.object()
        .typeError(intl.formatMessage({ id: 'Partner is required' }))
        .required(intl.formatMessage({ id: 'Partner is required' })),
      customerField: yup.mixed()
        .test(
          'customerField',
          intl.formatMessage({ id: 'Customer field is invalid' }),
          (value, textContext) => {
            return validatePartner({ schemas: Object.keys(textContext.parent), type: 'CUSTOMER', value })
          }
        ),
      otherField: yup.mixed()
        .test(
          'otherField',
          intl.formatMessage({ id: 'Other field is invalid' }),
          (value, textContext) => {
            return validatePartner({ schemas: Object.keys(textContext.parent), type: 'OTHER', value })
          }
        )
    })
  }, [contacts])

  const [dynamicSchema, setDynamicSchema] = useState(initSchema)

  // Selected Partner, Customer, EVN, Other Contract
  useEffect(() => {
    if (contractsList) {
      const currentPartnerContract = contractsList.find(partner => partner.type === 1)
      if (currentPartnerContract) {
        setSelectedPartnerContract({
          label: currentPartnerContract.code,
          value: currentPartnerContract.url
        })
      } else {
        setSelectedPartnerContract({
          label: '',
          value: ''
        })
      }

      const currentCustomerContract = contractsList.find(customer => customer.type === 2)
      if (currentCustomerContract) {
        setSelectedCustomerContract({
          label: currentCustomerContract.code,
          value: currentCustomerContract.url
        })
      } else {
        setSelectedCustomerContract({
          label: '',
          value: ''
        })
      }

      const currentEVNContract = contractsList.find(evn => evn.type === 3)
      if (currentEVNContract) {
        setSelectedEVNContract({
          label: currentEVNContract.code,
          value: currentEVNContract.url
        })
      } else {
        setSelectedEVNContract({
          label: '',
          value: ''
        })
      }

      const currentOtherContract = contractsList.find(other => other.type === 4)
      if (currentOtherContract) {
        setSelectedOtherContract({
          label: currentOtherContract.code,
          value: currentOtherContract.url
        })
      } else {
        setSelectedOtherContract({
          label: '',
          value: ''
        })
      }
    } else {
      setSelectedPartnerContract({
        label: '',
        value: ''
      })
      setSelectedEVNContract({
        label: '',
        value: ''
      })
      setSelectedCustomerContract({
        label: '',
        value: ''
      })
      setSelectedOtherContract({
        label: '',
        value: ''
      })
    }
  }, [contractsList])

  // Set customer options
  useEffect(() => {
    if (customerData?.length) {
      setCustomerOptions(
        customerData.map((customer) => (
          {
            label: customer.fullName,
            value: customer.id,
            code: customer.code
          }
        ))
      )
    }

  }, [customerData])

  // Get contracts list
  useEffect(() => {
    if (selectedProject?.contracts?.length) {
      setContractsList(
        selectedProject?.contracts.map((contract) => (
          {
            code: contract.code,
            url: contract.url,
            type: contract.type
          }
        ))
      )
    } else {
      setContractsList([])
    }

  }, [selectedProject?.contracts])

  // Dispatch getAllCustomer, Electricity
  useEffect(() => {
    dispatch(
      getAllCustomers({
        fk: JSON.stringify(['users', 'projects']),
        state: [STATUS.ACTIVE].toString(),
        rowsPerPage: -1
      })
    )
    dispatch(
      getElectricity({
        state: [STATUS.ACTIVE].toString(),
        order: 'name asc',
        rowsPerPage: -1
      })
    )
  }, [])

  const SignupSchema = yup.object().shape(dynamicSchema, ['investor'])

  const { control, register, errors, handleSubmit, reset, getValues, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  // Selected Partner, Customer, EVN, Other
  useEffect(() => {
    if (selectedProject?.contacts) {
      // Selected partner
      if (selectedProject?.partnerId) {
        setSelectedPartner({
          label: selectedProject?.partner?.fullName,
          value: selectedProject?.partner?.id
        })
        setValue('partnerField.label', `${selectedProject?.partner?.fullName}`)
        setValue('partnerField.value', `${selectedProject?.partner?.id}`)
      } else {
        setSelectedPartner(null)
      }

      // Selected customer
      if (selectedProject?.customerId) {
        setSelectedCustomer({
          label: selectedProject?.customer?.fullName,
          value: selectedProject?.customer?.id
        })
        setValue('customerField.label', `${selectedProject?.customer?.fullName}`)
        setValue('customerField.value', `${selectedProject?.customer?.id}`)
      } else {
        setSelectedCustomer(null)
      }

      // Selected other
      if (selectedProject?.otherCustomerId) {
        setSelectedOther({
          label: selectedProject?.otherCustomer?.fullName,
          value: selectedProject?.otherCustomer?.id
        })
        setValue('otherField.label', `${selectedProject?.otherCustomer?.fullName}`)
        setValue('otherField.value', `${selectedProject?.otherCustomer?.id}`)
      } else {
        setSelectedOther(null)
      }

      // Selected EVN
      if (selectedProject?.electricityCustomerId && selectedProject?.electricityCustomer) {
        setSelectedEVN(selectedProject?.electricityCustomer?.fullName)
      } else {
        setSelectedEVN(null)
      }
    } else {
      setSelectedPartner(null)
      setSelectedCustomer(null)
      setSelectedOther(null)
      setSelectedEVN(null)
    }
  }, [selectedProject?.contacts])

  const pushDynamicSchema = ({ id, type }) => {
    setDynamicSchema((currentState) => {
      return {
        ...currentState,
        [`contactFullName-${type}-${id}`]: yup
          .string()
          .test(
            'contactFullName',
            intl.formatMessage({ id: 'Full name is invalid - min - max' }, { min: 3, max: 256 }),
            (value) => !value || value === '' || (
              value.length >= 3 && value.length <= 256
            )
          ),
        [`contactPosition-${type}-${id}`]: yup
          .string()
          .test(
            'investor',
            intl.formatMessage({ id: 'Position is invalid - min - max' }, { min: 3, max: 256 }),
            (value) => !value || value === '' || (
              value.length >= 3 && value.length <= 256
            )
          ),
        [`contactPhone-${type}-${id}`]: yup
          .string()
          .matches(VN_PHONE_REGEX, intl.formatMessage({ id: 'Phone number is invalid' })),
        [`contactEmail-${type}-${id}`]: yup
          .string()
          .email(intl.formatMessage({ id: 'Email is invalid' })),
        partnerType: yup.string()
      }
    })
  }

  // Submit Form
  const onSubmit = async (data) => {
    const cleanData = { ...data }

    if (contacts.length > 0) {
      const filterContacts = contacts
      // Remove Other contact when un-select Other in dropdown list
      if (cleanData.otherField === null) {
        const otherRemove = filterContacts.filter(({ type }) => {
          return type !== 'OTHER'
        })
        filterContacts.splice(0, filterContacts.length)
        otherRemove.forEach(({ id, customerId, customerName, type, fullName, position, phone, email }) => {
          filterContacts.push({
            id, customerId, customerName, type, fullName, position, phone, email
          })
        })
      }
      // Remove Partner contact when un-select Partner in dropdown list
      if (cleanData.partnerField === null) {
        const partnerRemove = filterContacts.filter(({ type }) => {
          return type !== 'PARTNER'
        })
        filterContacts.splice(0, filterContacts.length)
        partnerRemove.forEach(({ id, customerId, customerName, type, fullName, position, phone, email }) => {
          filterContacts.push({
            id, customerId, customerName, type, fullName, position, phone, email
          })
        })
      }
      // Remove Customer contact when un-select Customer in dropdown list
      if (cleanData.customerField === null) {
        const customerRemove = filterContacts.filter(({ type }) => {
          return type !== 'CUSTOMER'
        })
        filterContacts.splice(0, filterContacts.length)
        customerRemove.forEach(({ id, customerId, customerName, type, fullName, position, phone, email }) => {
          filterContacts.push({
            id, customerId, customerName, type, fullName, position, phone, email
          })
        })
      }

      const tempData = []
      filterContacts.forEach(({ id, type, customerId, customerName }) => {
        // Assign customerId for contacts list when change Partner, Customer, EVN, Other dropdown list
        const assignId = () => {
          if (type === 'PARTNER' && cleanData.partnerField !== null) {
            return cleanData.partnerField.value
          }
          if (type === 'CUSTOMER' && cleanData.customerField !== null) {
            return cleanData.customerField.value
          }
          if (type === 'ENV') {
            return selectedProject?.electricityCustomer?.id
          }
          if (type === 'OTHER' && cleanData.otherField !== null) {
            return cleanData.otherField.value
          } else return customerId
        }
        const customerIdAssign = assignId()

        // Assign customerName for contacts list when change Partner, Customer, EVN, Other dropdown list
        const assignName = () => {
          if (type === 'PARTNER' && cleanData.partnerField !== null) {
            return cleanData.partnerField.label
          }
          if (type === 'CUSTOMER' && cleanData.customerField !== null) {
            return cleanData.customerField.label
          }
          if (type === 'ENV') {
            return selectedProject?.electricityCustomer?.fullName
          }
          if (type === 'OTHER' && cleanData.otherField !== null) {
            return cleanData.otherField.label
          } else return customerName
        }
        const customerNameAssign = assignName()

        tempData.push({
          fullName: cleanData[`contactFullName-${type}-${id}`]
            ? cleanData[`contactFullName-${type}-${id}`]
            : '',
          position: cleanData[`contactPosition-${type}-${id}`]
            ? cleanData[`contactPosition-${type}-${id}`]
            : '',
          phone: cleanData[`contactPhone-${type}-${id}`]
            ? cleanData[`contactPhone-${type}-${id}`]
            : '',
          email: cleanData[`contactEmail-${type}-${id}`]
            ? cleanData[`contactEmail-${type}-${id}`]
            : '',
          type,
          customerId: customerIdAssign,
          customerName: customerNameAssign
        })

        delete cleanData[`contactFullName-${type}-${id}`]
        delete cleanData[`contactPosition-${type}-${id}`]
        delete cleanData[`contactPhone-${type}-${id}`]
        delete cleanData[`contactEmail-${type}-${id}`]
      })
      const existPartner = tempData.find(partner => partner.type === 'PARTNER')
        ? 1
        : 0
      const existCustomer = tempData.find(customer => customer.type === 'CUSTOMER')
        ? 1
        : 0
      const existEVN = tempData.find(evn => evn.type === 'ENV')
        ? 1
        : 0
      const existOther = tempData.find(other => other.type === 'OTHER')
        ? 1
        : 0

      if (existPartner === 0 && cleanData.partnerField !== null && cleanData.partnerField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'PARTNER',
          customerId: cleanData.partnerField.value,
          customerName: cleanData.partnerField.label
        })
      }
      if (existCustomer === 0 && cleanData.customerField !== null && cleanData.customerField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'CUSTOMER',
          customerId: cleanData.customerField.value,
          customerName: cleanData.customerField.label
        })
      }
      if (existEVN === 0 && cleanData.evnField !== null && cleanData.evnField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'ENV',
          customerId: selectedProject?.electricityId,
          customerName: selectedProject?.electricity?.name
        })
      }
      if (existOther === 0 && cleanData.otherField !== null && cleanData.otherField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'OTHER',
          customerId: cleanData.otherField.value,
          customerName: cleanData.otherField.label
        })
      }
      // Remove the contacts have same content => only get unique value  
      const unique = Array.from(new Set(tempData.map(JSON.stringify))).map(JSON.parse)
      cleanData.contacts = [...unique]
    }

    // Push new contact information if contacts list have not any contact item
    if (contacts.length === 0) {
      const tempData = []
      if (cleanData.partnerField !== null && cleanData.partnerField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'PARTNER',
          customerId: cleanData.partnerField.value,
          customerName: cleanData.partnerField.label
        })
      }
      if (cleanData.customerField !== null && cleanData.customerField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'CUSTOMER',
          customerId: cleanData.customerField.value,
          customerName: cleanData.customerField.label
        })
      }
      if (cleanData.evnField !== null && cleanData.evnField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'ENV',
          customerId: selectedProject?.electricityId,
          customerName: selectedProject?.electricity?.name
        })
      }
      if (cleanData.otherField !== null && cleanData.otherField !== undefined) {
        tempData.push({
          fullName: '',
          position: '',
          phone: '',
          email: '',
          type: 'OTHER',
          customerId: cleanData.otherField.value,
          customerName: cleanData.otherField.label
        })
      }
      // Remove the contacts have same content => only get unique value
      const uniqueContact = Array.from(new Set(tempData.map(JSON.stringify))).map(JSON.parse)
      cleanData.contacts = [...uniqueContact]
    }

    // Get contracts array list from UI
    const contractsInput = [
      { type: 1, name: 'default name', code: cleanData.partnerContract, url: cleanData.partnerContractLink },
      { type: 2, name: 'default name', code: cleanData.customerContract, url: cleanData.customerContractLink },
      { type: 3, name: 'default name', code: cleanData.evnContract, url: cleanData.evnContractLink },
      { type: 4, name: 'default name', code: cleanData.otherContract, url: cleanData.otherContractLink }
    ]
    const clearTempData = contractsInput.filter((check) => {
      if (check.code !== '') {
        return check
      }
    })
    cleanData.contracts = [...clearTempData]
    const partnerId = cleanData.partnerField?.value || 0
    const customerId = cleanData.customerField?.value || 0
    const otherCustomerId = cleanData.otherField?.value || 0

    delete cleanData[`partnerField`]
    delete cleanData[`customerField`]
    delete cleanData[`evnField`]
    delete cleanData[`otherField`]

    delete cleanData[`partnerContract`]
    delete cleanData[`partnerContractLink`]
    delete cleanData[`customerContract`]
    delete cleanData[`customerContractLink`]
    delete cleanData[`evnContract`]
    delete cleanData[`evnContractLink`]
    delete cleanData[`otherContract`]
    delete cleanData[`otherContractLink`]
    delete cleanData[`model`]

    dispatch(
      editProject(
        {
          ...cleanData,
          id: selectedProject.id,
          type: cleanData?.type?.value,
          partnerId,
          customerId,
          otherCustomerId
        }
      )
    )
  }

  const initForm = () => {
    // Set values for contacts form input
    if (selectedProject?.contacts?.length) {
      const tempData = []
      selectedProject.contacts.forEach(({ type, fullName, position, phone, email, customerId, customerName }) => {
        const id = uuidV4()
        tempData.push({ id, type, fullName, position, phone, email, customerId, customerName })
        pushDynamicSchema({ id, type })
      })
      setContacts([...tempData])
    }

    reset({
      ...selectedProject,
      type: selectedProject?.type
        ? PROJECT_BUSINESS_MODEL_OPTIONS.find((option) => option.value === selectedProject.type)
        : null,
      customer: selectedProject?.customer?.fullName
        ? {
          label: selectedProject.customer.fullName,
          value: selectedProject.customer.id,
          code: selectedProject.customer.code
        }
        : null,
      partnerField: selectedPartner
        ? { label: selectedPartner?.label, value: selectedPartner?.value }
        : null,
      customerField: selectedCustomer
        ? { label: selectedCustomer?.label, value: selectedCustomer?.value }
        : null,
      evnField: selectedEVN
        ? selectedEVN
        : null,
      otherField: selectedOther
        ? { label: selectedOther?.label, value: selectedOther?.value }
        : null
    })
  }

  useEffect(async () => {
    // Reset dynamic schema
    setDynamicSchema(initSchema)
    initForm()
  }, [selectedProject, selectedPartner, selectedCustomer, selectedEVN, selectedOther])

  // Delete contact item
  const deleteForm = ({ id: formId, type }) => {
    const itemIndex = contacts.findIndex((contact) => contact.id === formId)

    if (itemIndex > -1) {
      const tempContacts = [...contacts]
      tempContacts.splice(itemIndex, 1)
      setContacts(tempContacts)

      setDynamicSchema((currentState) => {
        delete currentState[`contactFullName-${type}-${formId}`]
        delete currentState[`contactPosition-${type}-${formId}`]
        delete currentState[`contactPhone-${type}-${formId}`]
        delete currentState[`contactEmail-${type}-${formId}`]
        return {
          ...currentState
        }
      })
    }
  }

  // Add new contact for UI
  const addContactUI = (typeContact) => {
    const id = uuidV4()
    const initContact = [{ initContactId: '', initContactName: '' }]

    contacts.forEach(({ type, customerId, customerName }) => {
      if (type === typeContact) {
        initContact.push({
          initContactId: customerId,
          initContactName: customerName
        })
      }
    })

    setContacts((currentState) => {
      return [
        ...currentState,
        {
          id,
          type: typeContact,
          customerId: initContact[initContact.length - 1].initContactId
            ? initContact[initContact.length - 1].initContactId
            : '',
          customerName: initContact[initContact.length - 1].initContactName
            ? initContact[initContact.length - 1].initContactName
            : '',
          fullName: '',
          position: '',
          phone: '',
          email: '',
          check: 1
        }
      ]
    })
    pushDynamicSchema({ id, type: typeContact })
  }

  // Style CSS
  const columnPaddingStyle = {
    paddingLeft: '0px'
  }
  const labelMarginStyle = {
    marginBottom: '0px'
  }

  return (
    <>
      <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Row>
          <Row>
            <Col
              lg={2}
              md={4}
              sm={12}
              className='sidebar-project pl-1 pr-1'
            >
              <span className='project-name'>{selectedProject?.name}</span>
              <aside className='level1'>
                <span>{selectedProject?.code}</span>
                <span>{selectedProject?.electricityCode}</span>
                <span>{selectedProject?.electricityName}</span>
              </aside>
              <aside className='level2'>
                <span>
                  {numberWithCommas(currentDCPower / 1000)} kWp
                </span>
                <span>
                  <FormattedMessage id='Project DC power'/>
                </span>
              </aside>
              <aside className='level2'>
                <span>
                  {numberWithCommas(currentACPower / 1000)} kW
                </span>
                <span>
                  <FormattedMessage id='Project AC power'/>
                </span>
              </aside>
              <aside className='level2'>
                <span className='percent'>
                  {powerPercentage}&nbsp;%
                </span>
                <span>
                  <FormattedMessage id='AC/DC ratio'/>
                </span>
              </aside>
            </Col>
            <Col lg={10}>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for='type'>
                      <FormattedMessage id='Commerce model'/>
                    </Label>
                    <Controller
                      as={Select}
                      control={control}
                      theme={selectThemeColors}
                      defaultValue={selectedProject?.type
                        ? selectedProject.type
                        : null}
                      name='type'
                      id='type'
                      options={PROJECT_BUSINESS_MODEL_OPTIONS}
                      className='react-select--project line-select'
                      classNamePrefix='select'
                      placeholder={intl.formatMessage({ id: 'Select business model' })}
                      formatOptionLabel={(option) => <>{intl.formatMessage({ id: option.label })}</>}
                      isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                    />
                  </FormGroup>
                </Col>

                {/* Partner contract */}
                <Col md={4}>
                  <Col
                    md={12}
                    style={columnPaddingStyle}
                  >
                    <FormGroup style={labelMarginStyle}>
                      <Label for='partnerContract'>
                        <FormattedMessage id='Partner contract'/>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='partnerContract'
                          name='partnerContract'
                          defaultValue={selectedPartnerContract?.label}
                          innerRef={register({ required: true })}
                          invalid={!!errors.partnerContract}
                          placeholder={intl.formatMessage({ id: 'Contract code' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.partnerContract &&
                        <FormFeedback>{errors.partnerContract.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='partnerContractLink'
                          name='partnerContractLink'
                          defaultValue={selectedPartnerContract?.value}
                          innerRef={register({ required: true })}
                          invalid={!!errors.partnerContractLink}
                          placeholder={intl.formatMessage({ id: 'Contract link' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.partnerContractLink &&
                        <FormFeedback>{errors.partnerContractLink.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>

                {/* Customer contract */}
                <Col md={4}>
                  <Col
                    md={12}
                    style={columnPaddingStyle}
                  >
                    <FormGroup style={labelMarginStyle}>
                      <Label for='customerContract'>
                        <FormattedMessage id='Customer contract'/>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='customerContract'
                          name='customerContract'
                          defaultValue={selectedCustomerContract?.label}
                          innerRef={register({ required: true })}
                          invalid={!!errors.customerContract}
                          placeholder={intl.formatMessage({ id: 'Contract code' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.customerContract &&
                        <FormFeedback>{errors.customerContract.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='customerContractLink'
                          name='customerContractLink'
                          defaultValue={selectedCustomerContract?.value}
                          aria-invalid={errors.customerContractLink
                            ? 'true'
                            : 'false'}
                          innerRef={register({ required: true })}
                          invalid={!!errors.customerContractLink}
                          placeholder={intl.formatMessage({ id: 'Contract link' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.customerContractLink &&
                        <FormFeedback>{errors.customerContractLink.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>

                {/* EVN contract */}
                <Col md={4}>
                  <Col
                    md={12}
                    style={columnPaddingStyle}
                  >
                    <FormGroup style={labelMarginStyle}>
                      <Label for='evnContract'>
                        <FormattedMessage id='EVN contract'/>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='evnContract'
                          name='evnContract'
                          defaultValue={selectedEVNContract?.label}
                          innerRef={register({ required: true })}
                          invalid={!!errors.evnContract}
                          placeholder={intl.formatMessage({ id: 'Contract code' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.evnContract && <FormFeedback>{errors.evnContract.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='evnContractLink'
                          name='evnContractLink'
                          defaultValue={selectedEVNContract?.value}
                          innerRef={register({ required: true })}
                          invalid={!!errors.evnContractLink}
                          placeholder={intl.formatMessage({ id: 'Contract link' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.evnContractLink &&
                        <FormFeedback>{errors.evnContractLink.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>

                {/* Other contract */}
                <Col md={4}>
                  <Col
                    md={12}
                    style={columnPaddingStyle}
                  >
                    <FormGroup style={labelMarginStyle}>
                      <Label for='otherContract'>
                        <FormattedMessage id='Other contract'/>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='otherContract'
                          name='otherContract'
                          defaultValue={selectedOtherContract?.label}
                          innerRef={register({ required: true })}
                          invalid={!!errors.otherContract}
                          placeholder={intl.formatMessage({ id: 'Contract code' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.otherContract && <FormFeedback>{errors.otherContract.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          id='otherContractLink'
                          name='otherContractLink'
                          defaultValue={selectedOtherContract?.value}
                          innerRef={register({ required: true })}
                          invalid={!!errors.otherContractLink}
                          placeholder={intl.formatMessage({ id: 'Contract link' })}
                          readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                        />
                        {errors && errors.otherContractLink &&
                        <FormFeedback>{errors.otherContractLink.message}</FormFeedback>}
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Col md={12}>
            <hr/>
          </Col>
          <Col md={12}>
            <br/>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label for='partnerField'>
                <FormattedMessage id='Partner'/>
                <span className='text-danger'>&nbsp;*</span>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable={true}
                theme={selectThemeColors}
                name='partnerField'
                id='partnerField'
                options={customerOptions}
                className='react-select--project line-select'
                classNamePrefix='select'
                innerRef={register({ required: true })}
                invalid={!!errors.partnerField}
                placeholder={intl.formatMessage({ id: 'Select a partner' })}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {
                errors && errors.partnerField &&
                <div className='text-danger font-small-3'>{errors.partnerField.message}</div>
              }
            </FormGroup>
          </Col>

          <Col md={9}>
            {/**Add partner contacts */}
            <Col
              md={12}
              style={{ paddingBottom: '35px' }}
            >
              {contacts.map(({ type, id, fullName, position, phone, email, check }) => {
                if (type === 'PARTNER' && (fullName !== ''
                  || position !== ''
                  || phone !== ''
                  || email !== ''
                  || check === 1)) {
                  return (
                    <Row
                      key={id}
                      className='contact-element'
                    >
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactFullName-${type}-${id}`}>
                            <FormattedMessage id='Full name'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactFullName-${type}-${id}`}
                            name={`contactFullName-${type}-${id}`}
                            defaultValue={fullName}
                            innerRef={register()}
                            invalid={!!errors[`contactFullName-${type}-${id}`]}
                            placeholder={PLACEHOLDER.FULL_NAME}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactFullName-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactFullName-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPosition-${type}-${id}`}>
                            <FormattedMessage id='Position'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactPosition-${type}-${id}`}
                            name={`contactPosition-${type}-${id}`}
                            defaultValue={position}
                            innerRef={register()}
                            invalid={!!errors[`contactPosition-${type}-${id}`]}
                            placeholder={PLACEHOLDER.POSITION}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPosition-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPosition-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPhone-${type}-${id}`}>
                            <FormattedMessage id='Phone'/>
                          </Label>
                          <Input
                            type='number'
                            id={`contactPhone-${type}-${id}`}
                            name={`contactPhone-${type}-${id}`}
                            defaultValue={phone}
                            innerRef={register()}
                            invalid={!!errors[`contactPhone-${type}-${id}`]}
                            placeholder={PLACEHOLDER.PHONE}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPhone-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPhone-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactEmail-${type}-${id}`}>
                            <FormattedMessage id='Email'/>
                          </Label>
                          <Input
                            type='email'
                            id={`contactEmail-${type}-${id}`}
                            name={`contactEmail-${type}-${id}`}
                            defaultValue={email}
                            innerRef={register({ required: true })}
                            invalid={!!errors[`contactEmail-${type}-${id}`]}
                            placeholder={PLACEHOLDER.EMAIL}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactEmail-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactEmail-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                        <Col md={1}>
                          <Button.Ripple
                            id={`btnDelete-${type}-${id}`}
                            color='danger'
                            className='text-nowrap px-1'
                            style={{ marginTop: 24 }}
                            onClick={() => deleteForm({ id, type })}
                            outline
                          >
                            <X
                              size={14}
                              className='mr-50'
                            />
                            <span>
                              <FormattedMessage id='Delete'/>
                            </span>
                          </Button.Ripple>
                        </Col>
                      )}
                      <Col sm={12}>
                        <hr/>
                      </Col>
                    </Row>
                  )
                }
              })}
              {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                <Button.Ripple
                  style={{ padding: '0px', marginTop: '28px' }}
                  color='flat'
                  onClick={() => addContactUI('PARTNER')}
                >
                  <IconPlus/>
                </Button.Ripple>
              )}
            </Col>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label for='customerField'>
                <FormattedMessage id='Customer'/>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable={true}
                theme={selectThemeColors}
                name='customerField'
                id='customerField'
                options={customerOptions}
                className='react-select--project line-select'
                classNamePrefix='select'
                innerRef={register({ required: true })}
                invalid={!!errors.customerField}
                placeholder={intl.formatMessage({ id: 'Select a customer' })}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {
                errors && errors.customerField &&
                <div className='text-danger font-small-3'>{errors.customerField.message}</div>
              }
            </FormGroup>
          </Col>
          <Col md={9}>
            {/**Add customer contacts */}
            <Col
              md={12}
              style={{ paddingBottom: '35px' }}
            >
              {contacts.map(({ type, id, fullName, position, phone, email, check }) => {
                if (type === 'CUSTOMER' && (fullName !== ''
                  || position !== ''
                  || phone !== ''
                  || email !== ''
                  || check === 1)) {
                  return (
                    <Row
                      key={id}
                      className='contact-element'
                    >
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactFullName-${type}-${id}`}>
                            <FormattedMessage id='Full name'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactFullName-${type}-${id}`}
                            name={`contactFullName-${type}-${id}`}
                            defaultValue={fullName}
                            innerRef={register()}
                            invalid={!!errors[`contactFullName-${type}-${id}`]}
                            placeholder={PLACEHOLDER.FULL_NAME}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactFullName-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactFullName-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPosition-${type}-${id}`}>
                            <FormattedMessage id='Position'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactPosition-${type}-${id}`}
                            name={`contactPosition-${type}-${id}`}
                            defaultValue={position}
                            innerRef={register()}
                            invalid={!!errors[`contactPosition-${type}-${id}`]}
                            placeholder={PLACEHOLDER.POSITION}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPosition-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPosition-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPhone-${type}-${id}`}>
                            <FormattedMessage id='Phone'/>
                          </Label>
                          <Input
                            type='number'
                            id={`contactPhone-${type}-${id}`}
                            name={`contactPhone-${type}-${id}`}
                            defaultValue={phone}
                            innerRef={register()}
                            invalid={!!errors[`contactPhone-${type}-${id}`]}
                            placeholder={PLACEHOLDER.PHONE}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPhone-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPhone-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactEmail-${type}-${id}`}>
                            <FormattedMessage id='Email'/>
                          </Label>
                          <Input
                            type='email'
                            id={`contactEmail-${type}-${id}`}
                            name={`contactEmail-${type}-${id}`}
                            defaultValue={email}
                            innerRef={register({ required: true })}
                            invalid={!!errors[`contactEmail-${type}-${id}`]}
                            placeholder={PLACEHOLDER.EMAIL}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactEmail-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactEmail-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                        <Col md={1}>
                          <Button.Ripple
                            id={`btnDelete-${type}-${id}`}
                            color='danger'
                            className='text-nowrap px-1'
                            style={{ marginTop: 24 }}
                            onClick={() => deleteForm({ id, type })}
                            outline
                          >
                            <X
                              size={14}
                              className='mr-50'
                            />
                            <span>
                              <FormattedMessage id='Delete'/>
                            </span>
                          </Button.Ripple>
                        </Col>
                      )}
                      <Col sm={12}>
                        <hr/>
                      </Col>
                    </Row>
                  )
                }
              })}
              {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                <Button.Ripple
                  style={{ padding: '0px', marginTop: '28px' }}
                  color='flat'
                  onClick={() => addContactUI('CUSTOMER')}
                >
                  <IconPlus/>
                </Button.Ripple>
              )}
            </Col>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label for='evnField'>
                <FormattedMessage id='EVN'/>
              </Label>
              <Input
                id='evnField'
                name='evnField'
                disabled
                defaultValue={null}
                innerRef={register({ required: true })}
                invalid={!!errors.evnField}
                valid={getValues('evnField') !== '' && getValues('evnField') !== undefined && !errors.evnField}
              />
              {
                errors && errors.evnField &&
                <div className='text-danger font-small-3'>{errors.evnField.message}</div>
              }
            </FormGroup>
          </Col>
          <Col md={9}>
            {/**Add EVN contacts*/}
            <Col
              md={12}
              style={{ paddingBottom: '35px' }}
            >
              {contacts.map(({ type, id, fullName, position, phone, email, check }) => {
                if (type === 'ENV' && (fullName !== ''
                  || position !== ''
                  || phone !== ''
                  || email !== ''
                  || check === 1)) {
                  return (
                    <Row
                      key={id}
                      className='contact-element'
                    >
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactFullName-${type}-${id}`}>
                            <FormattedMessage id='Full name'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactFullName-${type}-${id}`}
                            name={`contactFullName-${type}-${id}`}
                            defaultValue={fullName}
                            innerRef={register()}
                            invalid={!!errors[`contactFullName-${type}-${id}`]}
                            placeholder={PLACEHOLDER.FULL_NAME}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactFullName-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactFullName-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPosition-${type}-${id}`}>
                            <FormattedMessage id='Position'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactPosition-${type}-${id}`}
                            name={`contactPosition-${type}-${id}`}
                            defaultValue={position}
                            innerRef={register()}
                            invalid={!!errors[`contactPosition-${type}-${id}`]}
                            placeholder={PLACEHOLDER.POSITION}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPosition-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPosition-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPhone-${type}-${id}`}>
                            <FormattedMessage id='Phone'/>
                          </Label>
                          <Input
                            type='number'
                            id={`contactPhone-${type}-${id}`}
                            name={`contactPhone-${type}-${id}`}
                            defaultValue={phone}
                            innerRef={register()}
                            invalid={!!errors[`contactPhone-${type}-${id}`]}
                            placeholder={PLACEHOLDER.PHONE}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPhone-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPhone-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactEmail-${type}-${id}`}>
                            <FormattedMessage id='Email'/>
                          </Label>
                          <Input
                            type='email'
                            id={`contactEmail-${type}-${id}`}
                            name={`contactEmail-${type}-${id}`}
                            defaultValue={email}
                            innerRef={register({ required: true })}
                            invalid={!!errors[`contactEmail-${type}-${id}`]}
                            placeholder={PLACEHOLDER.EMAIL}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactEmail-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactEmail-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                        <Col md={1}>
                          <Button.Ripple
                            id={`btnDelete-${type}-${id}`}
                            color='danger'
                            className='text-nowrap px-1'
                            style={{ marginTop: 24 }}
                            onClick={() => deleteForm({ id, type })}
                            outline
                          >
                            <X
                              size={14}
                              className='mr-50'
                            />
                            <span>
                              <FormattedMessage id='Delete'/>
                            </span>
                          </Button.Ripple>
                        </Col>
                      )}
                      <Col sm={12}>
                        <hr/>
                      </Col>
                    </Row>
                  )
                }
              })}
              {/**End add contact */}
              {selectedProject?.electricityCustomerId && selectedProject?.electricityCustomer
                ? <div>
                  {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                    <Button.Ripple
                      style={{ padding: '0px', marginTop: '28px' }}
                      color='flat'
                      onClick={() => addContactUI('ENV')}
                    >
                      <IconPlus/>
                    </Button.Ripple>
                  )}
                </div>
                : null}

            </Col>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label for='otherField'>
                <FormattedMessage id='Other'/>
              </Label>
              <Controller
                as={Select}
                control={control}
                isClearable={true}
                theme={selectThemeColors}
                name='otherField'
                id='otherField'
                options={customerOptions}
                className='react-select--project line-select'
                classNamePrefix='select'
                innerRef={register({ required: true })}
                invalid={!!errors.otherField}
                valid={getValues('otherField') !== '' && getValues('otherField') !== undefined && !errors.otherField}
                placeholder={intl.formatMessage({ id: 'Select an other' })}
                isDisabled={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
              />
              {
                errors && errors.otherField &&
                <div className='text-danger font-small-3'>{errors.otherField.message}</div>
              }
            </FormGroup>
          </Col>
          <Col md={9}>
            {/* Add other contacts */}
            <Col
              md={12}
              style={{ paddingBottom: '35px' }}
            >
              {contacts.map(({ type, id, fullName, position, phone, email, check }) => {
                if (type === 'OTHER' && (fullName !== ''
                  || position !== ''
                  || phone !== ''
                  || email !== ''
                  || check === 1)) {
                  return (
                    <Row
                      key={id}
                      className='contact-element'
                    >
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactFullName-${type}-${id}`}>
                            <FormattedMessage id='Full name'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactFullName-${type}-${id}`}
                            name={`contactFullName-${type}-${id}`}
                            defaultValue={fullName}
                            innerRef={register()}
                            invalid={!!errors[`contactFullName-${type}-${id}`]}
                            placeholder={PLACEHOLDER.FULL_NAME}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactFullName-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactFullName-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPosition-${type}-${id}`}>
                            <FormattedMessage id='Position'/>
                          </Label>
                          <Input
                            type='text'
                            id={`contactPosition-${type}-${id}`}
                            name={`contactPosition-${type}-${id}`}
                            defaultValue={position}
                            innerRef={register()}
                            invalid={!!errors[`contactPosition-${type}-${id}`]}
                            placeholder={PLACEHOLDER.POSITION}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPosition-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPosition-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactPhone-${type}-${id}`}>
                            <FormattedMessage id='Phone'/>
                          </Label>
                          <Input
                            type='number'
                            id={`contactPhone-${type}-${id}`}
                            name={`contactPhone-${type}-${id}`}
                            defaultValue={phone}
                            innerRef={register()}
                            invalid={!!errors[`contactPhone-${type}-${id}`]}
                            placeholder={PLACEHOLDER.PHONE}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactPhone-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactPhone-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col
                        md={3}
                        style={{ width: '22%', flex: '0 0 22%' }}
                      >
                        <FormGroup>
                          <Label for={`contactEmail-${type}-${id}`}>
                            <FormattedMessage id='Email'/>
                          </Label>
                          <Input
                            type='email'
                            id={`contactEmail-${type}-${id}`}
                            name={`contactEmail-${type}-${id}`}
                            defaultValue={email}
                            innerRef={register({ required: true })}
                            invalid={!!errors[`contactEmail-${type}-${id}`]}
                            placeholder={PLACEHOLDER.EMAIL}
                            readOnly={ability.cannot('manage', USER_ABILITY.MANAGE_PROJECT)}
                          />
                          {errors && errors[`contactEmail-${type}-${id}`] && (
                            <FormFeedback>{errors[`contactEmail-${type}-${id}`].message}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                        <Col md={1}>
                          <Button.Ripple
                            id={`btnDelete-${type}-${id}`}
                            color='danger'
                            className='text-nowrap px-1'
                            style={{ marginTop: 24 }}
                            onClick={() => deleteForm({ id, type })}
                            outline
                          >
                            <X
                              size={14}
                              className='mr-50'
                            />
                            <span>
                              <FormattedMessage id='Delete'/>
                            </span>
                          </Button.Ripple>
                        </Col>
                      )}
                      <Col sm={12}>
                        <hr/>
                      </Col>
                    </Row>
                  )
                }
              })}
              {/**End add contact */}
              {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
                <Button.Ripple
                  style={{ padding: '0px', marginTop: '28px' }}
                  color='flat'
                  onClick={() => addContactUI('OTHER')}
                >
                  <IconPlus/>
                </Button.Ripple>
              )}
            </Col>
          </Col>

        </Row>
        {ability.can('manage', USER_ABILITY.MANAGE_PROJECT) && (
          <Row>
            <Col className='d-flex justify-content-end'>
              <Button
                className='mr-1'
                color='primary'
                type='submit'
              >
                <FormattedMessage id='Update'/>
              </Button>
              <Button
                color='secondary'
                onClick={initForm}
              >
                <FormattedMessage id='Cancel'/>
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </>
  )
}

ProjectCommerce.propTypes = {
  intl: PropTypes.object
}

export default injectIntl(ProjectCommerce)
